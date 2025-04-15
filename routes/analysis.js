import express from "express";
import urlModel from "../models/url.js";
import VisitModel from "../models/visitsModel.js";
import admin from "firebase-admin"
import { validateUser } from "../Middlewares/userValidate.js";
import { getPrettyDate } from "../utils/utils.js";

export const router = express.Router()

const sevenDaysAgo = new Date();

sevenDaysAgo.setDate(sevenDaysAgo.getDate(), -7);

console.log(sevenDaysAgo)

router.post("/bulk-analysis", async (req, res) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: 'No token provided' });

        }

        // verify the ID Token 

        const idToken = authHeader.split(' ')[1]
        const decodedToken = await admin.auth().verifyIdToken(idToken)

        console.log('Decoded Token:', decodedToken);

        const userId = decodedToken.uid; // 



        const { reqShortUrls = [] } = req.body;

        const shortUrlLists = await urlModel.find({ userId: userId }, ['shortUrl', 'name', 'originalUrl', 'createdAt'])

        const shortUrls = reqShortUrls?.length > 0 ? reqShortUrls : shortUrlLists.map((url) => url.shortUrl)

        const LineChartData = await VisitModel.aggregate([
            {
                $match: {
                    shortUrl: { $in: shortUrls },
                    date: { $lte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" } // <-- changed to $date
                    },
                    clicks: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    clicks: 1
                }
            },
            {
                $sort: { date: 1 }
            }
        ]);


        const countryData = await VisitModel.aggregate(
            [
                {
                    $match: {
                        shortUrl: { $in: shortUrls },

                    }
                },
                {
                    $group: {
                        _id: "$country"
                        ,
                        value: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        value: 1
                    }
                },

            ]
        )

        const referrerData = await VisitModel.aggregate(
            [
                {
                    $match: {
                        shortUrl: { $in: shortUrls },

                    }
                },
                {
                    $group: {
                        _id: "$referrer"
                        ,
                        value: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        value: 1
                    }
                },

            ]
        )


        const deviceTypeData = await VisitModel.aggregate(
            [
                {
                    $match: {
                        shortUrl: { $in: shortUrls },

                    }
                },
                {
                    $group: {
                        _id: "$deviceType"
                        ,
                        value: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        value: 1
                    }
                },

            ]
        )

        const browserTypeData = await VisitModel.aggregate(
            [
                {
                    $match: {
                        shortUrl: { $in: shortUrls },

                    }
                },
                {
                    $group: {
                        _id: "$browserType"
                        ,
                        value: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        value: 1
                    }
                },

            ]
        )

        console.log({
            shortUrlLists,
            countryData: countryData,
            referrerData: referrerData,
            lineChartData: LineChartData,
            deviceTypeData: deviceTypeData,
            browserTypeData: browserTypeData

        })

        return res.status(200).json({
            success: true,
            data: {
                shortUrls: shortUrlLists,
                countryData: countryData,
                referrerData: referrerData,
                lineChartData: LineChartData,
                deviceTypeData: deviceTypeData,
                browserTypeData: browserTypeData
            },



        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
})



// get urlnames 
router.get("/short-links", validateUser, async (req, res) => {
    try {
        const userId = req.user.uid;


        const fromDate = new Date(req.query.fromDate || new Date(0)); // default: epoch
        const toDate = new Date(req.query.toDate || new Date());       // default: now

        const docs = await urlModel.find(
            {
                userId: userId,
                createdAt: { $gte: fromDate, $lte: toDate },
            },
            ["shortUrl", "name", "originalUrl", "createdAt"]
        );

        const results = docs.map((d) => ({
            name: d?.name || "No Title",
            shortUrl: d.shortUrl,
            originalUrl: d.originalUrl,
            createdAt: getPrettyDate(d.createdAt),
        }));

        return res.json(results);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});
