import { Router } from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, message are required' });
    }
    const doc = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) { next(err); }
});

router.get('/', requireAdmin, async (_req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json({ messages });
  } catch (err) { next(err); }
});

router.patch('/:id/read', requireAdmin, async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id, { isRead: true }, { new: true },
    );
    if (!msg) return res.status(404).json({ error: 'Not found' });
    res.json({ message: msg });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const m = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
