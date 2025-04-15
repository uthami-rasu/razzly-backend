import admin from "firebase-admin"
const validateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const idToken = authHeader.split(' ')[1];

    try {
        // verify the ID Token 
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        console.log('Decoded Token:', decodedToken);

        // attach user info to the request object
        req.user = decodedToken;

        next(); // proceed to the next middleware or route
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};


export { validateUser }