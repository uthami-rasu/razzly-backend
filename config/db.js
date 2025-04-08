import mongoose from "mongoose";


const mongoConn = async () => {

    console.log(process.env.MONGO_URI)
    try {
        const dbInstance = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`MongoDB Connected: ${dbInstance.connection.host}`);
    }
    catch (err) {
        console.error("MongoDB connection FAILED:", err);
        process.exit(1); // Force quit app if DB fails
    }
}

export default mongoConn;