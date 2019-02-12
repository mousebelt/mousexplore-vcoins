const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  const token = sequelize.define('token', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    symbol: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    decimal: {
      type: Sequelize.FLOAT,
    },
  });

  return token;
};
