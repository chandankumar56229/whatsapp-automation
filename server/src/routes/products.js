import { Router } from 'express';
import Product from '../models/Product.js';
import { requireAdmin } from '../middleware/auth.js';
import { deleteCloudinaryImages } from '../middleware/upload.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { category, search, sort = 'newest', includeUnpublished } = req.query;
    const filter = {};
    if (!includeUnpublished) filter.isPublished = true;
    if (category && category !== 'all') filter.category = category;
    if (search) {
      const rx = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: rx }, { tagline: rx }, { description: rx }, { tags: rx }];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { 'pricing.0.price': 1 };
    else if (sort === 'price-desc') sortObj = { 'pricing.0.price': -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };

    const products = await Product.find(filter).sort(sortObj).lean();
    res.json({ products });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug.toLowerCase() }).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug already exists' });
    next(err);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const old = await Product.findById(req.params.id).lean();
    if (!old) return res.status(404).json({ error: 'Product not found' });

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });

    // Clean up replaced/removed images from Cloudinary (fire-and-forget)
    const removed = [];
    if (old.image && old.image !== product.image) removed.push(old.image);
    const newGallery = new Set(product.gallery || []);
    for (const url of old.gallery || []) {
      if (!newGallery.has(url)) removed.push(url);
    }
    if (removed.length) deleteCloudinaryImages(removed);

    res.json({ product });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug already exists' });
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Clean up all Cloudinary images for this product (fire-and-forget)
    const urls = [product.image, ...(product.gallery || [])].filter(Boolean);
    if (urls.length) deleteCloudinaryImages(urls);

    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
