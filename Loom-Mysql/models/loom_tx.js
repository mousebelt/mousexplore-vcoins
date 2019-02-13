const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  const loomTx = sequelize.define('loom_tx', {
    hash: {
      primaryKey: true,
      type: Sequelize.STRING
    },
    blockNumber: {
      type: Sequelize.INTEGER
    },
    from: {
      type: Sequelize.STRING,
      validate: { isLowercase: true }
    },
    to: {
      type: Sequelize.STRING,
      validate: { isLowercase: true }
    },
    value: {
      type: Sequelize.BIGINT,
    },
    fee: {
      type: Sequelize.INTEGER,
    },
    timestamp: {
      type: Sequelize.INTEGER,
    },
  });

  loomTx.upsert = (values, condition) => (
    loomTx.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return loomTx.create(values);
      })
  );

  return loomTx;
};
