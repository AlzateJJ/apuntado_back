const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Card = sequelize.define('card', {
    suit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    // owner_id
    // deck_id
});

module.exports = Card;