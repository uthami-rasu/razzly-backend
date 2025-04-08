import mongoose, { mongo } from "mongoose";

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now
    }
    , createdBy: {
        type: Object,
        default: {
            name: "Razz",
            email: "razz@hmail.com"
        }
    },
    isActive: {
        type: Boolean,
        required: true

    },
    userId: {
        type: String,
        required: true
    }
}, { collection: "tests" });


const TestModel = mongoose.models.Test || mongoose.model("Test", urlSchema)

export async function createTestDocument() {
    const doc = new TestModel({
        originalUrl: "https://example.com",
        shortUrl: "exmpl",
        isActive: true,
        userId: "user123"
    });

    await doc.save();
    console.log("Document saved!");
}

 
export default TestModel;