const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
const jwt = require('jsonwebtoken');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000 // 15 minutos
};


const generateAccessToken = (userGuid) => {
    return jwt.sign({ id: userGuid }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

const generateRefreshToken = (userGuid) => {
    return jwt.sign({ id: userGuid }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
}

const setAuthCookie = (res, accessToken) => {
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
} 

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch {
        return null;
    }
}


module.exports = { generateAccessToken, generateRefreshToken, verifyToken, setAuthCookie };
