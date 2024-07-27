const catchError = require('../utils/catchError');
const Card = require('../models/Card');
const Game = require('../models/Game');
const Deck = require('../models/Deck');

const getAll = catchError(async(req, res) => {
    const results = await Card.findAll();
    return res.json(results);
});

const getAllByDeck = catchError(async(req, res) => {
    const { id } = req.params // id del juego
    const game = await Game.findByPk(id, { include: [Deck]})
    const results = await Card.findAll({
        where: {deckId: game.deck.id}
    });
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await Card.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Card.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Card.destroy({ where: {id} });
    return res.sendStatus(204);
});

const removeAll = catchError(async(req, res) => { // para borrar todas las cartas (necesario temporalmente)
    await Card.destroy({ where: {} });
    return res.status(204).json({message: 'se borraron todos los registos del modelo Cards'});
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Card.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    removeAll,
    getAllByDeck
}