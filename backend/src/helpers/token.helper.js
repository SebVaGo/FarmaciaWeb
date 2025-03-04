const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
const jwt = require('jsonwebtoken');


const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
}

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch {
        return null;
    }
}


module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
