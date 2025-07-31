const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user; // This will contain { id, role }
        next();
    });
};

const authorizeGuide = (req, res, next) => {
    if (req.user.role !== 'guide') {
        return res.status(403).json({ error: 'Access denied. Guide role required.' });
    }
    next();
};

const authorizeTourist = (req, res, next) => {
    if (req.user.role !== 'tourist') {
        return res.status(403).json({ error: 'Access denied. Tourist role required.' });
    }
    next();
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    next();
};

module.exports = { authenticateToken, authorizeGuide, authorizeTourist, authorizeAdmin };