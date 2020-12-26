export {};

const router = require('express').Router();
const { Funko } = require('../models');

router.get('/:id', async (req, res) => {
    try {
        Funko.findByPk(req.params.id).then((funko) => {
            console.log(funko.handle);
            res.status(200).json({
                data: funko
            })
        })
    } catch (error) {
        
    }
});

module.exports = router;