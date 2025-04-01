import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { registerUser } from "../controllers/UserController.js";

const router = express.Router();

router.post('/register-user', registerUser);

export default router;