module.exports = (sequelize, type) => {
    return sequelize.define('message', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: type.TEXT,
        date: type.DATE,
    })
}