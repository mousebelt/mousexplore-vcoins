/* eslint-disable react/no-this-in-sfc */
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const serviceInfo = sequelize.define('service_info', {
    key: {
      primaryKey: true,
      type: Sequelize.STRING
    },
    data: {
      type: Sequelize.TEXT,
      get() {
        // eslint-disable-next-line react/no-this-in-sfc
        if (this.getDataValue('data')) {
          return JSON.parse(this.getDataValue('data'));
        }
        return null;
      },
      set(value) {
        this.setDataValue('data', JSON.stringify(value));
      },
    },
  },
  {
    timestamps: true,
  });

  serviceInfo.upsert = (values, condition) => (
    serviceInfo.findOne({ where: condition })
      .then((obj) => {
        if (obj) {
          return obj.update(values);
        }
        return serviceInfo.create(values);
      })
  );

  return serviceInfo;
};
