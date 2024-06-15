const catchError = require('../utils/catchError');
const Game = require('../models/Game');
const User = require('../models/User');

const getAll = catchError(async(req, res) => {
    const results = await Game.findAll({ include: [User]});
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { name, max_players } = req.body
    const admin = req.user
    console.log(admin)
    if (admin.gameId) return (res.status(404).json({message: "el usuario ya está en un juego, no puede participar en otro! :/"}))
    
    const newGame = await Game.create({
        name,
        max_players,
        adminUserID: admin.id
    });

    await newGame.setUsers([admin.id])

    // admin.gameId = newGame.id;
    // await admin.save(); // Guarda los cambios en la base de datos
    
    return res.status(201).json(newGame);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Game.findByPk(id, { include: [ User ] });
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    const gameToDelete = await Game.findByPk(id, { include: [User] });

    if (!gameToDelete) {
        return res.status(404).send('Juego no encontrado');
    }

    // settear los atributos de usuarios cuando se elimine juego
    const updateUsersPromises = gameToDelete.users.map(async (user) => {
        user.gameId = null;
        await user.save();  // Guardar los cambios en cada usuario
    });

    await Promise.all(updateUsersPromises);  // Esperar a que todos los cambios se guarden

    await Game.destroy({ where: { id } });

    return res.sendStatus(204);
});


const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Game.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const setGameUsers = catchError(async(req, res) => {
    const { id } = req.params
    const game = await Game.findByPk(id)
    if (!game) return (res.status(404).json({message: "not found game!! :(("}))
    
    await game.setUsers(req.body)

    const users = await game.getUsers()
    return res.status(200).json(users)
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    setGameUsers
}