import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURL = process.env.MONGODB_URL;
 
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error('Error connecting to MongoDB:', e.message);
    }
};
export default connectToMongo;