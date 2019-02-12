const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  const game = sequelize.define('game', {
    address: {
      primaryKey: true,
      type: Sequelize.STRING(45)
    },
    name: {
      type: Sequelize.STRING,
    },
  });

  game.upsert = (values, condition) => (
    game.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return game.create(values);
      })
  );

  game.associate = function (models) {
    this.hasMany(models.item, {
      foreignKey: {
        name: 'gameAddress',
        allowNull: true
      },
      onDelete: 'SET NULL'
    });
    this.hasMany(models.transaction, {
      foreignKey: {
        name: 'gameAddress',
        allowNull: true
      },
      onDelete: 'SET NULL'
    });
  };

  return game;
};
