import fs from "fs";
import multer from "multer";
import path from "path";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      ensureDir(folder);
      cb(null, folder);
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    }
  });

const pdfFilter = (_req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF resumes are allowed"), false);
};

const videoFilter = (_req, file, cb) => {
  const allowed = ["video/mp4", "video/webm", "video/quicktime"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only MP4, WebM, or MOV video resumes are allowed"), false);
};

const imageFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"), false);
};

export const uploadResume = multer({
  storage: createStorage("uploads/resumes"),
  fileFilter: pdfFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadVideoResume = multer({
  storage: createStorage("uploads/video-resumes"),
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

export const uploadCompanyLogo = multer({
  storage: createStorage("uploads/company-logos"),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});
