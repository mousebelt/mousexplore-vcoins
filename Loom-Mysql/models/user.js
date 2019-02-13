const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  const user = sequelize.define('user', {
    address: {
      primaryKey: true,
      type: Sequelize.STRING
    }
  });

  user.upsert = (values, condition) => (
    user.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return user.create(values);
      })
  );

  user.associate = function (models) {
    this.hasMany(models.ownership, {
      foreignKey: {
        name: 'ownerAddress',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return user;
};
