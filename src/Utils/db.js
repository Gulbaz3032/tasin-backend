import mongoose from "mongoose";
import dotenv, { config } from "dotenv"
dotenv.config();

const MONGO_URI = process.env.MONGO_URL
export const dbConnection = async (req, res) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database is connected Successfully");
    } catch (error) {
        console.log("Failed to connect database");
        error: error.message
    }
}