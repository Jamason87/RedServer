export {};

const router = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateSession = require('../middleware/validateSession')

const { UniqueConstraintError } = require('sequelize/lib/errors');

router.get('/auth', validateSession, (req, res) => {
    res.status(200).json({
        message: "You can see this if you are logged in."
    })
})

//* REGISTER USER
router.post('/register', async (req, res) => {
    let {email, username, password} = req.body;

    try {
        const newUser = await User.create({
            email,
            username,
            password: bcrypt.hashSync(password, 13),
            isAdmin: false
        })

        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            token: token
        })
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use."
            })
        } else {
            res.status(500).json({
                error: "Failed to register user."
            })
        }
    }
});


router.post('/login', async (req, res) => {

    let {username, password} = req.body;

    try {
        let loginUser = await User.findOne({
            where: {username}
        })

        console.log('hi')

        if(loginUser && await bcrypt.compare(password, loginUser.password)) {
            const token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})

            res.status(200).json({
                token
            })
        } else {
            res.status(401).json({
                error: "Failed to login"
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "Error logging in"
        })
    }
});

module.exports = router;