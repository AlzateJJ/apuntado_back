const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Round = sequelize.define('round', {
    finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    winner_id: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    // game_id
});

module.exports = Round;