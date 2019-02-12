const mailcomposer = require('mailcomposer');
const config = require('../config');

exports.send = function (from, to, subject, text) {
  const mailgun = require('mailgun-js')({ apiKey: config.email.mailgun.private, domain: config.email.domain }); // eslint-disable-line
  return new Promise((resolve, reject) => {
    const mail = mailcomposer({
      from,
      to,
      subject,
      html: text
    });

    mail.build((mailBuildError, message) => {
      const dataToSend = {
        to,
        message: message.toString('ascii')
      };

      mailgun.messages().sendMime(dataToSend, (err, body) => {
        if (err) {
          return reject(err);
        }
        return resolve(body);
      });
    });
  });
};
