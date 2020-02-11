const bcrypt = require("bcrypt");

module.exports = (sequelize, type) => {
    return (sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: type.STRING,
        lastName: type.STRING,
        nickname: {
            type: type.STRING,
            unique: 'compositeIndex'
        },
        email: type.STRING,
        password: type.STRING,
    })
    )
}