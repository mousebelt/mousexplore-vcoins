var TokenModel = require("../model/tokens");

exports.start = () => {
  TokenModel.find({}, (err, rows) => {
    if (err) {
      console.log("Token DB error !");
    }

    if (!rows || rows.length === 0) {
      try {
        var tokens = [
          {
            name: "TRONix",
            symbol: "TRON",
            address: "0xf230b790e05390fc8295f4d3f60332c93bed42e2",
            decimal: 6
          },
          {
            name: "VeChain",
            symbol: "VEN",
            address: "0xd850942ef8811f2a866692a623011bde52a462c1",
            decimal: 18
          },
          {
            name: "Binance Coin",
            symbol: "BNB",
            address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
            decimal: 18
          },
          {
            name: "OmiseGO",
            symbol: "OMG",
            address: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
            decimal: 18
          },
          {
            name: "Zilliqa",
            symbol: "ZIL",
            address: "0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27",
            decimal: 12
          },
          {
            name: "Aeternity",
            symbol: "AE",
            address: "0x5ca9a71b1d01849c0a95490cc00559717fcf0d1d",
            decimal: 18
          },
          {
            name: "ZRX",
            symbol: "ZRX",
            address: "0xe41d2489571d322189246dafa5ebde1f4699f498",
            decimal: 18
          },
          {
            name: "Bytom",
            symbol: "BTM",
            address: "0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750",
            decimal: 8
          },
          {
            name: "RHOC",
            symbol: "RHOC",
            address: "0x168296bb09e24a88805cb9c33356536b980d3fc5",
            decimal: 8
          },
          {
            name: "REP",
            symbol: "REP",
            address: "0xe94327d07fc17907b4db788e5adf2ed424addff6",
            decimal: 18
          },
          {
            name: "Maker",
            symbol: "MKR",
            address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
            decimal: 18
          },
          {
            name: "Populous",
            symbol: "PPT",
            address: "0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a",
            decimal: 8
          },
          {
            name: "Golem",
            symbol: "GNT",
            address: "0xa74476443119A942dE498590Fe1f2454d7D4aC0d",
            decimal: 18
          },
          {
            name: "IOSToken",
            symbol: "IOST",
            address: "0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab",
            decimal: 18
          },
          {
            name: "StatusNetwork",
            symbol: "SNT",
            address: "0x744d70fdbe2ba4cf95131626614a1763df805b9e",
            decimal: 18
          },
          {
            name: "Walton",
            symbol: "WTC",
            address: "0xb7cb1c96db6b22b0d3d9536e0108d062bd488f74",
            decimal: 18
          },
          {
            name: "AION",
            symbol: "AION",
            address: "0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466",
            decimal: 8
          },
          {
            name: "DigixDAO",
            symbol: "DGD",
            address: "0xe0b7927c4af23765cb51314a0e0521a9645f0e2a",
            decimal: 9
          },
          {
            name: "Nebulas",
            symbol: "NAS",
            address: "0x5d65D971895Edc438f465c17DB6992698a52318D",
            decimal: 18
          },
          {
            name: "Loopring",
            symbol: "LRC",
            address: "0xef68e7c694f40c8202821edf525de3782458639f",
            decimal: 18
          },
          {
            name: "BAT",
            symbol: "BAT",
            address: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
            decimal: 18
          },
          {
            name: "ELF",
            symbol: "ELF",
            address: "0xbf2179859fc6d5bee9bf9158632dc51678a4100e",
            decimal: 18
          },
          {
            name: "Dentacoin",
            symbol: "DCN",
            address: "0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6",
            decimal: 0
          },
          {
            name: "Loom",
            symbol: "LOOM",
            address: "0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0",
            decimal: 18
          },
          {
            name: "KyberNetwork",
            symbol: "KNC",
            address: "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
            decimal: 18
          },
          {
            name: "Ethos",
            symbol: "ETHOS",
            address: "0x5af2be193a6abca9c8817001f45744777db30756",
            decimal: 8
          },
          {
            name: "Substratum",
            symbol: "SUB",
            address: "0x12480e24eb5bec1a9d4369cab6a80cad3c0a377a",
            decimal: 2
          },
          {
            name: "Bancor",
            symbol: "BNT",
            address: "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
            decimal: 18
          },
          {
            name: "Polymath",
            symbol: "POLY",
            address: "0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec",
            decimal: 18
          },
          {
            name: "QASH",
            symbol: "QASH",
            address: "0x618e75ac90b12c6049ba3b27f5d5f8651b0037f6",
            decimal: 6
          },
          {
            name: "FunFair",
            symbol: "FUN",
            address: "0x419d0d8bdd9af5e606ae2232ed285aff190e711b",
            decimal: 8
          },
          {
            name: "Fusion",
            symbol: "FSN",
            address: "0xd0352a019e9ab9d757776f532377aaebd36fd541",
            decimal: 18
          },
          {
            name: "Dragon",
            symbol: "DRGN",
            address: "0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e",
            decimal: 18
          },
          {
            name: "Cortex Coin",
            symbol: "CTXC",
            address: "0xea11755ae41d889ceec39a63e6ff75a02bc1c00d",
            decimal: 18
          },
          {
            name: "Enigma",
            symbol: "ENG",
            address: "0xf0ee6b27b759c9893ce4f094b49ad28fd15a23e4",
            decimal: 8
          },
          {
            name: "HuobiToken",
            symbol: "HT",
            address: "0x6f259637dcd74c767781e37bc6133cd6a68aa161",
            decimal: 18
          },
          {
            name: "Nexo",
            symbol: "NEXO",
            address: "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206",
            decimal: 18
          },
          {
            name: "Storm",
            symbol: "STORM",
            address: "0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433",
            decimal: 18
          },
          {
            name: "Nuls",
            symbol: "NULS",
            address: "0xb91318f35bdb262e9423bc7c7c2a3a93dd93c92c",
            decimal: 18
          },
          {
            name: "Salt",
            symbol: "SALT",
            address: "0x4156D3342D5c385a87D264F90653733592000581",
            decimal: 8
          },
          {
            name: "ICON",
            symbol: "ICX",
            address: "0xb5a5f22694352c15b00323844ad545abb2b11028",
            decimal: 18
          }
        ];
        TokenModel.insertMany(tokens);
        console.log("created token collection !");
      } catch (e) {
        console.log("error in creating token collecetion !", e);
      }
    }
  });
};
