import mongoose from 'mongoose';

// if (!process.env.MONGODB_URI) {
//     throw new Error(
//         "Please provide a MONGODB_URI environment variable"
//     )
// }

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to")
    }
    catch (err) {
        console.log("MongoDb connect error: " + err)
        process.exit(1)
    }
}

export default connectDB