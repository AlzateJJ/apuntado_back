const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Round = sequelize.define('round', {
    seq_number: {
        type: DataTypes.INTEGER,
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
    winner_id: {
        type: DataTypes.INTEGER,
        // allowNull: false
    },
    // game_id
});

module.exports = Round;