import { Router } from 'express';
import { uploadResume } from '../controllers/resumeController';
import { upload } from '../middleware/multerConfig';

const router = Router();

router.post('/upload', upload.single('resume'), uploadResume);

export default router;
