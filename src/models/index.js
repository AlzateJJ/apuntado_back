const Card = require("./Card");
const Game = require("./Game");
const Round = require("./Round");
const User = require("./User");

User.hasMany(Card)
Card.belongsTo(User)

Game.hasMany(User)
User.belongsTo(Game)

Game.hasMany(Card)
Card.belongsTo(Game)

Game.hasMany(Round)
Round.belongsTo(Game)
