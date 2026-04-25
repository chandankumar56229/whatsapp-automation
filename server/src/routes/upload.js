import { Router } from 'express';
import { upload, cloudinary } from '../middleware/upload.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: req.file.path, publicId: req.file.filename });
});

router.post('/multiple', requireAdmin, upload.array('files', 10), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: 'No files uploaded' });
  res.json({
    files: req.files.map((f) => ({ url: f.path, publicId: f.filename })),
  });
});

router.delete('/:publicId(*)', requireAdmin, async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ ok: result.result === 'ok', result: result.result });
  } catch (err) { next(err); }
});

export default router;
