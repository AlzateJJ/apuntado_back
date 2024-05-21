const express = require('express');
const cardRouter = require('./card.route');
const userRouter = require('./user.route');
const router = express.Router();

// colocar las rutas aquí
router.use(cardRouter)
router.use(userRouter)

module.exports = router;