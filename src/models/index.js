const Card = require("./Card");
const User = require("./User");

User.hasMany(Card)
Card.belongsTo(User)