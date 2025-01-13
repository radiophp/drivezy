const jwt = require('jsonwebtoken');
const config = require('../../../config');
const User = require('../../../models/User')

module.exports = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({
            data: 'no token',
            success: false,
        });
    }

    try {
        const decode = await jwt.verify(token, config.secret);

        if (parseInt(Date.now() / 1000) > decode.exp) {
            return res.status(403).json({
                success: false,
                message: 'Token has expired, please login again'
            })
        }

        const user = await User.findById(decode.user_id);

        if (!user) {
            return res.status(403).json({
                success: false,
                data: 'user not found',
            });
        }

        if (!user.active) {
            return res.status(403).json({
                success: false,
                data: 'user is not active',
            });
        }

        if(! user.roll.includes('superUser')){
            return res.status(403).json({
                success: false,
                data: 'not authorized for this',
            });
        }

        user.token = token;
        req.user = user;
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        }
        return next(err);
    }
};