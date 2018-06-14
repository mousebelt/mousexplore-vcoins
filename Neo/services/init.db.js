var TokenModel = require("../model/token");

exports.start = () => {
  TokenModel.find({}, (err, rows) => {
    if (err) {
      console.log("Token DB error !");
    }

    if (!rows || rows.length === 0) {
      try {
        var tokens = [
          {
            name: "NEO",
            ticker: "NEO",
            asset:
              "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
            type: "GoverningToken"
          },
          {
            name: "GAS",
            ticker: "GAS",
            asset:
              "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
            type: "UtilityToken"
          },
          {
            name: "Ontology",
            ticker: "ONT",
            asset: "0xceab719b8baa2310f232ee0d277c061704541cfb",
            type: "NEP5"
          },
          {
            name: "Endorsit Shares",
            ticker: "EDS",
            asset: "0x81c089ab996fc89c468a26c0a88d23ae2f34b5c0",
            type: "NEP5"
          },
          {
            name: "THEKEY Token",
            ticker: "TKY",
            asset: "0x132947096727c84c7f9e076c90f08fec3bc17f18",
            type: "NEP5"
          },
          {
            name: "Red Pulse Token",
            ticker: "RPX",
            asset: "0xecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
            type: "NEP5"
          },
          //---- test end
          {
            name: "Loopring Neo Token",
            ticker: "LRN",
            asset: "0x06fa8be9b6609d963e8fc63977b9f8dc5f10895f",
            type: "AQV236N8gvwsPpNkMeVFK5T8gSTriU1gri"
          },
          {
            name: "Trinity Network Credit",
            ticker: "TNC",
            asset: "0x08e8c4400f1af2c20c28e0018f29535eb85d15b6",
            type: "AYNeDxGckhtPQCLRWTz7ByT8gmKvd3UzKJ"
          },
          {
            name: "Qlink Token",
            ticker: "QLC",
            asset: "0x0d821bd7b6d53f5c2b40e217c6defc8bbe896cf5",
            type: "Ae9ZDrTxsBxgtDG9jPdyrtEBEyP73Jx6p6"
          },
          {
            name: "Orbis",
            ticker: "OBT",
            asset: "0x0e86a40588f715fcaf7acd1812d50af478e6e917",
            type: "AHxKPazwxuL1rDBEbodogyf24zzASxwRRz"
          },
          {
            name: "THEKEY Token",
            ticker: "TKY",
            asset: "0x132947096727c84c7f9e076c90f08fec3bc17f18",
            type: "AJ1QufPwytDD7SaAhvCopbfktFS3pP2Exg"
          },
          {
            name: "Redeemable HashPuppy Token",
            ticker: "RHT",
            asset: "0x2328008e6f6c7bd157a342e789389eb034d9cbc4",
            type: "AZiSHjfYVcjqUnPyschLnvsk7AS7nJty1d"
          },
          {
            name: "Orbis",
            ticker: "OBT",
            asset: "0x23501e5fef0f67ec476406c556e91992323a0357",
            type: "APhxJRhcPYGVXnYAeAH6HWycKzBJQndmL5"
          },
          {
            name: "Narrative Token",
            ticker: "NRV",
            asset: "0x2e25d2127e0240c6deaf35394702feb236d4d7fc",
            type: "AepnUu5Aq4rhgejET6QFegxFR1HDScbTyK"
          },
          {
            name: "Concierge Token",
            ticker: "CGE",
            asset: "0x34579e4614ac1a7bd295372d3de8621770c76cdc",
            type: "AbsNcoUs6pCmLkUtLHUHMpiZDMhTdTK25E"
          },
          {
            name: "Wowbit",
            ticker: "WWB",
            asset: "0x40bb36a54bf28872b6ffdfa7fbc6480900e58448",
            type: "ANPKVz2eTzz3NTmxLEgA8WQEJM27yosGhy"
          },
          {
            name: "Ontology Token",
            ticker: "ONT",
            asset: "0x442e7964f6486005235e87e082f56cd52aa663b8",
            type: "AYaqMY1BqZF1Mn3rwTWmRWzryJqwto3y8j"
          },
          {
            name: "CPX Token",
            ticker: "CPX",
            asset: "0x45d493a6f73fa5f404244a5fb8472fc014ca5885",
            type: "ATvwtCuCVm2B7XnZMXZ67j8yqxqqiCfySX"
          },
          {
            name: "Block chain store",
            ticker: "BCS",
            asset: "0x546c5872a992b2754ef327154f4c119baabff65f",
            type: "AQXHS83VE7keq2nrfLiQnhfXCS1h21NnaQ"
          },
          {
            name: "Thor Token",
            ticker: "THOR",
            asset: "0x67a5086bac196b67d5fd20745b0dc9db4d2930ed",
            type: "AdQ1VGfuQeWSi1TmcgtZrYBdn2eKpkAen2"
          },
          {
            name: "Aphelion",
            ticker: "APH",
            asset: "0x6d36b38af912ca107f55a5daedc650054f7e4f75",
            type: "ASU9wEtZE2A4FUGizYXRUpYDaGwCkfx523"
          },
          {
            name: "Quarteria Token",
            ticker: "XQTA",
            asset: "0x6eca2c4bd2b3ed97b2aa41b26128a40ce2bd8d1a",
            type: "AJCH1seQr88hnkHvowBqLmPUKHfFajnUzc"
          },
          {
            name: "Switcheo",
            ticker: "SWH",
            asset: "0x78e6d16b914fe15bc16150aeb11d0c2a8e532bdd",
            type: "AbwJtGDCcwoH2HhDmDq12ZcqFmUpCU3XMp"
          },
          {
            name: "Quarteria Token",
            ticker: "XQT",
            asset: "0x7ac4a2bb052a047506f2f2d3d1528b89cc38e8d4",
            type: "AbBd6DzcYQn18eJSrADNeqnEm283UvKGgL"
          },
          {
            name: "ACAT Token",
            ticker: "ACAT",
            asset: "0x7f86d61ff377f1b12e589a5907152b57e2ad9a7a",
            type: "ASx9PCk8smvVv5domHECPreGN181pesW9v"
          },
          {
            name: "Endorsit Shares",
            ticker: "EDS",
            asset: "0x81c089ab996fc89c468a26c0a88d23ae2f34b5c0",
            type: "AZLpTbR2MawuoAUmRei88mrRcNKdCmxPwq"
          },
          {
            name: "Bridge Token",
            ticker: "IAM",
            asset: "0x891daf0e1750a1031ebe23030828ad7781d874d6",
            type: "AbKpE8gvdbTua9U1xaXBMSfqN19h3JkrVF"
          },
          {
            name: "Galaxy Token",
            ticker: "GALA",
            asset: "0x9577c3f972d769220d69d1c4ddbd617c44d067aa",
            type: "AXJttCccv9nwkqTUhFvYSQ7WFTVYhbPLGi"
          },
          {
            name: "Aphelion",
            ticker: "APH",
            asset: "0xa0777c3ce2b169d4a23bcba4565e3225a0122d95",
            type: "AVNeKnqNa8zHRMysAiMaBcPVT51T6p3MVi"
          },
          {
            name: "NKN Token",
            ticker: "NKN",
            asset: "0xa0b328c01eac8b12b0f8a4fe93645d18fb3f1f0a",
            type: "AGhPqhXMtCQQoFmtt9twJ7hWCzZhftQdyL"
          },
          {
            name: "Narrative Token",
            ticker: "NRVE",
            asset: "0xa721d5893480260bd28ca1f395f2c465d0b5b1c2",
            type: "AZXKdEc2M73qeQMmPj2zmKJFDWmzQf8Gyr"
          },
          {
            name: "Master asset Token",
            ticker: "MCT",
            asset: "0xa87cc2a513f5d8b4a42432343687c2127c60bc3f",
            type: "AMastErQzeMZgjivLFL2mW1cUPF1xRcSjt"
          },
          {
            name: "Switcheo",
            ticker: "SWTH",
            asset: "0xab38352559b8b203bde5fddfa0b07d8b2525e132",
            type: "ALQu9SpN4GCc5xC336AffGMcuDeF8Qh2bJ"
          },
          {
            name: "Zeepin Token",
            ticker: "ZPT",
            asset: "0xac116d4b8d4ca55e6b6d4ecce2192039b51cccc5",
            type: "AZojHFQ4UZzuVvF733WASA5dVFgfoeNX5x"
          },
          {
            name: "Effect.AI Token",
            ticker: "EFX",
            asset: "0xacbc532904b6b51b5ea6d19b803d78af70e7e6f9",
            type: "AeZEWm1oB2UMZDGPQNLPMtHTtgFs9F4M7z"
          },
          {
            name: "Pikcio Token",
            ticker: "PKC",
            asset: "0xaf7c7328eee5a275a3bcaee2bf0cf662b5e739be",
            type: "AZ7hQGFdfcpPhzkZyBi6zhavfiddovvZKr"
          },
          {
            name: "DeepBrain Coin",
            ticker: "DBC",
            asset: "0xb951ecbbc5fe37a9c280a76cb0ce0014827294cf",
            type: "AahTMWKL2q2ffJcPGVYoZsRcvcE21hjGaQ"
          },
          {
            name: "Ontology Token",
            ticker: "ONT",
            asset: "0xceab719b8baa2310f232ee0d277c061704541cfb",
            type: "AefdBvb3bh7dNJHLmrQeQ193ckPch8ic5g"
          },
          {
            name: "Guardium",
            ticker: "GDM",
            asset: "0xd1e37547d88bc9607ff9d73116ebd9381c156f79",
            type: "ASqxUrX2AWKMjCWauA72egMdaHxF9DLPm1"
          },
          {
            name: "Travala",
            ticker: "AVA",
            asset: "0xde2ed49b691e76754c20fe619d891b78ef58e537",
            type: "ALsRZPLkBZeubnBeejsaV3y2x56LYzQUQT"
          },
          {
            name: "Experience Token",
            ticker: "EXT",
            asset: "0xe8f98440ad0d7a6e76d84fb1c3d3f8a16e162e97",
            type: "AVZEtgvLx7gG7mtFgqxvLa7NVJ4MUnT8JQ"
          },
          {
            name: "Red Pulse Token",
            ticker: "RPX",
            asset: "0xecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
            type: "AeV59NyZtgj5AMQ7vY6yhr2MRvcfFeLWSb"
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
