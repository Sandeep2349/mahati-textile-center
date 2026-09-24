import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import { sampleProducts } from './data/sampleProducts.js';

dotenv.config();

export const seedDatabase = async (silent = false) => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mahati-textile-center';
    if (!silent) console.log('Connecting to database:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });

    if (!silent) console.log('Clearing existing product and user collections...');
    await Product.deleteMany({});
    await User.deleteMany({});

    if (!silent) console.log('Seeding products catalog...');
    await Product.insertMany(sampleProducts);
    if (!silent) console.log(`\x1b[32m✔ Inserted ${sampleProducts.length} rich catalog products across 5 categories!\x1b[0m`);

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';

    if (!silent) console.log(`Seeding Store Administrator account (${adminUsername})...`);
    const adminUser = new User({
      username: adminUsername,
      password: adminPassword,
      name: 'Mahati Store Manager',
      role: 'admin',
      isActive: true,
    });

    await adminUser.save();
    if (!silent) {
      console.log(`\x1b[32m✔ Admin user configured: username="${adminUsername}"\x1b[0m`);
      console.log('\x1b[36m✔ Database seeding completed successfully!\x1b[0m');
    }
    return { success: true, count: sampleProducts.length };
  } catch (error) {
    if (!silent) {
      console.error('\x1b[31mSeeding failed:\x1b[0m', error.message);
      console.warn('\x1b[33mNote: If MongoDB is not running locally, configure your MONGODB_URI in server/.env\x1b[0m');
    }
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
