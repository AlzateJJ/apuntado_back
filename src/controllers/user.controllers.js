const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Card = require('../models/Card');

const getAll = catchError(async(req, res) => {
    const results = await User.findAll({ include: [Card]});
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { firstName, lastName, email, password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async(req, res) => {
    const { email, password } = req.body
    const createdUser = await User.findOne( { where: { email : email } } )
    if (!createdUser) return res.status(404).json({message: "no existe el usuario :("})
    const validPassword = await bcrypt.compare(password, createdUser.password)
    if (!validPassword) return res.status(404).json({ message: "contraseña inválida :/" })

    const accessToken = jwt.sign(
        { user: createdUser }, // payload
        process.env.TOKEN_SECRET, // clave secreta
        { expiresIn: '1d' } // OPCIONAL: Tiempo en el que expira el token
    )
        
    return res.status(200).json({accessToken, createdUser})
})

const findMe = catchError(async(req, res) => {
    const user = req.user
    return res.json(user)
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login,
    findMe
}