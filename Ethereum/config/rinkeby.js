const tokens = [
  {
    name: 'Sapien Network',
    symbol: 'SPN',
    address: '0x9aab5ac0173c01c0cf9d8484e177c47e19b5dd22',
    decimal: 6
  },
];

const config = {
  tokens,
  db: 'mongodb://localhost:27017/ethereum-rinkeby-db',
};
module.exports = config;
