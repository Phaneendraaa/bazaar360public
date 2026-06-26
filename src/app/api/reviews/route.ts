import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUserFromRequest } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get('productSlug');

    if (!productSlug) {
      return NextResponse.json(
        { error: 'productSlug parameter is required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productSlug },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
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
    const { productSlug, customerName, rating, comment, images } = body;

    if (!productSlug || !customerName || rating === undefined || !comment) {
      return NextResponse.json(
        { error: 'Product slug, customer name, rating, and comment are required' },
        { status: 400 }
      );
    }

    const reviewRating = parseInt(rating);
    if (isNaN(reviewRating) || reviewRating < 1 || reviewRating > 5) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify if product exists
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
    });
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const newReview = await prisma.review.create({
      data: {
        productSlug,
        customerName,
        rating: reviewRating,
        comment,
        images: images || [],
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
