import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUserFromRequest } from '@/lib/jwt';

// Helper to generate a unique random order number (e.g. BZ-638291)
async function generateOrderNumber(): Promise<string> {
  let orderNumber = '';
  let exists = true;
  
  while (exists) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    orderNumber = `BZ-${randomDigits}`;
    
    const count = await prisma.order.count({
      where: { orderNumber },
    });
    exists = count > 0;
  }
  
  return orderNumber;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      phoneNumber,
      alternateNumber,
      houseNumber,
      street,
      landmark,
      city,
      state,
      pinCode,
      notes,
      productSlug,
      quantity,
    } = body;

    // 1. Validation
    if (
      !customerName ||
      !phoneNumber ||
      !houseNumber ||
      !street ||
      !city ||
      !state ||
      !pinCode ||
      !productSlug ||
      !quantity
    ) {
      return NextResponse.json(
        { error: 'All shipping details, product slug, and quantity are required' },
        { status: 400 }
      );
    }

    const orderQty = parseInt(quantity);
    if (isNaN(orderQty) || orderQty <= 0) {
      return NextResponse.json(
        { error: 'Order quantity must be a positive integer' },
        { status: 400 }
      );
    }

    // 2. Fetch the product
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Product is currently not available' },
        { status: 400 }
      );
    }

    if (product.stockQuantity < orderQty) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${product.stockQuantity} items left.` },
        { status: 400 }
      );
    }

    // 3. Setup pricing and charges
    const price = product.price;
    const codCharges = 0; // Flat Cash on Delivery charge (0 as default)
    const totalAmount = price * orderQty + codCharges;

    // Generate unique order number
    const orderNumber = await generateOrderNumber();

    // 4. Create the Order & Update Product Stock in a database transaction
    const [order, updatedProduct] = await prisma.$transaction([
      prisma.order.create({
        data: {
          orderNumber,
          customerName,
          phoneNumber,
          alternateNumber: alternateNumber || null,
          houseNumber,
          street,
          landmark: landmark || null,
          city,
          state,
          pinCode,
          notes: notes || null,
          productName: product.title,
          productSlug: product.slug,
          quantity: orderQty,
          price,
          codCharges,
          totalAmount,
          status: 'PENDING',
        },
      }),
      prisma.product.update({
        where: { id: product.id },
        data: {
          stockQuantity: {
            decrement: orderQty,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      order,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to place order. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate Admin
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { phoneNumber: { contains: search } },
        { orderNumber: { contains: search } },
        { productName: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
