const mongoose = require('mongoose');

const parallelInfoSchema = new mongoose.Schema({
  index: Number,	// 0 ~ config.CHECK_PARALLEL_BLOCKS - 1
  blockNumber: Number,
  totalTxs: Number,
  syncedIndex: Number,	// synced transactions
  updated: { type: Date, default: Date.now }
});

const ParallelInfo = mongoose.model('ParallelInfo', parallelInfoSchema);
module.exports = ParallelInfo;
