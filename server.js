import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

import mongoConn from "./config/db.js";
import { getHash } from "./utils/utils.js";
// import TestModel from "./models/visitsModel.js";



async function startServer() {
    try {
        await mongoConn(); // wait for db connection
        console.log("✅ MongoDB connected");
        // console.log(getHash("https://localhost"))
        // await createTestDocument(); // then create test data

        app.listen(8000, () => {
            console.log("🚀 Server running on Port: 8000");
            console.log("🌐 Host: http://localhost:8000");
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err);
    }
}

async function createTestDocument() {
    const doc = new TestModel({
        originalUrl: "https://example.com",
        shortUrl: "exmpl",
        isActive: true,
        userId: "user123"
    });

    await doc.save();
    console.log("✅ Document saved!");
}

// Start the server properly
startServer();
