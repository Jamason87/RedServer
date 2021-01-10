export { };

const router = require('express').Router();
const { Collection } = require('../models');

router.post('/addItem', async (req, res) => {
    let wishlist = await Collection.findOne({
        where: {
            wishlist: true,
            owner_ID: req.user.id
        }
    });

    if (wishlist.funkos.indexOf() !== -1) {
        res.status(409).json({
            message: 'This funko is already in your wishlist!'
        })
    } else {
        wishlist.funkos = [...wishlist.funkos, req.body.funkoId];

        await wishlist.save();

        res.status(200).json({
            message: 'Funko has been added to your wishlist.'
        })


    }
})

module.exports = router;