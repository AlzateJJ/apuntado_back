const { DataTypes, INTEGER } = require('sequelize');
const sequelize = require('../utils/connection');

const Game = sequelize.define('game', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    adminUserID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    started: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    num_rounds: {
        type: DataTypes.INTEGER,
        defaultValue: 0
        // allowNull: false
    },
    winner_id: {
        type: DataTypes.INTEGER,
    },
    max_players: {
        type: INTEGER,
        allowNull: false
    }
});

module.exports = Game;