const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const ownership = sequelize.define('ownership', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });
  ownership.associate = function (models) {
    this.belongsTo(models.user, {
      foreignKey: {
        name: 'ownerAddress',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
    this.belongsTo(models.item, {
      foreignKey: {
        name: 'itemTokenId',
        allowNull: true
      },
      onDelete: 'SET NULL'
    });
  };
  ownership.upsert = (values, condition) => (
    ownership.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return ownership.create(values);
      })
  );
  return ownership;
};
