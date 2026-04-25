import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const FOLDER = process.env.CLOUDINARY_FOLDER || 'multi4you';

class CloudinaryStorage {
  _handleFile(_req, file, cb) {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (err, result) => {
        if (err) return cb(err);
        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
          mimetype: `image/${result.format}`,
        });
      },
    );
    file.stream.pipe(stream);
  }

  _removeFile(_req, file, cb) {
    cloudinary.uploader.destroy(file.filename).then(() => cb(null)).catch(cb);
  }
}

const fileFilter = (_req, file, cb) => {
  const ok = /^image\/(png|jpe?g|webp|gif|svg\+xml)$/i.test(file.mimetype);
  if (!ok) return cb(new Error('Only image files are allowed'));
  cb(null, true);
};

export const upload = multer({
  storage: new CloudinaryStorage(),
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

/**
 * Extract the Cloudinary public_id from a secure_url. Returns null for non-Cloudinary URLs.
 * Example: https://res.cloudinary.com/demo/image/upload/v123/multi4you/abc.png → "multi4you/abc"
 */
export function extractPublicId(url) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return null;
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+(?:$|\?)/);
  return m ? m[1] : null;
}

/**
 * Best-effort delete of one or many Cloudinary images by URL. Non-Cloudinary URLs
 * are silently skipped. Errors are logged but do not throw — image cleanup must
 * never block a product write.
 */
export async function deleteCloudinaryImages(urls) {
  const list = Array.isArray(urls) ? urls : [urls];
  const ids = list.map(extractPublicId).filter(Boolean);
  if (!ids.length) return { deleted: 0 };
  try {
    const result = await cloudinary.api.delete_resources(ids);
    const deleted = Object.values(result.deleted || {}).filter((s) => s === 'deleted').length;
    return { deleted, ids };
  } catch (err) {
    console.warn('[cloudinary] delete_resources failed:', err.message);
    return { deleted: 0, error: err.message };
  }
}

export { cloudinary };
