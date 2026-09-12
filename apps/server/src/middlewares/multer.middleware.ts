import { CTError } from "@/utils/errHandler.util";
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new CTError(422, "Only JPEG, PNG, and WEBP images are allowed."),
      );
    }
    cb(null, true);
  },
});
