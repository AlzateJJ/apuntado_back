const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Deck = sequelize.define('deck', {
    // game_id
});

module.exports = Deck;