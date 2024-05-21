const { getAll, create, getOne, remove, update } = require('../controllers/card.controllers');
const express = require('express');

const cardRouter = express.Router();

cardRouter.route('/cards')
    .get(getAll)
    .post(create);

cardRouter.route('/cards/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = cardRouter;