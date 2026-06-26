import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUserFromRequest } from '@/lib/jwt';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate Admin
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Fetch current order
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const oldStatus = order.status;
    const newStatus = status;

    if (oldStatus === newStatus) {
      return NextResponse.json(order);
    }

    // Database transaction to update order status and product stock if cancelling/uncancelling
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // If order is cancelled, return items to stock
      if (newStatus === 'CANCELLED' && oldStatus !== 'CANCELLED') {
        const product = await tx.product.findUnique({
          where: { slug: order.productSlug },
        });
        if (product) {
          await tx.product.update({
            where: { id: product.id },
            data: {
              stockQuantity: {
                increment: order.quantity,
              },
            },
          });
        }
      }
      
      // If order is uncancelled, subtract items from stock
      if (oldStatus === 'CANCELLED' && newStatus !== 'CANCELLED') {
        const product = await tx.product.findUnique({
          where: { slug: order.productSlug },
        });
        if (product) {
          if (product.stockQuantity < order.quantity) {
            throw new Error(`Insufficient stock to restore order from cancellation. Only ${product.stockQuantity} items left.`);
          }
          await tx.product.update({
            where: { id: product.id },
            data: {
              stockQuantity: {
                decrement: order.quantity,
              },
            },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: { status: newStatus },
      });
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order status' },
      { status: 500 }
    );
  }
}
