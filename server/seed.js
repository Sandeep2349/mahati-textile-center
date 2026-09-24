import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';

dotenv.config();

const sampleProducts = [
  // 1. Women's Wear - Sarees
  {
    name: 'Pure Kanchipuram Silk Bridal Saree',
    category: 'Womens',
    subCategory: 'Sarees',
    description: 'Authentic handwoven Kanchipuram pure silk saree with opulent golden zari border and rich pallu. Ideal for weddings and auspicious festivities.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'KAN-SILK-RED',
        attributes: { color: 'Crimson Red', zari: 'Pure Gold Zari', length: '6.3m with blouse' },
        price: 8500,
        discountPrice: 7499,
        stock: 12,
        isActive: true,
      },
      {
        sku: 'KAN-SILK-GRN',
        attributes: { color: 'Peacock Green', zari: 'Antique Zari', length: '6.3m with blouse' },
        price: 8500,
        discountPrice: 7499,
        stock: 8,
        isActive: true,
      },
      {
        sku: 'KAN-SILK-YEL',
        attributes: { color: 'Mustard Yellow', zari: 'Golden Zari', length: '6.3m with blouse' },
        price: 7900,
        discountPrice: 6999,
        stock: 5,
        isActive: true,
      },
    ],
    isActive: true,
  },
  // 2. Women's Wear - Kurtis
  {
    name: 'Chanderi Handblock Printed Anarkali Kurti',
    category: 'Womens',
    subCategory: 'Kurtis',
    description: 'Breathable festive Chanderi cotton kurti featuring traditional floral handblock prints, round neck, and gota patti detailing.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'KUR-ANAR-M',
        attributes: { size: 'M', color: 'Pastel Peach', fabric: 'Chanderi Silk-Cotton' },
        price: 1899,
        discountPrice: 1499,
        stock: 15,
        isActive: true,
      },
      {
        sku: 'KUR-ANAR-L',
        attributes: { size: 'L', color: 'Pastel Peach', fabric: 'Chanderi Silk-Cotton' },
        price: 1899,
        discountPrice: 1499,
        stock: 20,
        isActive: true,
      },
      {
        sku: 'KUR-ANAR-XL',
        attributes: { size: 'XL', color: 'Pastel Peach', fabric: 'Chanderi Silk-Cotton' },
        price: 1999,
        discountPrice: 1599,
        stock: 10,
        isActive: true,
      },
    ],
    isActive: true,
  },

  // 3. Men's Apparel - Shirts
  {
    name: 'Premium Pure Linen Formal Shirt',
    category: 'Mens',
    subCategory: 'Shirts',
    description: 'Tailored 100% French flax linen shirt designed for extreme comfort and breathability in Indian climate. Spread collar with mother-of-pearl buttons.',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'LIN-SHIRT-WHT-38',
        attributes: { size: 'M', color: 'Classic White', sleeve: 'Full Sleeve' },
        price: 2299,
        discountPrice: 1799,
        stock: 18,
        isActive: true,
      },
      {
        sku: 'LIN-SHIRT-WHT-40',
        attributes: { size: 'L', color: 'Classic White', sleeve: 'Full Sleeve' },
        price: 2299,
        discountPrice: 1799,
        stock: 25,
        isActive: true,
      },
      {
        sku: 'LIN-SHIRT-WHT-42',
        attributes: { size: 'XL', color: 'Classic White', sleeve: 'Full Sleeve' },
        price: 2399,
        discountPrice: 1899,
        stock: 14,
        isActive: true,
      },
      {
        sku: 'LIN-SHIRT-BLU-40',
        attributes: { size: 'L', color: 'Powder Blue', sleeve: 'Full Sleeve' },
        price: 2299,
        discountPrice: 1799,
        stock: 16,
        isActive: true,
      },
    ],
    isActive: true,
  },

  // 4. Men's Apparel - Traditional Dhotis
  {
    name: 'Traditional South Indian Double Dhoti with Zari Border',
    category: 'Mens',
    subCategory: 'Dhotis',
    description: 'Pure combed cotton 9x5 double dhoti (Veshti / Pancha) with exquisite golden temple border for pooja, weddings, and cultural celebrations.',
    images: [
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80',
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'DHO-9X5-GLD-1',
        attributes: { size: 'Free Size', border: '1 Inch Gold Zari', length: '4.0 Meters (9x5)' },
        price: 899,
        discountPrice: 699,
        stock: 40,
        isActive: true,
      },
      {
        sku: 'DHO-9X5-GLD-2',
        attributes: { size: 'Free Size', border: '2 Inch Kasavu Zari', length: '4.0 Meters (9x5)' },
        price: 1199,
        discountPrice: 949,
        stock: 30,
        isActive: true,
      },
    ],
    isActive: true,
  },

  // 5. Innerwear - Brassieres
  {
    name: 'Everyday Non-Padded Cotton Comfort Bra',
    category: 'Innerwear',
    subCategory: 'Brassieres',
    description: 'Super soft, 100% combed cotton wire-free everyday bra offering full coverage, reinforced straps, and all-day seamless support.',
    images: [
      'https://images.unsplash.com/photo-1596783049978-57775988e404?auto=format&fit=crop&w=800&q=80',
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'BRA-COT-32B-BEI',
        attributes: { size: '32B', color: 'Beige', type: 'Non-Padded Wirefree' },
        price: 499,
        discountPrice: 399,
        stock: 22,
        isActive: true,
      },
      {
        sku: 'BRA-COT-34B-BEI',
        attributes: { size: '34B', color: 'Beige', type: 'Non-Padded Wirefree' },
        price: 499,
        discountPrice: 399,
        stock: 35,
        isActive: true,
      },
      {
        sku: 'BRA-COT-36C-BEI',
        attributes: { size: '36C', color: 'Beige', type: 'Non-Padded Wirefree' },
        price: 549,
        discountPrice: 429,
        stock: 18,
        isActive: true,
      },
      {
        sku: 'BRA-COT-34B-BLK',
        attributes: { size: '34B', color: 'Black', type: 'Non-Padded Wirefree' },
        price: 499,
        discountPrice: 399,
        stock: 20,
        isActive: true,
      },
    ],
    isActive: true,
  },

  // 6. Innerwear - Men's Vests & Briefs
  {
    name: 'Ribbed Combed Cotton Sleeveless Gym Vest (Pack of 2)',
    category: 'Innerwear',
    subCategory: 'Vests',
    description: 'Moisture-absorbent 100% fine cotton ribbed inner vest with reinforced armholes and itch-free comfort tags.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'VEST-RIB-M',
        attributes: { size: 'M', chest: '85-90 cm', pack: 'Pack of 2' },
        price: 450,
        discountPrice: 360,
        stock: 50,
        isActive: true,
      },
      {
        sku: 'VEST-RIB-L',
        attributes: { size: 'L', chest: '95-100 cm', pack: 'Pack of 2' },
        price: 450,
        discountPrice: 360,
        stock: 60,
        isActive: true,
      },
      {
        sku: 'VEST-RIB-XL',
        attributes: { size: 'XL', chest: '105-110 cm', pack: 'Pack of 2' },
        price: 490,
        discountPrice: 399,
        stock: 45,
        isActive: true,
      },
    ],
    isActive: true,
  },

  // 7. Bangles & Accessories - Traditional Glass Bangles
  {
    name: 'Traditional Chooda Glass Bangles Set (Set of 24)',
    category: 'Bangles',
    subCategory: 'Traditional Bangles',
    description: 'Vibrant handcrafted festive glass bangles with shimmering golden foil inlays. Available in standardized Indian wrist diameters.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'BAN-GLS-RED-2.4',
        attributes: { size: '2.4', color: 'Ruby Red', material: 'Glass', count: '24 Bangles' },
        price: 350,
        discountPrice: 280,
        stock: 25,
        isActive: true,
      },
      {
        sku: 'BAN-GLS-RED-2.6',
        attributes: { size: '2.6', color: 'Ruby Red', material: 'Glass', count: '24 Bangles' },
        price: 350,
        discountPrice: 280,
        stock: 40,
        isActive: true,
      },
      {
        sku: 'BAN-GLS-RED-2.8',
        attributes: { size: '2.8', color: 'Ruby Red', material: 'Glass', count: '24 Bangles' },
        price: 350,
        discountPrice: 280,
        stock: 30,
        isActive: true,
      },
      {
        sku: 'BAN-GLS-GRN-2.6',
        attributes: { size: '2.6', color: 'Emerald Green', material: 'Glass', count: '24 Bangles' },
        price: 350,
        discountPrice: 280,
        stock: 35,
        isActive: true,
      },
    ],
    isActive: true,
  },

  // 8. Daily Wear & Home Fabrics - Towels & Bedspreads
  {
    name: 'Traditional Handloom Cotton Jacquard Bedspread',
    category: 'DailyWear',
    subCategory: 'Bedspreads',
    description: 'Durable and heavy GSM South Indian handloom cotton double bedsheet with woven geometric patterns and matching pillow covers.',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'BED-JACQ-DBL-BLU',
        attributes: { size: 'Double', dimension: '90 x 100 inches', pattern: 'Geometric Indigo' },
        price: 1499,
        discountPrice: 1199,
        stock: 20,
        isActive: true,
      },
      {
        sku: 'BED-JACQ-SGL-BLU',
        attributes: { size: 'Single', dimension: '60 x 90 inches', pattern: 'Geometric Indigo' },
        price: 999,
        discountPrice: 799,
        stock: 15,
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Pure Honeycomb Weave Quick-Dry Bath Towels (Pack of 3)',
    category: 'DailyWear',
    subCategory: 'Towels',
    description: 'High-absorbency South Indian pure cotton honeycomb bath towels that dry rapidly and get softer with every wash.',
    images: [
      'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80',
    ],
    hasVariants: true,
    variants: [
      {
        sku: 'TWL-HON-MULTI-3',
        attributes: { size: 'Free Size', pack: 'Pack of 3', dimension: '30 x 60 inches' },
        price: 799,
        discountPrice: 599,
        stock: 45,
        isActive: true,
      },
    ],
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahati-textile-center';
    console.log('Connecting to database:', mongoUri);

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Clearing existing product and user collections...');
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding products catalog...');
    await Product.insertMany(sampleProducts);
    console.log(`\x1b[32m✔ Inserted ${sampleProducts.length} rich catalog products across 5 categories!\x1b[0m`);

    console.log('Seeding default Store Administrator account...');
    const adminUser = new User({
      username: 'admin',
      password: 'AdminPassword123!',
      name: 'Mahati Store Manager',
      role: 'admin',
      isActive: true,
    });

    await adminUser.save();
    console.log('\x1b[32m✔ Default Admin user created: username="admin", password="AdminPassword123!"\x1b[0m');

    console.log('\x1b[36m✔ Database seeding completed successfully!\x1b[0m');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31mSeeding failed:\x1b[0m', error.message);
    console.warn('\x1b[33mNote: If MongoDB is not running locally, configure your MongoDB Atlas cluster URI in server/.env\x1b[0m');
    process.exit(1);
  }
};

seedDatabase();
