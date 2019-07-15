const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const transaction = sequelize.define('transaction', {
    hash: {
      primaryKey: true,
      type: Sequelize.STRING
    },
  });

  transaction.upsert = (values, condition) => (
    transaction.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return transaction.create(values);
      })
  );

  transaction.associate = function (models) {
    this.belongsTo(models.game, {
      foreignKey: {
        name: 'gameAddress',
        allowNull: true
      },
      onDelete: 'SET NULL'
    });
    this.belongsTo(models.transaction_type, {
      foreignKey: {
        name: 'transactionType',
        allowNull: true
      },
      onDelete: 'SET NULL'
    });
  };

  return transaction;
};
