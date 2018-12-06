const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address: String, // Ae2d6qj91YL3LVUMkza7WQsaTYjzjHm4z1
  asset: String, // 0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7

  balance: {
    type: Number,
    default: 0
  },
  updatedAt: Date
});

addressSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

addressSchema.index({
  address: 1
});
addressSchema.index({
  asset: 1
});
addressSchema.index({
  address: 1,
  asset: 1
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
