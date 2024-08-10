const catchError = require('../utils/catchError');
const Game = require('../models/Game');
const User = require('../models/User');
const Card = require('../models/Card');
const Deck = require('../models/Deck');
const Round = require('../models/Round');
const Dealer = require('../utils/Dealer')
// const validarBajarse = require('../utils/Dealer')
// const validarTocar = require('../utils/Dealer')
// const comprobarManos = require('../utils/Dealer')

const getAll = catchError(async(req, res) => {
    const results = await Game.findAll({ 
        include: [{model: Deck,
            include: [Card]
        }, User, Round]});
    // eliminar juegos sin usuarios de la bd
    results.map(async game => game.users.length === 0
        ? await Game.destroy({ where: {id: game.id} })
        : game
    )
    return res.json(results);
});

const create = catchError(async (req, res) => {
    const { name, max_players } = req.body;
    const admin = req.user;

    if (admin.gameId) return res.status(404).json({ message: "El usuario ya está en un juego, no puede participar en otro! :/" });

    const sequelize = require('../utils/connection');
    const transaction = await sequelize.transaction();

    try {
        // Creación del juego
        const newGame = await Game.create({
            name,
            max_players,
            adminUserID: admin.id
        }, { transaction });

        await newGame.setUsers([admin.id], { transaction });

        // Creación del deck del juego
        const newGameDeck = await Deck.create({
            gameId: newGame.id
        }, { transaction });

        // Creación de las cartas del deck
        // const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        const suits = ['corazón', 'picas', 'trebol', 'diamante'];
        for (let i = 0; i < 4; i++) {
            for (let y = 0; y < 13; y++) {
                for (let z = 0; z < 2; z++) {
                    await Card.create({
                        rank: ranks[y],
                        suit: suits[i],
                        deckId: newGameDeck.id
                    }, { transaction });
                }
            }
        }

        // Creación del primer round del juego
        await Round.create({
            gameId: newGame.id
        }, { transaction });

        await transaction.commit();

        // Consultar el juego actualizado con las asociaciones
        const newUpdatedGame = await Game.findByPk(newGame.id, {
            include: [
                {
                    model: Deck,
                    include: [Card]
                },
                User,
                Round
            ]
        });

        return res.status(201).json(newUpdatedGame);
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: "Error al crear el juego", error });
    }
});


const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Game.findByPk(id, { include: [ User ] });
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    const gameToDelete = await Game.findByPk(id, { 
        include: [{
            model: User,
            include: [Card]
        }] 
    });

    if (!gameToDelete) {
        return res.status(404).send('Juego no encontrado');
    }

    // settear los atributos de usuarios cuando se elimine juego
    const updateUsersPromises = gameToDelete.users.map(async (user) => { // PENDIENTE: eliminar cartas de usuarios
        user.gameId = null;
        await Card.destroy({ where: { userId: user.id } }); // Eliminar las cartas del usuario
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

const serveCards = catchError(async (req, res) => {
    const { id } = req.params;
    const userId = req.params.userId || null
    // Fetch the game with related data
    const game = await Game.findByPk(id, {
        include: [
            {
                model: Deck,
                include: [Card]
            },
            User
        ],
    });
    
    if (!game) {
        return res.status(404).json({ message: "Juego no encontrado :((" });
    }

    const gamePlayers = game.users;
    if (gamePlayers.length === 0) {
        return res.status(400).json({ message: "No hay jugadores en el juego" });
    }

    const firstPlayer = (game.users.find(u => u.id === userId)) || gamePlayers[0];
    // const firstPlayer = gamePlayers[0];

    game.turnplayerID = firstPlayer.id;
    await game.save();

    const enableAllCards = (deck) => {
        for (const card of deck) {
            card.state = 1
            card.userId = null
            card.save()
        }
    }

    // solo se hace reset a las cartas cuando se hace en una ronda diferente a la primera (PENDIENTE)
    enableAllCards(game.deck.cards)

    const takenCards = new Set();

    // Function to get a random card
    const getRandomCard = (deck) => {
        const randomIndex = Math.floor(Math.random() * deck.cards.length);
        return deck.cards[randomIndex];
    };

    // Distribute cards to players
    for (const player of gamePlayers) {
        const numCards = player.id === firstPlayer.id ? 11 : 10;
        const playerCardsPromises = [];

        while (playerCardsPromises.length < numCards) {
            const card = getRandomCard(game.deck);

            if (!takenCards.has(card.id)) {
                takenCards.add(card.id);
                card.state = 2;
                card.userId = player.id;
                playerCardsPromises.push(card.save());
            }
        }
        
        await Promise.all(playerCardsPromises);
    }

    // Fetch the updated game data
    const updatedGame = await Game.findByPk(id, {
        include: [
            {
                model: Deck,
                include: [Card]
            },
            User
        ],
    });

    return res.status(200).json(updatedGame);
});

const validateBajarse = catchError(async(req, res) => {
    const admin = req.user;
    const winnerPlayer = await User.findByPk(admin.id, { include: [Card] })
    console.log(winnerPlayer)
    if (!Dealer.validarBajarse(winnerPlayer)) return res.status(400).json({message: "no te puedes bajar :("})

    const game = await Game.findByPk(winnerPlayer.gameId, 
        {
            include: [{
                model: User,
                include: [Card]
            }]
        }
    )

    const otherUsers = game.users.filter(user => user.id != winnerPlayer.id)
    const objetoResultados = Dealer.comprobarManos(winnerPlayer, otherUsers)
    
    const listaResultados = Object.keys(objetoResultados).forEach(playerId => {
        const player = game.users.find(user => user.id === playerId)
        player.points += +(objetoResultados[playerId])
        player.save()
    })
    Promise.all(listaResultados)
    return res.status(200).json(objetoResultados)
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    setGameUsers,
    serveCards,
    validateBajarse,
}