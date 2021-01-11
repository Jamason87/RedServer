

export {};

const router = require('express').Router();
const { Funko } = require('../models');
const { Op } = require('sequelize');

const validateSession = require('../middleware/validateSession')

//CREATE
router.post('/create', validateSession, (req: any, res: any) => {
    if (req.user.isAdmin) {
        let {handle, title, imageName, series} = req.body;

        Funko.create({
            handle,
            title,
            imageName,
            series
        }).then((data: any) => {
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


router.post('/search', (req: any, res: any) => {
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
        .then((data: any) => {
            res.status(200).json({
                data
            })
        })
        .catch((err: any) => {
            res.status(500).json({
                message: 'Server issue'
            })
        })
});

//UPDATE
router.post('/update/:id', validateSession, (req: any, res: any) => {
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
router.get('/delete/:id', validateSession, (req: any, res: any) => {
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

router.post('/getall', (req:any, res:any) => {
    let funkoIds = req.body.funkoIds;

    Funko.findAll({where: {
        id: funkoIds
    }})
        .then((funkos: any) => {
            res.status(200).json({
                funkos
            })
        })
})

//READ
router.get('/:id', (req: any, res: any) => {
    Funko.findByPk(req.params.id).then((funko: any) => {
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
    .catch((err: any) => {
        res.status(500).json({
            message: 'Server issue'
        })
    })
});

module.exports = router;