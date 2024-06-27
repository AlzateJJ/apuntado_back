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
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        // allowNull: false
    },
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