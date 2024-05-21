const Card = require("./Card");
const Deck = require("./Deck");
const Game = require("./Game");
const Round = require("./Round");
const User = require("./User");

User.hasMany(Card)
Card.belongsTo(User)

Game.hasMany(User)
User.belongsTo(Game)

Game.belongsTo(Deck)
Deck.belongsTo(Game) // validar cuando se esten acabando las cartas

Deck.hasMany(Card)
Card.belongsTo(Deck)

Game.hasMany(Round)
Round.belongsTo(Game)
