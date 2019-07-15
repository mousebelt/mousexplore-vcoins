const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const parallelInfo = sequelize.define('parallel_info', {
    index: {
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    blockNumber: {
      type: Sequelize.INTEGER,
    },
    totalTxs: {
      type: Sequelize.INTEGER,
    },
    syncedIndex: {
      type: Sequelize.INTEGER,
    },
  });

  parallelInfo.upsert = (values, condition) => (
    parallelInfo.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return parallelInfo.create(values);
      })
  );

  return parallelInfo;
};
