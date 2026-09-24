import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const setAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mahati-textile-center';
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });

    const username = process.argv[2] || process.env.ADMIN_USERNAME || 'admin';
    const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'AdminPassword123!';

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = new User({
        username,
        password,
        name: 'Mahati Store Manager',
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      console.log(`\x1b[32m✔ Created new Admin account!\x1b[0m`);
    } else {
      admin.username = username;
      admin.password = password; // Will be auto-hashed by User model pre-save hook
      admin.isActive = true;
      await admin.save();
      console.log(`\x1b[32m✔ Updated existing Admin credentials!\x1b[0m`);
    }

    console.log(`\x1b[36m✔ Active Admin Username: "${username}"\x1b[0m`);
    console.log(`\x1b[36m✔ Password updated and hashed securely in MongoDB Atlas!\x1b[0m`);
    process.exit(0);
  } catch (err) {
    console.error('\x1b[31m✖ Error updating admin credentials:\x1b[0m', err.message);
    process.exit(1);
  }
};

setAdmin();
