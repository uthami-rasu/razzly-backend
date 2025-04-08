import mongoose, { mongo } from "mongoose";

const visitSchema = new mongoose.Schema({
    shortUrl: {
        type: String,
        required: true,
    }
    ,
    date: {
        type: Date,
        default: Date.now
    }
    , country: {
        type: String,
    },
    deviceType: {
        type: String,
    },
    browserType: {
        type: String,
    },
    referar: {
        type: String,
    }
}, { collection: "visit_logs" });


const VisitModel = mongoose.models.Visits || mongoose.model("Visits", visitSchema)

export default VisitModel; 
