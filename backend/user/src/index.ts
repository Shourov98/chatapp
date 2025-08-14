import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import { createClient } from 'redis';
import type { RedisClientType } from '@redis/client';



dotenv.config();

connectDb();
export const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL as string,
})


redisClient.connect().then(() => {
    console.log("Redis connected successfully");
}).catch(console.error)


const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})