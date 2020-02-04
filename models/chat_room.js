module.exports = (sequelize, type) => {
    return sequelize.define('chat_room', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: type.STRING,
        date: type.DATE,
        isLocal: type.BOOLEAN
    })
}