const tokens = [
  {
    name: 'TRONix',
    symbol: 'TRON',
    address: '0x4953c9676a395b2b166e9228ce872eb40c89bf04',
    decimal: 6
  },
];

const config = {
  db: 'mongodb://localhost:27017/ethereum-ropsten-db',
  tokens
};
module.exports = config;
