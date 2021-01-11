const jwt = require('jsonwebtoken');
const { authenticate } = require('../db');
const { User } = require('../models');

const validateSession = (req: any, res: any, next: any) => {
    if (req.method === 'OPTIONS') {
        return next();
    } else if (req.headers.authorization) {
        const { authorization } = req.headers;
        try {
            const payload = authorization ? jwt.verify(authorization, process.env.JWT_SECRET) : undefined;

            if (payload) {
                User.findOne({
                    where: { id: payload.id } // this finds user whose id matches the id that was assigned upon login
                })
                    .then((user: any) => {
                        req.user = user;
                        next()
                    })
            } else {
                res.status(401).json({
                    message: "Not Authorized."
                })
            }
        } catch (error) {
            res.status(401).json({
                message: "JWT Expired"
            })
        }
    } else {
        res.status(401).json({
            message: "Not authorized."
        })
    }
}

module.exports = validateSession