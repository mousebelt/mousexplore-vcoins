const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const item = sequelize.define('item', {
    tokenId: {
      primaryKey: true,
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    circulatingSupply: {
      type: Sequelize.INTEGER,
    },
    totalSupply: {
      type: Sequelize.INTEGER,
    },
  });

  item.upsert = (values, condition) => (
    item.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return item.create(values);
      })
  );

  item.associate = function (models) {
    this.hasMany(models.ownership, {
      foreignKey: {
        name: 'itemTokenId',
        allowNull: true
      },
      onDelete: 'SET NULL'
    });
    this.belongsTo(models.game, {
      foreignKey: {
        name: 'gameAddress',
        allowNull: true
      },
      onDelete: 'SET NULL'
    });
  };

  return item;
};
