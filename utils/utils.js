
import crypto from "crypto";

const getHash = (longUrl) => {

    const hashValue = crypto.createHash("sha256").update(longUrl).digest('hex')

    return hashValue.slice(0, 8)

}


export { getHash }