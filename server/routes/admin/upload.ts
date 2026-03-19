import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { requireAuth } from '../../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();
router.use(requireAuth);

// POST /api/admin/upload - generic image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const hash = crypto.createHash('sha256').update(file.buffer).digest('hex').slice(0, 12);
    const timestamp = Date.now();
    const filename = `${hash}-${timestamp}-full.webp`;

    await sharp(file.buffer)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(UPLOADS_DIR, filename));

    res.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('POST /api/admin/upload error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
