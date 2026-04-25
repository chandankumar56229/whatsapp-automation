import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import Admin from './models/Admin.js';
import Product from './models/Product.js';
import { cloudinary } from './middleware/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whatscamp = {
  slug: 'whatscamp',
  name: 'WhatsCamp — WhatsApp CRM',
  tagline: 'All-in-one WhatsApp CRM, IVR & automation platform',
  category: 'CRM & Business',
  description: `WhatsCamp is a complete WhatsApp CRM and automation platform built for modern businesses. Manage thousands of conversations across multiple WhatsApp numbers, automate replies with a powerful chatbot builder, run IVR-style interactive flows, and track every interaction from a unified dashboard.

Built on a multi-tenant Go backend with a Vue.js admin and customer interface, WhatsCamp ships production-ready with Docker deployment, role-based access, broadcast campaigns, and a complete REST API.`,
  tags: ['WhatsApp', 'CRM', 'IVR', 'Automation', 'SaaS', 'Chatbot', 'Go', 'Vue.js', 'Docker', 'Multi-tenant'],
  image: '', // populated below by Cloudinary upload (or fallback to /whatscamp-dashboard.png)
  gallery: [],
  pricing: [
    { tier: 'Regular License', price: 49, description: 'Single end-product, non-charging users' },
    { tier: 'Extended License', price: 199, description: 'Single end-product, charging end users allowed' },
  ],
  rating: 4.9,
  salesCount: 500,
  version: '1.0.0',
  publishDate: 'April 2025',
  supportDuration: '6 months',
  features: [
    { icon: 'fa-comments', title: 'Multi-Number Inbox', description: 'Connect unlimited WhatsApp numbers in one unified inbox.' },
    { icon: 'fa-robot', title: 'Chatbot Builder', description: 'Drag-and-drop visual flow builder with conditional logic.' },
    { icon: 'fa-phone', title: 'IVR Flows', description: 'Interactive voice-style menu trees over WhatsApp.' },
    { icon: 'fa-bullhorn', title: 'Broadcast Campaigns', description: 'Schedule and target broadcast campaigns with segmentation.' },
    { icon: 'fa-users', title: 'Multi-tenant', description: 'Run multiple isolated tenants on a single deployment.' },
    { icon: 'fa-chart-line', title: 'Analytics Dashboard', description: 'Real-time conversation, agent and campaign analytics.' },
    { icon: 'fa-tags', title: 'Tags & Segments', description: 'Organize contacts with custom tags and dynamic segments.' },
    { icon: 'fa-user-shield', title: 'Role-based Access', description: 'Granular roles for admins, agents and supervisors.' },
    { icon: 'fa-code', title: 'REST API & Webhooks', description: 'Full REST API and webhooks to integrate any system.' },
    { icon: 'fa-lock', title: 'End-to-end Security', description: 'Encrypted at rest, isolated tenant data, audit logs.' },
    { icon: 'fa-language', title: 'Multi-language', description: 'Localized UI for global team rollout.' },
    { icon: 'fa-mobile-screen', title: 'Responsive UI', description: 'Mobile-first admin and agent panels.' },
  ],
  techStack: {
    backend: ['Go', 'Fiber', 'GORM'],
    frontend: ['Vue.js 3', 'Vuex', 'Tailwind'],
    database: ['PostgreSQL', 'Redis'],
    deployment: ['Docker', 'docker-compose', 'Nginx'],
  },
  reviews: [
    { author: 'Rajesh K.', role: 'SaaS Founder', rating: 5, text: 'Saved us 6 months of dev time. Multi-tenant out of the box is a killer feature.' },
    { author: 'Priya M.', role: 'Marketing Lead', rating: 5, text: 'Broadcast campaigns + segmentation got our reply rate up 3x in the first month.' },
    { author: 'Daniel T.', role: 'Agency Owner', rating: 5, text: 'Re-sold to 7 clients already. Clean code, great docs, smooth deployment.' },
  ],
  isPublished: true,
  isComingSoon: false,
};

async function run() {
  await connectDB(process.env.MONGO_URI);

  const email = (process.env.ADMIN_EMAIL || 'admin@multi4you.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Admin';

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`[seed] admin already exists: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash, name });
    console.log(`[seed] admin created: ${email} / ${password}`);
  }

  const exists = await Product.findOne({ slug: whatscamp.slug });
  if (exists) {
    console.log('[seed] WhatsCamp already exists, skipping');
  } else {
    const localImg = path.join(__dirname, '..', '..', 'legacy', 'assets', 'img', 'whatscamp-dashboard.png');
    if (process.env.CLOUDINARY_CLOUD_NAME && fs.existsSync(localImg)) {
      try {
        const result = await cloudinary.uploader.upload(localImg, {
          folder: process.env.CLOUDINARY_FOLDER || 'multi4you',
          public_id: 'whatscamp-dashboard-seed',
          overwrite: true,
        });
        whatscamp.image = result.secure_url;
        console.log('[seed] uploaded WhatsCamp image to Cloudinary');
      } catch (err) {
        console.warn('[seed] Cloudinary upload failed, using local fallback:', err.message);
        whatscamp.image = '/whatscamp-dashboard.png';
      }
    } else {
      whatscamp.image = '/whatscamp-dashboard.png';
      console.log('[seed] Cloudinary not configured — using local image path');
    }
    await Product.create(whatscamp);
    console.log('[seed] WhatsCamp product created');
  }

  await mongoose.disconnect();
  console.log('[seed] done.');
}

run().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
