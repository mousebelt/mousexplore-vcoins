const mongoose = require('mongoose');

const serviceInfoSchema = new mongoose.Schema({
  lastblock: Number,
  updatedAt: Number
});

serviceInfoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const ServiceInfo = mongoose.model('ServiceInfo', serviceInfoSchema);
module.exports = ServiceInfo;
