const Sequelize = require('sequelize')
const UserModel = require('../models/user')
const ChatRoomModel = require('../models/chat_room')
const MessageModel = require('../models/message')
const bcrypt = require("bcrypt");


const sequelize = new Sequelize('livechat', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

// // BlogTag will be our way of tracking relationship between Blog and Tag models
// // each Blog can have multiple tags and each Tag can have multiple blogs
// const BlogTag = sequelize.define('blog_tag', {})
// const Blog = BlogModel(sequelize, Sequelize)
const User = UserModel(sequelize, Sequelize)
const ChatRoom = ChatRoomModel(sequelize, Sequelize)
const Message = MessageModel(sequelize, Sequelize)
User.beforeCreate((user, options) => {

    return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => {
            throw new Error();
        });
});

// Blog.belongsToMany(Tag, { through: BlogTag, unique: false })
// Tag.belongsToMany(Blog, { through: BlogTag, unique: false })
ChatRoom.belongsTo(User); //Foreign key to 
Message.belongsTo(User);
Message.belongsTo(ChatRoom);
sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`)
    })

module.exports = {
    User,
    ChatRoom,
    Message
}