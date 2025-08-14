import mongoose from 'mongoose';

const connectDb = async() => {
    const url = process.env.MONGO_URL;

    if (!url) {
        throw new Error("MONGO_URL is not defined")
    }

    try {
        await mongoose.connect(url, {
            dbName: "chat_app_microservice"
        })
        console.log("Database connected successfully with MongoDB.");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);

    }
}

export default connectDb;
