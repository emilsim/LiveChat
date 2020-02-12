const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const { User, ChatRoom, Message } = require('./db/sequelize')

router.route('/:title')
    .get(function (req, res) {
        const beforeCreatedAt = req.query.createdAt ? req.query.createdAt : today();
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
                    chatRoomId: entry.id,
                    createdAt: { [Op.lt]: beforeCreatedAt }
                }, order: [
                    ["createdAt", "DESC"]
                ],
                limit: 20,
            }).then(messages => {
                const messagesForSending = [];
                messages.forEach(message => {
                    messagesForSending.push({ senderId: message.user.id, senderName: message.user.nickname, message: message.text, createdAt: message.createdAt })
                });
                res.status = 200;
                res.send(JSON.stringify(messagesForSending.reverse()));
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

function today() {
    let today = new Date();
    let date = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + today.getDate();
    let hours = today.getHours() < 10 ? `0${today.getHours()}` : today.getHours();
    let minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes();
    let seconds = today.getSeconds() < 10 ? `0${today.getSeconds()}` : today.getSeconds()
    let time = hours + ":" + minutes + ":" + seconds;
    let dateTime = date + 'T' + time + ".779Z";
    return dateTime;
}


module.exports = {
    router
};