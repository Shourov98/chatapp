import { redisClient } from "./../index.js";


import TryCatch from "../config/TryCatch.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { User } from "../model/User.js";
import { generateToken } from "../config/generateToken.js";
import type { AuthencaticatedRequest } from "../middleware/isAuth.js";

export const loginUser = TryCatch(async (req, res) => {
    const {email} = req.body

    const rateLimitKey = `otp:ratelimit: ${email}`
    const rateLimit = await redisClient.get(rateLimitKey)
    if(rateLimit) {
        res.status(429).json({
            message: "Too many requests. Please wait before requesting new otp."
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpKey = `otp:${email}`;

    await redisClient.set(otpKey, otp, {
        EX: 60 * 5,
    });

    await redisClient.set(rateLimitKey, "true", {
        EX: 60,
    });

    const message = {
        to: email,
        subject: "OTP for login",
        body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    }

    await publishToQueue("send-otp", message)

    res.status(200).json({
        message: "OTP sent successfully to your mail.",

    })
})

export const verifyOtp = TryCatch(async(req, res) => {
    const {email, otp:enteredOtp} = req.body;

    if(!email || !enteredOtp) {
        res.status(400).json({
            message: "Email and OTP required",
        });
        return;
    }
    const otpKey = `otp:${email}`

    const storedOtp = await redisClient.get(otpKey)

    if(!storedOtp || storedOtp !== enteredOtp) {
        res.status(400).json({
            message: "Invalid or Expired OTP",
        });
        return;
    }

    await redisClient.del(otpKey);

    let user = await User.findOne({email})

    if(!user) {
        const name = email.slice(0, email.indexOf("@"));
        user = await User.create({ name, email});
    }

    const token = generateToken(user);

    res.json({
        message: "User verified successfully",
        user,
        token,
    })
});


export const myProfile = TryCatch(async(req:AuthencaticatedRequest, res) => {
    const user = req.user;

    res.json(user);
})

export const updateName = TryCatch(async(req: AuthencaticatedRequest, res)=> {
    const user = await User.findById(req.user?._id);

    if(!user) {
        res.status(404).json({
            message: "Please Login first",
        });

        return;
    }

    user.name = req.body.name;

    await user.save();

    const token = generateToken(user);

    res.json({
        message: "User name updated Successfully",
        user,
        token,
    })
})
