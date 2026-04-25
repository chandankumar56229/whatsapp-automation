import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Admin from './models/Admin.js';

async function run() {
  await connectDB(process.env.MONGO_URI);

  const email = (process.env.ADMIN_EMAIL || 'admin@multi4you.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!password) {
    console.error('[reset] ADMIN_PASSWORD not set in .env');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await Admin.findOneAndUpdate(
    { email },
    { email, passwordHash, name },
    { new: true, upsert: true }
  );

  console.log(`[reset] admin updated: ${result.email}`);
  console.log(`[reset] new password: ${password}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('[reset] failed:', err);
  process.exit(1);
});
