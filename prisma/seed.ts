import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Admin User
  const adminUsername = 'nagaphaneedra4476';
  const adminPassword = 'salmankhan123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Clean up old default admin if it exists to keep backend secure
  await prisma.admin.deleteMany({
    where: {
      username: {
        in: ['admin']
      }
    }
  });

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        username: adminUsername,
        passwordHash,
      },
    });
    console.log(`Default admin created: ${adminUsername} / ${adminPassword}`);
  } else {
    // Ensure credentials match if admin already exists
    await prisma.admin.update({
      where: { username: adminUsername },
      data: { passwordHash },
    });
    console.log('Admin user updated with current password.');
  }

  // 2. Create Sample Products
  const sampleProducts = [
    {
      title: 'Bazaar360 Wireless Charging Pad 15W',
      slug: 'wireless-charging-pad-15w',
      description: `Power up your devices rapidly and elegantly. The Bazaar360 Wireless Charging Pad delivers up to 15W of wireless charging speeds for compatible iPhone and Android devices. Crafted with premium aerospace-grade aluminum and a soft-touch matte surface, it complements any workspace or nightstand.

Highlights:
- 15W Fast Wireless Charging
- Ultra-slim 5.5mm profile
- Intelligent temperature control & foreign object detection
- Modern USB-C input port
- Soft anti-slip rubber ring holds your device securely

Specifications:
- Input: 5V/2A, 9V/2A, 12V/1.5A
- Output: 5W / 7.5W / 10W / 15W
- Dimensions: 98mm x 98mm x 5.5mm
- Material: Aluminum Alloy + ABS
- Package includes: Charging pad, 1m USB-C to USB-C cable, User manual`,
      price: 1499,
      originalPrice: 2999,
      images: [
        'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 150,
      SKU: 'WCP-15W-SLV',
      tags: ['electronics', 'charger', 'featured'],
      status: 'ACTIVE',
      isFeatured: true,
    },
    {
      title: 'Aura Premium Stainless Steel Bottle 750ml',
      slug: 'aura-premium-stainless-steel-bottle-750ml',
      description: `Stay hydrated throughout the day with style and performance. The Aura Premium Stainless Steel Bottle features advanced triple-wall vacuum insulation to keep your beverages ice-cold for up to 24 hours or steaming hot for up to 12 hours. Constructed from durable, food-grade 18/8 stainless steel, it is 100% BPA-free and leakproof.

Highlights:
- TempShield triple-wall vacuum insulation
- Keeps cold up to 24 hours, hot up to 12 hours
- Durable 18/8 Pro-Grade Stainless Steel
- BPA-Free and Phthalate-Free
- Leakproof flex cap with durable handle

Specifications:
- Capacity: 750 ml (25 oz)
- Height: 275 mm
- Weight: 375g
- Material: 18/8 Food-grade Stainless Steel
- Care: Hand wash recommended`,
      price: 1899,
      originalPrice: 3499,
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 80,
      SKU: 'AURA-SSB-750',
      tags: ['lifestyle', 'bottle', 'featured'],
      status: 'ACTIVE',
      isFeatured: true,
    },
    {
      title: 'Precision Ergonomic Wireless Mouse',
      slug: 'precision-ergonomic-wireless-mouse',
      description: `Designed for comfort, engineered for performance. The Precision Ergonomic Wireless Mouse features a unique sculpted shape that supports your hand and wrist in a natural posture, reducing fatigue during long working hours. With a high-precision 4000 DPI sensor, customizable buttons, and multi-device connection capabilities, it is the ultimate productivity companion.

Highlights:
- Ergonomic sculpted design reduces muscle strain
- Dual connection: Bluetooth & 2.4GHz USB wireless receiver
- High-precision 4000 DPI adjustable tracking sensor
- Quiet-click buttons for peaceful environments
- Rechargeable battery via USB-C (lasts up to 70 days on a single charge)

Specifications:
- DPI Range: 800 - 4000 DPI
- Wireless Range: 10 meters (33 feet)
- Weight: 115g
- Charging: USB-C Fast Charge
- OS Compatibility: Windows, macOS, iPadOS, ChromeOS, Linux`,
      price: 2299,
      originalPrice: 4499,
      images: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1625842268584-8f3290455655?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 120,
      SKU: 'PEM-WLS-MOU',
      tags: ['electronics', 'office'],
      status: 'ACTIVE',
      isFeatured: false,
    },
    {
      title: 'Bazaar360 Sonic Link Bluetooth Speaker',
      slug: 'sonic-link-bluetooth-speaker',
      description: `Experience immersive, 360-degree room-filling audio wherever you go. The Sonic Link Bluetooth Speaker packs incredibly powerful, crystal-clear sound with rich bass in an ultra-portable design. With an IPX7 waterproof rating and up to 20 hours of continuous playtime, this speaker is built to survive outdoor adventures and pool parties.

Highlights:
- Immersive 360-degree stereo sound with deep bass
- IPX7 fully waterproof and dustproof
- Massive battery life: up to 20 hours of playback
- Bluetooth 5.2 for stable wireless connectivity
- Pair two Sonic Link speakers for True Wireless Stereo (TWS)

Specifications:
- Output Power: 2 x 10W RMS
- Battery Capacity: 4400 mAh
- Charge Time: 3 hours via USB-C
- Waterproof Rating: IPX7
- Dimensions: 180mm x 70mm x 70mm
- Weight: 480g`,
      price: 2999,
      originalPrice: 5999,
      images: [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 50,
      SKU: 'SLB-SPK-BLK',
      tags: ['electronics', 'featured'],
      status: 'ACTIVE',
      isFeatured: true,
    }
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        price: product.price,
        originalPrice: product.originalPrice,
        title: product.title,
        description: product.description,
      },
      create: product,
    });
    console.log(`Synced product: ${product.title}`);
  }

  console.log('Clearing old sample reviews for re-seeding...');
  const sampleReviewIdentifiers = [
    { productSlug: 'wireless-charging-pad-15w', customerName: 'Alex Mercer' },
    { productSlug: 'wireless-charging-pad-15w', customerName: 'Sarah Jenkins' },
    { productSlug: 'aura-premium-stainless-steel-bottle-750ml', customerName: 'David K.' },
    { productSlug: 'sonic-link-bluetooth-speaker', customerName: 'Michael V.' },
  ];
  for (const id of sampleReviewIdentifiers) {
    await prisma.review.deleteMany({
      where: id,
    });
  }

  console.log('Seeding sample reviews...');
  const sampleReviews = [
    {
      productSlug: 'wireless-charging-pad-15w',
      customerName: 'Alex Mercer',
      rating: 5,
      comment: 'Very premium packaging and build quality. Charges my iPhone 14 quickly and doesn’t heat up like other cheap chargers. The aluminum body feels very solid.',
      images: [],
      createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000), // ~3.1 months ago
    },
    {
      productSlug: 'wireless-charging-pad-15w',
      customerName: 'Sarah Jenkins',
      rating: 4,
      comment: 'Excellent charger! It looks super neat on my desk. Standard shipping was reasonably fast and it was securely packaged.',
      images: [],
      createdAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000), // ~3.6 months ago
    },
    {
      productSlug: 'aura-premium-stainless-steel-bottle-750ml',
      customerName: 'David K.',
      rating: 5,
      comment: 'It really does keep drinks ice cold all day! Took it on a hike under 35C sun and the water stayed freezing cold. Highly recommended.',
      images: [],
      createdAt: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000), // ~4.1 months ago
    },
    {
      productSlug: 'sonic-link-bluetooth-speaker',
      customerName: 'Michael V.',
      rating: 5,
      comment: 'This little speaker packs a punch! Bass is deep and doesn’t distort at high volumes. Fully waterproof, already tested it by the pool.',
      images: [],
      createdAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000), // ~4.6 months ago
    }
  ];

  for (const review of sampleReviews) {
    await prisma.review.create({
      data: review,
    });
    console.log(`Created review for: ${review.productSlug} by ${review.customerName}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
