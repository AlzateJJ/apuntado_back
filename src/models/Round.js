const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Round = sequelize.define('round', {
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    // valores de state:
    // 1. true -> empezó ( en juego)
    // 2. false -> terminó
    
    winner_id: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    // game_id
});

module.exports = Round;