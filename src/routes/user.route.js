const { getAll, create, getOne, remove, update, findMe, login } = require('../controllers/user.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT')

const userRouter = express.Router();

userRouter.route('/users')
    .get(getAll) // verifyJWT, 
    .post(create);

userRouter.route('/users/me')
    .get(verifyJWT, findMe)

userRouter.route('/users/login')
    .post(login)

userRouter.route('/users/:id')
    .get(verifyJWT, getOne)
    .delete(verifyJWT, remove)
    .put(verifyJWT, update);

module.exports = userRouter;