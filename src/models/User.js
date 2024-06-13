const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const User = sequelize.define('user', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    points: {
        type: DataTypes.INTEGER,
        defaultValue: 0
        // allowNull: false
    },
    isPlaying: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        // allowNull: false
    },
    // gameId
});

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.createdAt;
    delete values.updatedAt;
    return values;
}

module.exports = User;