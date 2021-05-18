"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const authenticateToken = (req, resp, next) => {
    console.log('came to auth');
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    if (token == null)
        return resp.sendStatus(401);
    console.log('token ==', token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err)
            return resp.sendStatus(403);
        // req.user = user
        next();
    });
    next();
};
exports.default = authenticateToken;
//# sourceMappingURL=authentication.js.map