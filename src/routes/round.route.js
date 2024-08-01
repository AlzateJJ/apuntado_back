const { getAll, create, getOne, remove, update, getAllByPk } = require('../controllers/round.controllers');
const express = require('express');

const roundRouter = express.Router();

roundRouter.route('/rounds')
    .get(getAll)
    .post(create);

roundRouter.route('/rounds/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = roundRouter;