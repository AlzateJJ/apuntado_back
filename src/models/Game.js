const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Game = sequelize.define('game', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    started: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    startHour: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endHour: {
        type: DataTypes.DATE,
        // allowNull: false
    },
    num_rounds: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    winner_id: {
        type: DataTypes.INTEGER,
        // allowNull: false
    },
});

module.exports = Game;