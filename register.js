const express = require('express');
const router = express.Router();
const { User } = require('./db/sequelize')

router.route('/')
    .post((req, res) => {
        console.log(req.body)
        User.create(req.body)
            .then(user => {
                res.status(200);
                res.json(user);
            })
            .catch(err => {
                res.status(400);
                res.json(err);
            })
    })

module.exports = {
    router
};