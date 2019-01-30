const mongoose = require('mongoose');
exports.getMonitor = async (req, res) => { // eslint-disable-line
  return res.send({ result: 'ok', message: 'Server is working now !' });
};

exports.getMonitorDb = async (req, res) => {
  try {
    if (mongoose.connection.readyState) {
      return res.send({ result: 'ok', message: 'Db is working now !' });
    }
    throw new Error('db error');
  } catch (error) {
    return res.status(400).send({ result: 'error', message: 'Db is not working now !' });
  }
};
