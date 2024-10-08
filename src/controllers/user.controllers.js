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
        req.body, {
        where: {id},
        returning: true,
        include: [Card]
    });
    
    // quitar cartas del jugador cuando se saca del juego
    if ((req.body).points == 0 && ((req.body).gameId == null)) {
        console.log("entré al if")
        const user = await User.findByPk(id)
        await user.setCards([])

        const myUser = await User.findByPk(id, { include: [Card] }) // PENDIENTE: eliminar cartas
        return res.json(myUser).status(204)
    }
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]).status(204);
});

const login = catchError(async(req, res) => {
    const { email, password } = req.body
    const createdUser = await User.findOne( { where: { email : email }, include: [Card] } )
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
    const { id } = req.user
    const myUser = await User.findByPk(id, { include: [Card] })
    return res.json(myUser).status(200)
})

const setUserCards = catchError(async(req, res) => {
    const { id } = req.params
    const user = await User.findByPk(id, { include: [Card]})

    if (!user) return(res.status(401).json({message: "usuario no encontrado :("}))
    
    await user.setCards(req.body)

    const myUser = await User.findByPk(id, { include: [Card] })

    console.log(myUser)
    return res.json(myUser).status(204)
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login,
    findMe,
    setUserCards
}