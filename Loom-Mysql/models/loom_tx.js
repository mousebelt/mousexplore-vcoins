const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  const loomTx = sequelize.define('loom_tx', {
    hash: {
      primaryKey: true,
      type: Sequelize.STRING(45)
    },
    blockNumber: {
      type: Sequelize.INTEGER
    },
    from: {
      type: Sequelize.STRING(45),
      validate: { isLowercase: true }
    },
    to: {
      type: Sequelize.STRING(45),
      validate: { isLowercase: true }
    },
    value: {
      type: Sequelize.BIGINT,
    },
    fee: {
      type: Sequelize.INTEGER,
    },
    timestamp: Number,
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
