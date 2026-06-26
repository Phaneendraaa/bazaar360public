import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUserFromRequest } from '@/lib/jwt';

// Helper function to create slug
function createSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${base}-${Math.random().toString(36).substring(2, 7)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const featuredOnly = searchParams.get('featured') === 'true';
    
    // Check if user is admin
    const isAdmin = !!getAdminUserFromRequest(request);
    
    const where: any = {};
    
    // Search query matching product title (case-insensitive)
    if (search) {
      where.title = {
        contains: search,
      };
    }
    
    // Filter by featured status
    if (featuredOnly) {
      where.isFeatured = true;
    }
    
    // If NOT admin, only show active products
    if (!isAdmin) {
      where.status = 'ACTIVE';
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate Admin
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      originalPrice,
      images,
      video,
      stockQuantity,
      SKU,
      tags,
      status,
      isFeatured,
    } = body;

    // Validation
    if (!title || !description || price === undefined || !SKU) {
      return NextResponse.json(
        { error: 'Title, description, price, and SKU are required' },
        { status: 400 }
      );
    }

    // Check SKU uniqueness
    const existingProduct = await prisma.product.findUnique({
      where: { SKU },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = createSlug(title);
    
    // Verify slug uniqueness (just in case)
    let slugExists = await prisma.product.findUnique({ where: { slug } });
    while (slugExists) {
      slug = createSlug(title);
      slugExists = await prisma.product.findUnique({ where: { slug } });
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        images: images || [],
        video: video || null,
        stockQuantity: parseInt(stockQuantity) || 0,
        SKU,
        tags: tags || [],
        status: status || 'ACTIVE',
        isFeatured: !!isFeatured,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
