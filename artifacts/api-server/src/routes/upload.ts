// @ts-nocheck
import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Save uploads to frontend's public directory so Vercel includes them in static build
const isVercel = process.env.VERCEL === '1';
const uploadDir = isVercel
  ? path.join('/tmp', 'uploads')
  : path.resolve(process.cwd(), "..", "dayar-al-ahlam", "public", "uploads");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.error("Failed to create upload directory:", err);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  }
});

// Remove requireAuth import for now, or use the correct path if it exists

router.post("/", upload.single('image'), (req: Request, res: Response): any => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "لم يتم العثور على ملف" });
    }

    // Return the URL path
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.json({ url: imageUrl });
  } catch (err: any) {
    req.log.error(err, "Error uploading file");
    return res.status(500).json({ error: "حدث خطأ أثناء رفع الملف" });
  }
});

export default router;

