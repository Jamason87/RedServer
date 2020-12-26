export { };

const router = require('express').Router();
const { Collection } = require('../models');

const validateSession = require('../middleware/validateSession')

//CREATE
router.post('/create', validateSession, (req, res) => {
    let owner_ID = req.user.id;

    let { name, description } = req.body;

    Collection.create({
        owner_ID,
        name,
        description,
        wishlist: false,
        funkos: []
    })
        .then(() => {
            res.status(200).json({
                message: 'Collection created'
            })
        })
});

//READ
router.get('/:id', (req, res) => {
    Collection.findByPk(req.params.id)
        .then((data) => {
            if (data) {
                res.status(200).json({
                    data
                })
            } else {
                res.status(404).json({
                    message: 'Could not find a collection with the id ' + req.params.id
                })
            }
        })
});

//UPDATE
router.post('/update', validateSession, async (req, res) => {
    let { collectionId, name, description, funkos } = req.body;

    let collection = await Collection.findOne({
        where: {
            id: collectionId
        }
    })

    if (collection) {
        if (req.user.isAdmin || collection.owner_ID == req.user.id) {
            collection.name = name;
            collection.description = description;
            collection.funkos = funkos;

            await collection.save();

            res.status(200).json({
                message: 'Collection updated',
                collection
            })
        } else {
            res.status(401).json({
                message: 'You are not permitted to do this.'
            })
        }
    } else {
        res.status(404).json({
            message: 'Could not find the collection for id ' + collectionId
        })
    }
})

//DELTE
router.get('/delete/:id',validateSession, async (req,res) => {
    let collection = await Collection.findOne({
        where: {
            id: req.params.id
        }
    })

    if (collection) {
        if (!collection.wishlist) {
            if (req.user.isAdmin || collection.owner_ID == req.user.id) {
                await collection.destroy()
                await collection.save()

                res.status(200).json({
                    message: 'Collection deleted.'
                })
            } else {

                res.status(401).json({
                    message: 'You are not permitted to do this.'
                })
            }
        } else {
            res.status(401).json({
                message: 'You may not delete a wishlist'
            })
        }
    } else {
        res.status(404).json({
            message: 'Collection does not exist'
        })
    }
})

//WISHLIST READ


module.exports = router;