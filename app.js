import express from "express";
import TestModel, { createTestDocument } from "./models/visitsModel.js";


const app = express();

app.use(express.json())

app.get("/", (req, res) => {


    return res.json({
        message: "Hello!, Server running."
    })
})


app.get("/create", async (req, res) => {
    try {
        await createTestDocument();

        const allDocs = await TestModel.find({});

        return res.json({
            data: allDocs
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
});


export default app; 
