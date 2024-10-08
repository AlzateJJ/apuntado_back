const catchError = require('../utils/catchError');
const Round = require('../models/Round');

const getAll = catchError(async(req, res) => {
    const results = await Round.findAll();
    return res.json(results);
});

const getAllByPk = catchError(async(req, res) => {
    const { id } = req.params
    const results = await Round.findAll( { where: {id} });
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await Round.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Round.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Round.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Round.update(
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
    getAllByPk
}