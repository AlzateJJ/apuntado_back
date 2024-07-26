const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Card = sequelize.define('card', {
    suit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rank: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
        // allowNull: false
    },
    // states de la carta:
    // 1: en deck del juego
    // 2: en mazo de algún jugador
    // 3: como carta tirada
    // 4: como carta ya descartada (tirada y no elegida)


    // owner_id
    // deck_id
});

// User.prototype.toJSON = function () {
//     const values = Object.assign({}, this.get());
//     delete values.createdAt;
//     delete values.updatedAt;
//     return values;
// }

module.exports = Card;