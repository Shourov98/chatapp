import express from 'express';
import { getAllUser, getAUser, loginUser, myProfile, logoutUser, updateName, verifyOtp } from '../controllers/user.js';
import { isAuth } from '../middleware/isAuth.js';


const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verifyOtp);
router.get("/me", isAuth, myProfile)
router.get("/user/all", isAuth, getAllUser);
router.get("/user/:id", getAUser);
router.post("/update/user", isAuth, updateName);
router.post("/logout", isAuth, logoutUser);

export default router;