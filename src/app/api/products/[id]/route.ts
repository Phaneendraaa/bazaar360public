import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUserFromRequest } from '@/lib/jwt';

export async function PUT(
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

    // Check SKU uniqueness excluding current product
    const existingProduct = await prisma.product.findFirst({
      where: {
        SKU,
        NOT: { id },
      },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Another product with this SKU already exists' },
        { status: 400 }
      );
    }

    // Check if product exists
    const currentProduct = await prisma.product.findUnique({
      where: { id },
    });
    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // If title has changed, optionally update slug, but usually it is better to keep original slug to preserve SEO links.
    // Let's keep the original slug, or regenerate it if title changes. Let's keep it to prevent breaking links.

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
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

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if product exists
    const currentProduct = await prisma.product.findUnique({
      where: { id },
    });
    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
