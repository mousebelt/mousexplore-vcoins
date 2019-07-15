const config = require('../config');

exports.getRenderedTemplate = (templateName, data) => {
  try {
    const template = require(`../emails/${config.email.template.folder}/${templateName}`); // eslint-disable-line
    return template.render(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('getRenderedTemplate error: ', error);
  }

  return '';
};
