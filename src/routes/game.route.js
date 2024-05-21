const { getAll, create, getOne, remove, update } = require('../controllers/game.controllers');
const express = require('express');

const gameRouter = express.Router();

gameRouter.route('/games')
    .get(getAll)
    .post(create);

gameRouter.route('/games/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = gameRouter;