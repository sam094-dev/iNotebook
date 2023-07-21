var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Harryisagoodboy';

const fetchuser = (req, res, next) => {

    // Get the user from the jwt token and add id to req odject
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;

        next();
    }
    catch {
        res.status(401).send({ error: "Please authenticate using a valid token" });

    }
}



module.exports = fetchuser;