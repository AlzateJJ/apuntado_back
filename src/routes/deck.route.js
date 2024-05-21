const { getAll, create, getOne, remove, update } = require('../controllers/deck.controllers');
const express = require('express');

const deckRouter = express.Router();

deckRouter.route('/decks')
    .get(getAll)
    .post(create);

deckRouter.route('/decks/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = deckRouter;