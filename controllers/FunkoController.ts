

export {};

const router = require('express').Router();
const { Funko } = require('../models');
const { Op } = require('sequelize');

const validateSession = require('../middleware/validateSession')

//CREATE
router.post('/create', validateSession, (req, res) => {
    if (req.user.isAdmin) {
        let {handle, title, imageName, series} = req.body;

        Funko.create({
            handle,
            title,
            imageName,
            series
        }).then((data) => {
            res.status(200).json({
                message: 'Success',
                data: data
            })
        })
    } else {
        res.status(401).json({
            message: 'You are not permitted to do this.'
        })
    }
});

//READ
router.get('/:id', (req, res) => {
    Funko.findByPk(req.params.id).then((funko) => {
        if (funko) {
            res.status(200).json({
                data: funko
            })
        } else {
            res.status(404).json({
                message: 'Could not find funko for id ' + req.params.id
            })
        }
    })
    .catch((err) => {
        res.status(500).json({
            message: 'Server issue'
        })
    })
});

router.post('/search', (req, res) => {
    let query = req.body.query;
    let page = req.body.page;
    let maxResults = req.body.maxResults;

    Funko.findAndCountAll({
        where: {
            title: {
                [Op.iLike]: `%${query}%`
            }
        },
        limit: maxResults,
        offset: (page - 1) * maxResults
    })
        .then(data => {
            res.status(200).json({
                data
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Server issue'
            })
        })
});

//UPDATE
router.post('/update/:id', validateSession, (req, res) => {
    if (req.user.isAdmin) {
        let {handle, title, imageName, series} = req.body;

        Funko.update({
            handle,
            title,
            imageName,
            series
        }, {
            where: { id: req.params.id }
        }).then(() => {
            res.status(200).json({
                message: "Funko has been updated"
            })
        })
    } else {
        res.status(401).json({
            message: 'You are not permitted to do this.'
        })
    }
});

//DELETE
router.get('/delete/:id', validateSession, (req, res) => {
    if (req.user.isAdmin) {
        let {handle, title, imageName, series} = req.body;

        Funko.destroy({ where: { id: req.params.id } })
            .then(() => {
                res.status(200).json({
                    message: 'Funko has been deleted'
                })
            })
    } else {
        res.status(401).json({
            message: 'You are not permitted to do this.'
        })
    }
});


module.exports = router;