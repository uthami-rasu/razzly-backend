import express from "express";
import VisitsModel from "./models/visitsModel.js";
import { getHash } from "./utils/utils.js";
import urlModel from "./models/url.js";

import useragent from "express-useragent";


const app = express();

app.use(express.json())

// for Testing 
app.get("/", (req, res) => {
    return res.json({
        message: "Hello!, Server running."
    })
})


// 1. create new entry in mongodb 

app.post('/api/v1/short_url', async (req, res) => {

    try {
        const { longUrl } = req.body;

        const shortUrl = getHash(longUrl || "someUrl");

        const createdBy = {
            name: "Razz",
            email: "razz@gmail.com"
        }
        const newDoc = new urlModel({
            shortUrl: shortUrl,
            originalUrl: longUrl,
            createdBy: createdBy,
            isActive: true,
            userId: "2"

        })

        await newDoc.save();
        console.log("Document Created!")

        return res.json({
            statusCode: 201,
            message: "Document Created!"
        })

    } catch (err) {
        console.error("Error Occured:", err)
        return res.json({
            statusCode: 500,
            error: err.message
        })

    }
})

// 2 
app.get("/api/v1/:short_url", async (req, res) => {
    try {
        const { short_url } = req.params;

        // 1. Get long URL from your database
        const record = await urlModel.findOne({ shortUrl: short_url });
        if (!record) {
            return res.status(404).json({
                statusCode: 404,
                message: "Short URL not found"
            });
        }
        const longUrl = record.originalUrl;

        // 2. Get User Agent Info
        const agent = useragent.parse(req.headers['user-agent']);
        const deviceType = agent.isMobile ? 'Mobile' : (agent?.isTablet ? 'Tablet' : 'Desktop');
        const browser = agent.browser;
        const os = agent.os;

        // 3. Get IP Address
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress;

        // console.log(ip)
        // 4. Get Country from IP
        let country = 'Unknown';
        try {
            if (ip === '::1' || ip === '127.0.0.1') {
                country = 'Localhost';
            } else {
                const response = await fetch(`https://ipapi.co/${ip}/country_name/`);
                country = await response.text();
            }
        } catch (error) {
            console.error('Error getting country', error);
        }

        // 5. Get Referer
        const referer = req.headers['referer'] || 'Direct';
        console.log({
            deviceType,
            browser,
            os,
            country,
            referer
        });
        // 6. Save visit info
        const newVisit = new VisitsModel({
            shortUrl: short_url,
            country: country,
            deviceType: deviceType,
            browserType: browser,
            referer: referer
        });

        await newVisit.save();
        console.log("New visit log created.");

        // 7. Redirect to actual long URL
        return res.status(201).json({
            statusCode: 201,
            message: "new visit log created."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            statusCode: 500,
            error: "Server error"
        });
    }
});



export default app 