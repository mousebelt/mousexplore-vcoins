const Game = require('../models/game');
const Token = require('../models/token');
const { reducedErrorMessage } = require('../utils');

exports.getGame = (req, res) => {
  const { gameAddr } = req.params;
  const query = {
    gameAddr,
    isWhitelisted: true
  };

  Game.findOne(query)
    .then(game => res.status(200).send({ result: 'ok', data: { game } }))
    .catch(err => res.status(400).send({ result: 'error', message: reducedErrorMessage(err) }));
};

exports.getAllGames = (req, res) => {
  Game.find({
    isWhitelisted: true
  })
    .then(games => res.status(200).send({ result: 'ok', data: { games } }))
    .catch(err => res.status(400).send({ result: 'error', message: reducedErrorMessage(err) }));
};

exports.getGameItems = (req, res) => {
  const { gameAddr } = req.params;
  const query = {
    gameAddr,
  };

  Token.find(query)
    .then(tokens => res.status(200).send({ result: 'ok', data: { tokens } }))
    .catch(err => res.status(400).send({ result: 'error', message: reducedErrorMessage(err) }));
};

exports.getAllItems = (req, res) => {
  Token.find()
    .then(tokens => res.status(200).send({ result: 'ok', data: { tokens } }))
    .catch(err => res.status(400).send({ result: 'error', message: reducedErrorMessage(err) }));
};

exports.getSearch = (req, res) => {
  const { q, orderBy } = req.query;
  const gameQuery = {
    $and: [
      { isWhitelisted: true }
    ]
  };

  if (q && q.length) {
    gameQuery.$and.push({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });
  }

  if (orderBy === 'popularity') {
    // TODO: sort by popularity
  }
  Game.find(gameQuery)
    .then(games => res.status(200).send({ result: 'ok', data: { games } }))
    .catch(err => res.status(400).send({ result: 'error', message: reducedErrorMessage(err) }));
};
