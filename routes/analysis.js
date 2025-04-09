import express from "express";
import urlModel from "../models/url.js";
import VisitModel from "../models/visitsModel.js";


export const router = express.Router()


router.get("/bulk-analysis", async (req, res) => {

    try {
        const userId = "3";

        const shortUrlLists = await urlModel.find({ userId: userId }, 'shortUrl')

        const shortUrls = shortUrlLists.map((url) => url.shortUrl)

        const fetchRecords = await VisitModel.find({ shortUrl: { $in: shortUrls } })


        return res.status(200).json({
            success: true,
            data: fetchRecords,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }


})