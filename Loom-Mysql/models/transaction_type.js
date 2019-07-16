const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const transactionType = sequelize.define('transaction_type', {
    type: {
      primaryKey: true,
      type: Sequelize.STRING
    },
  });

  transactionType.upsert = (values, condition) => (
    transactionType.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return transactionType.create(values);
      })
  );

  transactionType.associate = function (models) {
    this.hasMany(models.transaction, {
      foreignKey: {
        name: 'transactionType',
        allowNull: true
      },
      onDelete: 'SET NULL'
    });
  };

  return transactionType;
};
