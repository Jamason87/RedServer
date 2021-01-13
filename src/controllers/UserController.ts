export { };

const router = require('express').Router();
const { User, Collection } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateSession = require('../middleware/validateSession')

const { UniqueConstraintError } = require('sequelize/lib/errors');

router.get('/auth', validateSession, (req: any, res: any) => {
    res.status(200).json({
        message: "You can see this if you are logged in.",
        isAdmin: req.user.isAdmin
    })
});

router.post('/update', validateSession, async (req: any, res: any) => {
    if (req.user.isAdmin) {
        let user = await User.findOne({
            where: {
                id: req.body.id
            }
        })

        user.isAdmin = req.body.isAdmin

        await user.save();

        res.status(200).json({
            message: "User updated"
        })
    } else {
        res.status(401).json({
            message: 'You are not permitted to do this'
        })
    }
});

router.get('/id/:id', validateSession, async (req: any, res: any) => {
    if (req.user.isAdmin) {
        User.findOne({
            where: {
                id: req.params.id
            }
        })
            .then((user: any) => {
                Collection.findAll({
                    where: {
                        owner_ID: req.params.id
                    }
                })
                    .then((collections: any) => {
                        res.status(200).json({user, collections})
                    })
            })
    } else {
        res.status(401).json({
            message: 'You are not permitted to do this'
        })
    }
})

router.get('/delete/:id', validateSession, async (req: any, res: any) => {
    if (req.user.isAdmin) {
        let user = await User.findOne({
            where: {
                id: req.params.id
            }
        })

        if (req.user.id !== user.id) {
            await user.destroy()
            await user.save()

            res.status(200).json({
                message: "User has been deleted."
            })
        } else {
            res.status(401).json({
                message: "You cannot delete your own account!"
            })
        }
    } else {
        res.status(401).json({
            message: 'You are not permitted to do this'
        })
    }
})

router.post('/all', validateSession, (req: any, res: any) => {
    if (req.user.isAdmin) {
        let page = req.body.page;

        User.findAndCountAll({
            offset: (page-1) * 10,
            limit: 10
        })
            .then((data: any) => {
                res.status(200).json(data);
            })
    } else {
        res.status(401).json({
            message: "You are not permitted to do this."
        })
    }
})

//* REGISTER USER
router.post('/register', async (req: any, res: any) => {
    let { email, username, password } = req.body;

    try {
        const newUser = await User.create({
            email,
            username,
            password: bcrypt.hashSync(password, 13),
            isAdmin: false
        })

        Collection.create({
            owner_ID: newUser.id,
            name: 'wishlist',
            description: 'wishlist',
            wishlist: true,
            funkos: []
        })

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

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


router.post('/login', async (req: any, res: any) => {

    let { username, password } = req.body;

    try {
        let loginUser = await User.findOne({
            where: { username }
        })

        console.log('hi')

        if (loginUser && await bcrypt.compare(password, loginUser.password)) {
            const token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })

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