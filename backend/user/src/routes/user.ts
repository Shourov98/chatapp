import express from 'express';
import { loginUser, myProfile, verifyOtp } from '../controllers/user.js';
import { isAuth } from '../middleware/isAuth.js';


const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verifyOtp);
router.get("/me", isAuth, myProfile)

export default router;