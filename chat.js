const express = require('express');
const router = express.Router();
const { User, ChatRoom, Message } = require('./db/sequelize')

router.route('/:title')
    .get(function (req, res) {
        const { title } = req.params;
        ChatRoom.findOne({
            where: {
                title
            }
        }).then(entry => {
            Message.findAll({
                required: true,
                include: [{
                    model: User,
                    join: {
                        model: Message,
                        userId: User.id
                    }
                }],
                where: {
                    chatRoomId: entry.id
                }
            }).then(messages => {
                const messagesForSending = [];
                messages.forEach(message => {
                    messagesForSending.push({ senderId: message.user.id, senderName: message.user.nickname, message: message.text })
                });
                res.status = 200;
                res.send(JSON.stringify(messagesForSending));
            }).catch(err => {
                console.log("ERROR! Cannot find messages " + err);
                res.status = 404;
                res.send(err);
            })

        }).catch(err => {
            console.log("ERROR! Cannot find chat room " + err);
            res.status = 404;
            res.send(err);
        })

    });


module.exports = {
    router
};