const express = require('express');
const cardRouter = require('./card.route');
const userRouter = require('./user.route');
const gameRouter = require('./game.route');
const roundRouter = require('./round.route');
const router = express.Router();

// colocar las rutas aquí
router.use(cardRouter)
router.use(userRouter)
router.use(gameRouter)
router.use(roundRouter)

module.exports = router;