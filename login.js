const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { User } = require('./db/sequelize')

const secret = 'mysecretsshhh';
router.route('/')
    .post((req, res) => {
        const { nickname, password } = req.body;
        User.findOne({
            where: {
                nickname
            }
        })
            .then(entry => {
                if (entry === null) {
                    res.status(401).json({ error: 'Incorrect nickname or password' });
                    res.send();
                    return;
                }
                isCorrectPassword(password, entry)
                    .then(result => {
                        if (result == false) {
                            throw new Error("Incorrect nickname or password");
                        }
                        // Issue token
                        const payload = { nickname, id: entry.id };
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '1h'
                        });
                        res.json({ 'id_token': token });

                    })
                    .catch(err => {
                        res.status(401).json({ error: err });
                    });
            })
            .catch(err => {
                res.status(401).json({ error: err });
            })
    });

function isCorrectPassword(password, user) {
    return bcrypt.compare(password, user.password);
}

module.exports = {
    router
};