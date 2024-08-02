const { getAll, create, getOne, remove, update, setGameUsers, serveCards, validateBajarse } = require('../controllers/game.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT')

const gameRouter = express.Router();

gameRouter.route('/games')
    .get(getAll)
    .post(verifyJWT, create);

gameRouter.route('/win/games')
    .post(verifyJWT, validateBajarse)

gameRouter.route('/serve/games/:id')
    .post(serveCards) // .post(verifyJWT, serveCards)

gameRouter.route('/games/:id/users')
    .post(setGameUsers)

gameRouter.route('/games/:id')
    .get(getOne)
    .delete(verifyJWT, remove)
    .put(verifyJWT, update);

module.exports = gameRouter;