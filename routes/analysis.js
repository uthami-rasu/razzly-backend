import express from "express";
import urlModel from "../models/url.js";
import VisitModel from "../models/visitsModel.js";


export const router = express.Router()

const sevenDaysAgo = new Date();

sevenDaysAgo.setDate(sevenDaysAgo.getDate(), -7);

console.log(sevenDaysAgo)

router.post("/bulk-analysis", async (req, res) => {

    try {

        const userId = "3";

        const { reqShortUrls = [] } = req.body;

        const shortUrlLists = await urlModel.find({ userId: userId }, 'shortUrl')

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
            countryData: countryData,
            referrerData: referrerData,
            lineChartData: LineChartData,
            deviceTypeData: deviceTypeData,
            browserTypeData: browserTypeData

        })

        return res.status(200).json({
            success: true,
            data: {
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