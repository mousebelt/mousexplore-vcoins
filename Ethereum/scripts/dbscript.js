const config = require('../config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.db, async function (err, db) { // eslint-disable-line
  const TransactionModel = require('../model/transactions'); // eslint-disable-line
  if (err) {
    console.log('------db error----------: ', err);
    return;
  }

  console.log('-----------------------Connected DB------------------');

  const limit = 100000;
  let count = 0;
  let docs = [];
  let lastId = undefined;

  do {
    try {

      docs = await TransactionModel
        .find(lastId ? { _id: { $gt: lastId } } : {}, { from: 1, to: 1 })
        .limit(limit);

      count += docs.length;
      lastId = docs[docs.length - 1]._id;

      console.log('------------------Read documents-----------------: ', count);
      console.log('------------------Last Id------------------------: ', lastId);

      for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];

        if (doc.from !== null) {
          doc.from = doc.from.toLowerCase();
        }

        if (doc.to !== null) {
          doc.to = doc.to.toLowerCase();
        }

        await doc.save();
      }

      console.log('------------------Saved documents-----------------: ', count);

    } catch (e) {
      console.log('---------------------Error-----------------------: ', e);
    }
  } while (docs.length >= limit);

  console.log('-----------------------Finished converting-----------------------');
});
