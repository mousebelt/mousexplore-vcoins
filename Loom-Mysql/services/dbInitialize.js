
module.exports = function (app) {
  const models = require('../models'); // eslint-disable-line
  app.set('sequelize', models.sequelize);
  app.set('models', models.sequelize.models);

  models.sequelize.sync()
    .then(() => app.logger.info('Sequelize synced'))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      app.logger.error('Sequelize sync failed: ', error.message);
    });
};
