const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const withAuth = require('./authenticateMiddleware');
const socket = require('socket.io');
const { router: loginRouter } = require('./login');
const { router: registerRouter } = require('./register');
const { router: chatRouter } = require('./chat');
const cors = require('cors');
const { Message } = require('./db/sequelize')

const app = express();

const clientUrl = 'http://localhost:3000';

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', clientUrl);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.options('*', cors())
app.use(cookieParser());


app.use('/api/login', loginRouter);

app.use('/api/user', registerRouter);

app.use('/api/chat', withAuth, chatRouter);

const users = {};
app.get('/api/users', withAuth, function (req, res) {
    res.send(users)
})

let server = app.listen(8080);

// socketio
const io = socket(server);
io.on("connection", socket => {
    console.log("New client connected");

    socket.on("JOIN", user => {
        socket['userId'] = user.id;
        if (!(user.id in users)) {
            users[user.id] = user.nickname;
        }
        socket.broadcast.emit("USER_JOINED", user);
        console.log('User joined ' + user.id);
    });

    socket.on("disconnect", () => {
        if (socket['userId']) {
            socket.broadcast.emit('USER_LEFT', socket['userId']);
            console.log('User left ' + socket['userId']);
        }
        if (socket['userId'] in users) {
            delete users[socket['userId']];
        }
    });

    socket.on('SEND_MESSAGE', (message) => {
        console.log(message);
        Message.create({ text: message.message, userId: message.senderId, chatRoomId: 4 });
        socket.broadcast.emit('MESSAGE_RECEIVED', message);
    });
});
