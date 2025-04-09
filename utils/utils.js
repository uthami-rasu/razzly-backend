
import crypto from "crypto";
import urlModel from "../models/url.js";

const getHash = (longUrl) => {

    const hashValue = crypto.createHash("sha256").update(longUrl).digest('hex')

    return hashValue.slice(0, 8)

}



// check for duplicate entry 

const isDocExists = async (shortUrl) => {

    try {
        const oldDoc = await urlModel.findOne({ shortUrl: shortUrl })

        if (!oldDoc) {
            return false

        }
        return true;
    }
    catch (err) {
        console.error("FN: isDocExists\n\n", err)
        return false
    }

}
export { getHash, isDocExists }