module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        lastName: type.STRING,
        nickname: type.STRING,
        email: type.STRING,
        password: type.STRING,
    })
}