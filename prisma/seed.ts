import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Admin User
  const adminPassword = 'salmankhan123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const adminUsernames = ['nagaphaneedra4476', 'nagaphaneendra4476'];

  // Clean up legacy default 'admin'
  await prisma.admin.deleteMany({
    where: {
      username: {
        in: ['admin']
      }
    }
  });

  for (const username of adminUsernames) {
    const existing = await prisma.admin.findUnique({
      where: { username },
    });

    if (!existing) {
      await prisma.admin.create({
        data: {
          username,
          passwordHash,
        },
      });
      console.log(`Admin created: ${username}`);
    } else {
      await prisma.admin.update({
        where: { username },
        data: { passwordHash },
      });
      console.log(`Admin updated: ${username}`);
    }
  }

  // 2. Create Sample Products
  const sampleProducts = [
    {
      title: 'Royal Emerald Banarasi Silk Saree',
      slug: 'royal-emerald-banarasi-silk-saree',
      description: `Drape yourself in royal elegance with our Royal Emerald Banarasi Silk Saree. Handcrafted by master weavers in Varanasi, this exquisite saree features intricate zari work and traditional floral motifs woven into premium grade silk. Ideal for weddings, festivals, and celebratory occasions.

Highlights:
- Pure Banarasi Katan silk fabric
- Elaborate gold zari pallu and borders
- Unstitched matching blouse piece included (80cm)
- Rich emerald green color with classic motifs

Specifications:
- Material: Katan Silk
- Length: 5.5 meters saree + 0.8 meters blouse
- Color: Emerald Green & Gold
- Care: Dry clean only`,
      price: 4299,
      originalPrice: 8999,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 45,
      SKU: 'SS-IND-BAN',
      tags: ['indian-wear', 'featured'],
      status: 'ACTIVE',
      isFeatured: true,
    },
    {
      title: 'Elegant Crimson Embroidered Anarkali Suit',
      slug: 'elegant-crimson-embroidered-anarkali-suit',
      description: `Make a stunning statement in our Crimson Embroidered Anarkali Suit. Crafted from premium georgette fabric, this floor-length outfit showcases detailed hand embroidery and zardozi embellishments along the neckline and sleeves. Comes complete with a matching churidar and a sheer dupatta.

Highlights:
- High-quality georgette fabric with soft lining
- Intricate gold thread hand embroidery
- Semi-stitched for custom tailoring adjustments
- Elegant floor-length flowy silhouette

Specifications:
- Material: Georgette & Shantoon
- Set Includes: Anarkali Kurta, Churidar, Dupatta
- Color: Crimson Red & Gold
- Care: Dry clean recommended`,
      price: 3499,
      originalPrice: 6999,
      images: [
        'https://images.unsplash.com/photo-1608748010899-18f300247112?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 30,
      SKU: 'SS-IND-ANA',
      tags: ['indian-wear', 'featured'],
      status: 'ACTIVE',
      isFeatured: true,
    },
    {
      title: 'Pastel Mint Floral Print Kurta Set',
      slug: 'pastel-mint-floral-print-kurta-set',
      description: `Perfect for casual days or daytime gatherings, our Pastel Mint Floral Kurta Set combines comfort with style. Made of breathable pure cotton, the set includes a straight-cut floral kurta, matching cropped trousers, and a lightweight printed cotton dupatta.

Highlights:
- 100% premium breathable cotton fabric
- Delicate hand-block floral print design
- Comfortable straight fit kurta with side slits
- Cropped trousers with elasticated waistband

Specifications:
- Material: 100% Cotton
- Set Includes: Kurta, Pants, Dupatta
- Color: Mint Green & Soft Pink
- Care: Gentle hand wash or machine wash cold`,
      price: 2199,
      originalPrice: 4499,
      images: [
        'https://images.unsplash.com/photo-1609357518652-6cf0416f0cbe?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 60,
      SKU: 'SS-IND-KUR',
      tags: ['indian-wear'],
      status: 'ACTIVE',
      isFeatured: false,
    },
    {
      title: 'Sunshine Yellow Floral Midi Dress',
      slug: 'sunshine-yellow-floral-midi-dress',
      description: `Bring the sunshine with you in our gorgeous Sunshine Yellow Floral Midi Dress. Featuring a soft sweetheart neckline, puffed sleeves, and a tiered skirt with an delicate floral print. The breathable fabric and smocked back design ensure a perfect, comfortable fit for brunch or casual outings.

Highlights:
- Light and flowy viscose rayon fabric
- Vibrant yellow color with pastel floral print
- Smocked back and elasticated sleeves for ease of fit
- Elegant midi length with tiered detailing

Specifications:
- Material: Viscose Rayon
- Pattern: Floral Print
- Length: Midi
- Fit: Regular Fit / True to Size`,
      price: 2499,
      originalPrice: 4999,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 40,
      SKU: 'SS-WES-FLO',
      tags: ['western-wear', 'featured'],
      status: 'ACTIVE',
      isFeatured: true,
    },
    {
      title: 'Classic Sage Green Satin Wrap Top',
      slug: 'classic-sage-green-satin-wrap-top',
      description: `Elevate your workwear or evening look with our Classic Sage Green Satin Wrap Top. Made from high-shine premium satin, it features long balloon sleeves and an adjustable tie-side wrap design that flatters all body types. Pair it with high-waisted trousers or skirts for a chic, sophisticated look.

Highlights:
- Smooth premium satin fabric
- Fully adjustable wrap tie closure
- Elegant balloon sleeves with buttoned cuffs
- Flattering V-neckline

Specifications:
- Material: Polyester Satin
- Fit: Adjustable Wrap
- Sleeve Style: Long Balloon Sleeve
- Color: Sage Green`,
      price: 1599,
      originalPrice: 3199,
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 50,
      SKU: 'SS-WES-SAT',
      tags: ['western-wear'],
      status: 'ACTIVE',
      isFeatured: false,
    },
    {
      title: 'Midnight Black Pleated A-Line Skirt',
      slug: 'midnight-black-pleated-a-line-skirt',
      description: `A timeless wardrobe staple. Our Midnight Black Pleated A-Line Skirt is designed with structured accordion pleats that move beautifully with every step. Made with a comfortable elasticated waistband, it can be styled up with heels or styled down with sneakers.

Highlights:
- Mid-weight crepe fabric with sharp pleats
- Elasticated comfort waistband
- Classic A-line midi silhouette
- Versatile design for day-to-night styling

Specifications:
- Material: Crepe
- Waist: Mid-Rise Elasticated
- Color: Midnight Black
- Care: Dry clean or cold hand wash`,
      price: 1899,
      originalPrice: 3799,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 35,
      SKU: 'SS-WES-PLE',
      tags: ['western-wear', 'featured'],
      status: 'ACTIVE',
      isFeatured: true,
    },
    {
      title: 'Handcrafted Kundan Chandbali Earrings',
      slug: 'handcrafted-kundan-chandbali-earrings',
      description: `Exquisite handcrafted Kundan Chandbali Earrings, perfect to complete your ethnic attire. Decorated with premium Kundan stones, micro-pearls, and delicate enamel detailing, these lightweight statement earrings add a touch of royal heritage to any ensemble.

Highlights:
- Traditional chandbali drop design
- Intricate Kundan stone work and pearl droplets
- Light gold-plated base alloy, comfortable for long wear
- Push-back closure with secure support

Specifications:
- Material: Gold-plated alloy, Kundan, Faux Pearls
- Weight: 25g per pair
- Color: Gold & Ivory
- Style: Traditional Ethnic`,
      price: 1299,
      originalPrice: 2499,
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 100,
      SKU: 'SS-ACC-KUN',
      tags: ['accessories', 'featured'],
      status: 'ACTIVE',
      isFeatured: true,
    },
    {
      title: 'Parisian Blush Pink Leather Sling Bag',
      slug: 'parisian-blush-pink-leather-sling-bag',
      description: `Add a chic finish to your look with our Parisian Blush Pink Leather Sling Bag. Crafted from premium vegan leather, it features structured quilting, polished gold-toned hardware, and a convertible chain strap that can be worn crossbody or over the shoulder. Compact yet spacious enough for your essentials.

Highlights:
- Premium quilted vegan leather
- Secure turn-lock front flap closure
- Multi-compartment interior pocket
- Convertible gold chain strap

Specifications:
- Material: Quilted Vegan Leather
- Dimensions: 22cm x 14cm x 7cm
- Color: Blush Pink & Gold
- Strap: Convertible Chain (55cm drop)`,
      price: 2799,
      originalPrice: 5499,
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 25,
      SKU: 'SS-ACC-SLB',
      tags: ['accessories', 'featured'],
      status: 'ACTIVE',
      isFeatured: true,
    },
    {
      title: 'Embellished Gold Zardozi Velvet Juttis',
      slug: 'embellished-gold-zardozi-velvet-juttis',
      description: `Step into sheer luxury with our hand-embellished Gold Zardozi Juttis. Made on a plush velvet base, these traditional juttis feature intricate hand-embroidered gold thread work. Padded memory foam insoles ensure you stay comfortable all day and night.

Highlights:
- Handcrafted on a premium velvet base
- Royal gold thread Zardozi hand embroidery
- Extra padded insoles for superior comfort
- Genuine leather sole for durability

Specifications:
- Base Material: Velvet
- Embroidery: Zardozi Gold Wire
- Insole: Padded Memory Foam
- Sole: Leather`,
      price: 1799,
      originalPrice: 3599,
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
      ],
      video: null,
      stockQuantity: 40,
      SKU: 'SS-ACC-JUT',
      tags: ['accessories'],
      status: 'ACTIVE',
      isFeatured: false,
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
        tags: product.tags,
        images: product.images,
        SKU: product.SKU,
        isFeatured: product.isFeatured,
      },
      create: product,
    });
    console.log(`Synced product: ${product.title}`);
  }

  console.log('Clearing old sample reviews for re-seeding...');
  await prisma.review.deleteMany({});

  console.log('Seeding sample reviews...');
  const sampleReviews = [
    {
      productSlug: 'royal-emerald-banarasi-silk-saree',
      customerName: 'Aishwarya R.',
      rating: 5,
      comment: 'Absolutely stunning! The katan silk feels incredibly premium and the gold zari is weave perfection. Wore it for my brother\'s wedding and received endless compliments.',
      images: [],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      productSlug: 'royal-emerald-banarasi-silk-saree',
      customerName: 'Meera Sen',
      rating: 4,
      comment: 'Beautiful drape and color. The gold zari has a lovely sheen, not too flashy. It took 4 days to arrive in Mumbai, packaging was very secure.',
      images: [],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      productSlug: 'elegant-crimson-embroidered-anarkali-suit',
      customerName: 'Priya Sharma',
      rating: 5,
      comment: 'The embroidery work is beautiful and very clean. Semi-stitched fit allowed me to get it tailored to my exact measurements. Perfect crimson red shade!',
      images: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      productSlug: 'parisian-blush-pink-leather-sling-bag',
      customerName: 'Anjali K.',
      rating: 5,
      comment: 'Love the quality of the vegan leather and the blush pink color is so beautiful. Convertible strap is super handy. Highly recommend Suta & Stitch!',
      images: [],
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
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
