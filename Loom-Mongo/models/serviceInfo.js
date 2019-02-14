const mongoose = require('mongoose');

const serviceInfoSchema = new mongoose.Schema({
  key: String,
  data: Object,
  updated: { type: Date, default: Date.now }
});

const ServiceInfo = mongoose.model('ServiceInfo', serviceInfoSchema);
module.exports = ServiceInfo;
