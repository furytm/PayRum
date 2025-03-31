import multer from 'multer';

// Use memory storage so the file is kept in memory for processing.
export const upload = multer({ storage: multer.memoryStorage() });