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
}, { collection: "urls" });


const urlModel = mongoose.models.Url || mongoose.model("Url", urlSchema)

export default urlModel;