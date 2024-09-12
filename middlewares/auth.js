const { verifyToken } = require("../utils/jwt");

const User = require("../models/user.model");

/**
 * @description - This function is used to verify the user token.
 * 
 * @param {req} req - The request object
 * @param {res} res - The response object
 * @returns {undefined}
 */
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
    
        if (!token) return res.status(400).json({ status: "fail", message: "No token provided" });
        
        const payload = await verifyToken(token);
        console.log(payload);
        if (!payload) return res.status(400).json({ status: "fail", message: "Invalid token" });

        // Find the user with the given id who also has the provided token in his tokens array
        const user = await User.findOne({ _id: payload.id, "tokens.token": token });
        if (!user) return res.status(400).json({ status: "fail", message: "No user found" });

        req.token = token;
        req.user = user;
        next();

    } catch (err) {
        return res.status(400).json({ status: "fail", message: "Invalid token" });
    }
}

module.exports = auth;