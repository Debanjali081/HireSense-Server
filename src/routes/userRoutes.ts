import express from 'express';
import { getCurrentUser } from '../controllers/userController';

const router = express.Router();

router.get('/me', getCurrentUser);

export default router;
