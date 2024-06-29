const catchError = require('../utils/catchError');
const Game = require('../models/Game');
const User = require('../models/User');
const Card = require('../models/Card');
const Deck = require('../models/Deck');

const getAll = catchError(async(req, res) => {
    const results = await Game.findAll({ 
        include: [{model: Deck,
            include: [Card]
        }, User]});
    // eliminar juegos sin usuarios de la bd
    results.map(async game => game.users.length === 0
        ? await Game.destroy({ where: {id: game.id} })
        : game
    )
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

    // creamos el deck del juego
    const newGameDeck = await Deck.create({
        gameId: newGame.id
    })

    // creamos las cartas del juego
    const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'j', 'q', 'k', 'a']
    const suits = ['corazón', 'picas', 'trebol', 'diamante']
    for (let i = 0; i < 4; i++) {
        for (let y = 0; y < 13; y++) {
            console.log(`${ranks[y]} de ${suits[i]}`)
            await Card.create({
                rank: ranks[y],
                suit: suits[i],
                deckId: newGameDeck.id
            })
        }
    }
    
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
        { 
            where: { id }, 
            returning: true,
            include: [
                { 
                    model: Deck,
                    include: [Card]
                }, 
                User
            ] 
        }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const setGameUsers = catchError(async(req, res) => {
    const { id } = req.params
    const game = await Game.findByPk(id)
    if (!game) return (res.status(404).json({message: "juego no encontrado :(("}))
    
    await game.setUsers(req.body)

    const users = await game.getUsers()
    return res.status(200).json(users)
})

const serveCards = catchError(async(req, res) => {
    const admin = req.user // se le dan 11 al admin siempre por defecto
    const { id } = req.params
    const game = await Game.findByPk(id, {
        include: [{model: Deck,
            include: [Card]
        }, User]});
    if (!game) return (res.status(404).json({message: "juego no encontrado :(("}))

    const gamePlayers = game.users
    console.log('game:')
    console.log(game)
    console.log(gamePlayers)
    const cartasTomadas = new Set() // conjunto para tener la info de las cartas no disponibles

    for (const player of gamePlayers) {
        let numCards = player.id == admin.id ? 11 : 10 // se define el num de cartas para a cada jugador
        console.log(`numCards: ${numCards}`)
        let playerCardsPromises = [] // arreglo de promesas, donde irán las cartas del jugador

        while (playerCardsPromises.length < numCards) { // mientras el jugadir no alcance su num max de cartas
            let aleatorio = Math.floor(Math.random()) * 53 // indice aleatorio para buscar carta en mazo
            let card = game.deck.cards[aleatorio] // se escoge la carta aleatoria del mazo

            if (!cartasTomadas.has(card.userId)) { // si la carta está disponible
                cartasTomadas.add(card.id) // se agrega al arreglo
                card.isAvailable = false // se pone como false el attr isAvailable de la carta
                card.userId = player.id // se actualiza el attr userId de la carta, con el userId del player
                await card.save() // se guardan los cambios
                playerCardsPromises.push(card) // se agrega la carta al arreglo de promesas
            }
        }
        await Promise.all(playerCardsPromises)
    }

    // vuelvo a consultar el mismo juego, pero ya modificado, para retornarlo
    const gameReady = await Game.findByPk(id, {
        include: [{model: Deck,
            include: [Card]
        }, User]});

    return res.status(200).json(gameReady)
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    setGameUsers,
    serveCards
}