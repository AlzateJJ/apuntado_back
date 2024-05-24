const { getAll, create, getOne, remove, update, setGameUsers } = require('../controllers/game.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT')

const gameRouter = express.Router();

gameRouter.route('/games')
    .get(getAll)
    .post(verifyJWT, create);

gameRouter.route('/games/:id/users')
    .post(setGameUsers)

gameRouter.route('/games/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = gameRouter;