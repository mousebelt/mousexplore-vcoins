'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));
var ramda = require('ramda');
var bignumber_js = require('bignumber.js');
var Web3 = _interopDefault(require('web3'));

const web3 = new Web3();
const sigToString = (sig) => sig.signature + sig.message.slice(2);
const signRaw = (msg, privKey) => web3.eth.accounts.sign(msg, privKey);
const sign = (msg, privKey) => sigToString(signRaw(msg, privKey));
const hashParam = (value, type) => web3.utils.soliditySha3(web3.eth.abi.encodeParameter(type, value));
bignumber_js.BigNumber.config({ EXPONENTIAL_AT: 300 });
const BN = (x) => new bignumber_js.BigNumber(x);
const tsExtraShift = BN(2).pow(120);
const unitShift = BN(2).pow(248);

/*************************************************************\
 *                                                           *
 *        THIS FILE WAS AUTOMATICALLY GENERATED              *
 *      ANY CHANGES TO THIS FILE WILL BE REVERTED            *
 *                                                           *
\*************************************************************/
const hashParams = (values, types) => values.map((value, index) => hashParam(value, types[index]));
const combineHashes = (hashes) => hashParam(hashes, 'bytes32[]');
const scaleUp = (rarityPercs) => {
    const smallestFraction = Math.max(...rarityPercs.map((z) => new bignumber_js.BigNumber(z).decimalPlaces()));
    const scaleFactor = new bignumber_js.BigNumber(10).pow(smallestFraction);
    const scaledUp = rarityPercs.map((z) => new bignumber_js.BigNumber(z).multipliedBy(scaleFactor)).map(Number);
    return scaledUp;
};
const hashParamTypes = {
    token: {
        add: ['address', 'string', 'uint256', 'uint256', 'uint256', 'string', 'string', 'uint256'],
        mint: ['address', 'uint256', 'address', 'uint256', 'uint256'],
        transfer: ['address', 'uint256', 'address', 'address', 'uint256', 'uint256'],
        burn: ['address', 'uint256', 'address', 'uint256', 'uint256']
    },
    box: {
        add: ['address', 'string', 'string', 'string', 'uint256[]', 'uint256'],
        buy: ['address', 'uint256', 'uint256'],
        remove: ['address', 'uint256', 'uint256'],
        update: ['address', 'uint256', 'bool', 'string', 'string', 'string', 'uint256[]', 'uint256']
    },
    game: {
        deploy: ['address', 'string', 'string', 'string', 'string', 'uint256[]', 'uint256'],
        transfer: ['address', 'address', 'address', 'uint256']
    },
    loan: {
        finish: ['address', 'uint256', 'uint256'],
        handlePrivate: ['address', 'uint256', 'bool', 'uint256'],
        handlePublic: ['address', 'uint256', 'uint256'],
        offerPrivate: ['address', 'address', 'address', 'uint256', 'uint256', 'uint256', 'uint256'],
        offerPublic: ['address', 'address', 'uint256', 'uint256', 'uint256', 'uint256']
    },
    shop: {
        cashToToken: ['address', 'uint256', 'uint256', 'uint256'],
        tokenToCash: ['address', 'uint256', 'uint256', 'uint256'],
        tokenToToken: ['address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256']
    },
    trade: {
        offerPrivate: ['address', 'address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
        offerPublic: ['address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
        remove: ['address', 'uint256', 'uint256'],
        takePrivate: ['address', 'uint256', 'uint256'],
        takePublic: ['address', 'uint256', 'uint256']
    },
    user: {
        generate: ['address']
    }
};
const hash = {
    token: {
        add: ({ gameAddr, name, rarity, cap, val, desc, image, timestamp }) => {
            const valueArr = [gameAddr, name, rarity, cap, val, desc, image, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.token.add);
            return combineHashes(hashes);
        },
        mint: ({ gameAddr, tokenId, to, amount, timestamp }) => {
            const valueArr = [gameAddr, tokenId, to, amount, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.token.mint);
            return combineHashes(hashes);
        },
        transfer: ({ gameAddr, tokenId, from, to, amount, timestamp }) => {
            const valueArr = [gameAddr, tokenId, from, to, amount, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.token.transfer);
            return combineHashes(hashes);
        },
        burn: ({ gameAddr, tokenId, from, amount, timestamp }) => {
            const valueArr = [gameAddr, tokenId, from, amount, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.token.burn);
            return combineHashes(hashes);
        }
    },
    box: {
        add: ({ gameAddr, name, desc, image, tokens, timestamp }) => {
            const valueArr = [gameAddr, name, desc, image, tokens, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.box.add);
            return combineHashes(hashes);
        },
        buy: ({ gameAddr, boxId, timestamp }) => {
            const valueArr = [gameAddr, boxId, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.box.buy);
            return combineHashes(hashes);
        },
        remove: ({ gameAddr, boxId, timestamp }) => {
            const valueArr = [gameAddr, boxId, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.box.remove);
            return combineHashes(hashes);
        },
        update: ({ gameAddr, boxId, isValid, name, desc, image, tokens, timestamp }) => {
            const valueArr = [gameAddr, boxId, isValid, name, desc, image, tokens, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.box.update);
            return combineHashes(hashes);
        }
    },
    game: {
        deploy: ({ owner, name, symbol, desc, image, rarityPercs, timestamp }) => {
            const valueArr = [owner, name, symbol, desc, image, scaleUp(rarityPercs), timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.game.deploy);
            return combineHashes(hashes);
        },
        transfer: ({ gameAddr, from, to, timestamp }) => {
            const valueArr = [gameAddr, from, to, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.game.transfer);
            return combineHashes(hashes);
        }
    },
    loan: {
        finish: ({ gameAddr, loanId, timestamp }) => {
            const valueArr = [gameAddr, loanId, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.loan.finish);
            return combineHashes(hashes);
        },
        handlePrivate: ({ gameAddr, loanId, decision, timestamp }) => {
            const valueArr = [gameAddr, loanId, decision, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.loan.handlePrivate);
            return combineHashes(hashes);
        },
        handlePublic: ({ gameAddr, loanId, timestamp }) => {
            const valueArr = [gameAddr, loanId, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.loan.handlePublic);
            return combineHashes(hashes);
        },
        offerPrivate: ({ gameAddr, lender, borrower, tokenId, amount, length, timestamp }) => {
            const valueArr = [gameAddr, lender, borrower, tokenId, amount, length, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.loan.offerPrivate);
            return combineHashes(hashes);
        },
        offerPublic: ({ gameAddr, lender, tokenId, amount, length, timestamp }) => {
            const valueArr = [gameAddr, lender, tokenId, amount, length, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.loan.offerPublic);
            return combineHashes(hashes);
        }
    },
    shop: {
        cashToToken: ({ gameAddr, tokenId, amount, timestamp }) => {
            const valueArr = [gameAddr, tokenId, amount, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.shop.cashToToken);
            return combineHashes(hashes);
        },
        tokenToCash: ({ gameAddr, tokenId, amount, timestamp }) => {
            const valueArr = [gameAddr, tokenId, amount, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.shop.tokenToCash);
            return combineHashes(hashes);
        },
        tokenToToken: ({ gameAddr, fromId, fromAmount, toId, toAmount, timestamp }) => {
            const valueArr = [gameAddr, fromId, fromAmount, toId, toAmount, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.shop.tokenToToken);
            return combineHashes(hashes);
        }
    },
    trade: {
        offerPrivate: ({ gameAddr, taker, offeredId, offeredAmount, wantedId, wantedAmount, timestamp }) => {
            const valueArr = [gameAddr, taker, offeredId, offeredAmount, wantedId, wantedAmount, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.trade.offerPrivate);
            return combineHashes(hashes);
        },
        offerPublic: ({ gameAddr, offeredAmount, offeredId, wantedAmount, wantedId, timestamp }) => {
            const valueArr = [gameAddr, offeredAmount, offeredId, wantedAmount, wantedId, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.trade.offerPublic);
            return combineHashes(hashes);
        },
        remove: ({ gameAddr, index, timestamp }) => {
            const valueArr = [gameAddr, index, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.trade.remove);
            return combineHashes(hashes);
        },
        takePrivate: ({ gameAddr, index, timestamp }) => {
            const valueArr = [gameAddr, index, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.trade.takePrivate);
            return combineHashes(hashes);
        },
        takePublic: ({ gameAddr, index, timestamp }) => {
            const valueArr = [gameAddr, index, timestamp];
            const hashes = hashParams(valueArr, hashParamTypes.trade.takePublic);
            return combineHashes(hashes);
        }
    },
    user: {
        generate: ({ gameAddr }) => {
            const valueArr = [gameAddr];
            const hashes = hashParams(valueArr, hashParamTypes.user.generate);
            return combineHashes(hashes);
        }
    }
};

const hashAndSign = {
    token: {
        add: (data, privKey) => sign(hash.token.add(data), privKey),
        mint: (data, privKey) => sign(hash.token.mint(data), privKey),
        transfer: (data, privKey) => sign(hash.token.transfer(data), privKey),
        burn: (data, privKey) => sign(hash.token.burn(data), privKey)
    },
    box: {
        add: (data, privKey) => sign(hash.box.add(data), privKey),
        buy: (data, privKey) => sign(hash.box.buy(data), privKey),
        remove: (data, privKey) => sign(hash.box.remove(data), privKey),
        update: (data, privKey) => sign(hash.box.update(data), privKey)
    },
    game: {
        deploy: (data, privKey) => sign(hash.game.deploy(data), privKey),
        transfer: (data, privKey) => sign(hash.game.transfer(data), privKey)
    },
    loan: {
        finish: (data, privKey) => sign(hash.loan.finish(data), privKey),
        handlePrivate: (data, privKey) => sign(hash.loan.handlePrivate(data), privKey),
        handlePublic: (data, privKey) => sign(hash.loan.handlePublic(data), privKey),
        offerPrivate: (data, privKey) => sign(hash.loan.offerPrivate(data), privKey),
        offerPublic: (data, privKey) => sign(hash.loan.offerPublic(data), privKey)
    },
    shop: {
        cashToToken: (data, privKey) => sign(hash.shop.cashToToken(data), privKey),
        tokenToCash: (data, privKey) => sign(hash.shop.tokenToCash(data), privKey),
        tokenToToken: (data, privKey) => sign(hash.shop.tokenToToken(data), privKey)
    },
    trade: {
        offerPrivate: (data, privKey) => sign(hash.trade.offerPrivate(data), privKey),
        offerPublic: (data, privKey) => sign(hash.trade.offerPublic(data), privKey),
        remove: (data, privKey) => sign(hash.trade.remove(data), privKey),
        takePrivate: (data, privKey) => sign(hash.trade.takePrivate(data), privKey),
        takePublic: (data, privKey) => sign(hash.trade.takePublic(data), privKey)
    },
    user: {
        generate: (data, privKey) => sign(hash.user.generate(data), privKey)
    }
};

const createPostJSON = {
    token: {
        add: (data, privKey) => ({ ...data, signedMessage: hashAndSign.token.add(data, privKey) }),
        mint: (data, privKey) => ({ ...data, signedMessage: hashAndSign.token.mint(data, privKey) }),
        transfer: (data, privKey) => ({ ...data, signedMessage: hashAndSign.token.transfer(data, privKey) }),
        burn: (data, privKey) => ({ ...data, signedMessage: hashAndSign.token.burn(data, privKey) })
    },
    box: {
        add: (data, privKey) => ({ ...data, signedMessage: hashAndSign.box.add(data, privKey) }),
        buy: (data, privKey) => ({ ...data, signedMessage: hashAndSign.box.buy(data, privKey) }),
        remove: (data, privKey) => ({ ...data, signedMessage: hashAndSign.box.remove(data, privKey) }),
        update: (data, privKey) => ({ ...data, signedMessage: hashAndSign.box.update(data, privKey) })
    },
    game: {
        deploy: (data, privKey) => ({ ...data, signedMessage: hashAndSign.game.deploy(data, privKey) }),
        transfer: (data, privKey) => ({ ...data, signedMessage: hashAndSign.game.transfer(data, privKey) })
    },
    loan: {
        finish: (data, privKey) => ({ ...data, signedMessage: hashAndSign.loan.finish(data, privKey) }),
        handlePrivate: (data, privKey) => ({ ...data, signedMessage: hashAndSign.loan.handlePrivate(data, privKey) }),
        handlePublic: (data, privKey) => ({ ...data, signedMessage: hashAndSign.loan.handlePublic(data, privKey) }),
        offerPrivate: (data, privKey) => ({ ...data, signedMessage: hashAndSign.loan.offerPrivate(data, privKey) }),
        offerPublic: (data, privKey) => ({ ...data, signedMessage: hashAndSign.loan.offerPublic(data, privKey) })
    },
    shop: {
        cashToToken: (data, privKey) => ({ ...data, signedMessage: hashAndSign.shop.cashToToken(data, privKey) }),
        tokenToCash: (data, privKey) => ({ ...data, signedMessage: hashAndSign.shop.tokenToCash(data, privKey) }),
        tokenToToken: (data, privKey) => ({ ...data, signedMessage: hashAndSign.shop.tokenToToken(data, privKey) })
    },
    trade: {
        offerPrivate: (data, privKey) => ({ ...data, signedMessage: hashAndSign.trade.offerPrivate(data, privKey) }),
        offerPublic: (data, privKey) => ({ ...data, signedMessage: hashAndSign.trade.offerPublic(data, privKey) }),
        remove: (data, privKey) => ({ ...data, signedMessage: hashAndSign.trade.remove(data, privKey) }),
        takePrivate: (data, privKey) => ({ ...data, signedMessage: hashAndSign.trade.takePrivate(data, privKey) }),
        takePublic: (data, privKey) => ({ ...data, signedMessage: hashAndSign.trade.takePublic(data, privKey) })
    },
    user: {
        generate: (data, privKey) => ({ ...data, signedMessage: hashAndSign.user.generate(data, privKey) })
    }
};

/*************************************************************\
 *                                                           *
 *        THIS FILE WAS AUTOMATICALLY GENERATED              *
 *      ANY CHANGES TO THIS FILE WILL BE REVERTED            *
 *                                                           *
\*************************************************************/
const v = 'v1';
const wrapper = (baseURL = `http://api.sandbox.stardust.com/${v}`) => axios.create({
    baseURL,
    timeout: 25000,
    headers: { 'Content-Type': 'application/json' }
});
const txIdOnly = (res) => ({ txId: res.data.txId });
const getData = (api) => ({ txId }) => api.get(`/tx/return-data?txId=${txId}&blocking=true`);
const makeSetters = (wrapperIn) => ({
    token: {
        add: async (data, privKey) => wrapperIn.post('/tokens', createPostJSON.token.add(data, privKey), { params: ramda.pick(['gameAddr'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        mint: async (data, privKey) => wrapperIn.post('/tokens/mint', createPostJSON.token.mint(data, privKey), { params: ramda.pick(['gameAddr', 'tokenId'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        transfer: async (data, privKey) => wrapperIn.post('/tokens/transfer', createPostJSON.token.transfer(data, privKey), { params: ramda.pick(['gameAddr', 'tokenId'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        burn: async (data, privKey) => wrapperIn.post('/tokens/burn', createPostJSON.token.burn(data, privKey), { params: ramda.pick(['gameAddr', 'tokenId'], data) }).then(txIdOnly).then(getData(wrapperIn))
    },
    box: {
        add: async (data, privKey) => wrapperIn.post('/boxes', createPostJSON.box.add(data, privKey), { params: ramda.pick(['gameAddr'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        buy: async (data, privKey) => wrapperIn.post('/boxes/buy', createPostJSON.box.buy(data, privKey), { params: ramda.pick(['gameAddr', 'boxId'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        remove: async (data, privKey) => wrapperIn.post('/boxes/delete', createPostJSON.box.remove(data, privKey), { params: ramda.pick(['gameAddr', 'boxId'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        update: async (data, privKey) => wrapperIn.post('/boxes/update', createPostJSON.box.update(data, privKey), { params: ramda.pick(['gameAddr', 'boxId'], data) }).then(txIdOnly).then(getData(wrapperIn))
    },
    game: {
        deploy: async (data, privKey) => wrapperIn.post('/games', createPostJSON.game.deploy(data, privKey), { params: ramda.pick([], data) }).then(txIdOnly).then(getData(wrapperIn)),
        transfer: async (data, privKey) => wrapperIn.post('/games/transfer', createPostJSON.game.transfer(data, privKey), { params: ramda.pick(['gameAddr'], data) }).then(txIdOnly).then(getData(wrapperIn))
    },
    loan: {
        finish: async (data, privKey) => wrapperIn.post('/loans/finish', createPostJSON.loan.finish(data, privKey), { params: ramda.pick(['gameAddr', 'loanId'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        handlePrivate: async (data, privKey) => wrapperIn.post('/loans/handle-private', createPostJSON.loan.handlePrivate(data, privKey), { params: ramda.pick(['gameAddr', 'loanId'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        handlePublic: async (data, privKey) => wrapperIn.post('/loans/handle-public', createPostJSON.loan.handlePublic(data, privKey), { params: ramda.pick(['gameAddr', 'loanId'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        offerPrivate: async (data, privKey) => wrapperIn.post('/loans/offer-private', createPostJSON.loan.offerPrivate(data, privKey), { params: ramda.pick(['gameAddr', 'tokenId'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        offerPublic: async (data, privKey) => wrapperIn.post('/loans/offer-public', createPostJSON.loan.offerPublic(data, privKey), { params: ramda.pick(['gameAddr', 'tokenId'], data) }).then(txIdOnly).then(getData(wrapperIn))
    },
    shop: {
        cashToToken: async (data, privKey) => wrapperIn.post('/shop/cash-to-token', createPostJSON.shop.cashToToken(data, privKey), { params: ramda.pick(['gameAddr'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        tokenToCash: async (data, privKey) => wrapperIn.post('/shop/token-to-cash', createPostJSON.shop.tokenToCash(data, privKey), { params: ramda.pick(['gameAddr'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        tokenToToken: async (data, privKey) => wrapperIn.post('/shop/token-to-token', createPostJSON.shop.tokenToToken(data, privKey), { params: ramda.pick(['gameAddr'], data) }).then(txIdOnly).then(getData(wrapperIn))
    },
    trade: {
        offerPrivate: async (data, privKey) => wrapperIn.post('/trades/offer-private', createPostJSON.trade.offerPrivate(data, privKey), { params: ramda.pick(['gameAddr'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        offerPublic: async (data, privKey) => wrapperIn.post('/trades/offer-public', createPostJSON.trade.offerPublic(data, privKey), { params: ramda.pick(['gameAddr'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        remove: async (data, privKey) => wrapperIn.post('/trades/remove', createPostJSON.trade.remove(data, privKey), { params: ramda.pick(['gameAddr', 'index'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        takePrivate: async (data, privKey) => wrapperIn.post('/trades/take-private', createPostJSON.trade.takePrivate(data, privKey), { params: ramda.pick(['gameAddr', 'index'], data) }).then(txIdOnly).then(getData(wrapperIn)),
        takePublic: async (data, privKey) => wrapperIn.post('/trades/take-public', createPostJSON.trade.takePublic(data, privKey), { params: ramda.pick(['gameAddr', 'index'], data) }).then(txIdOnly).then(getData(wrapperIn))
    },
    user: {
        generate: async (data, privKey) => wrapperIn.post('/user/generate', createPostJSON.user.generate(data, privKey), { params: ramda.pick(['gameAddr'], data) }).then(txIdOnly).then(getData(wrapperIn))
    }
});
const makeGetters = (wrapperIn) => ({
    token: {
        getAllTokensOf: async (params) => wrapperIn.get('/allTokensOf', { params }),
        getTokensOf: async (params) => wrapperIn.get('/tokensOf', { params }),
        getDetails: async (params) => wrapperIn.get('/tokens', { params }),
        getAll: async (params) => wrapperIn.get('/tokens', { params }),
        getOne: async (params) => wrapperIn.get('/tokens', { params })
    },
    box: {
        getDetails: async (params) => wrapperIn.get('/boxes', { params }),
        getAll: async (params) => wrapperIn.get('/boxes', { params }),
        getOne: async (params) => wrapperIn.get('/boxes', { params })
    },
    game: {
        getBalanceOf: async (params) => wrapperIn.get('/games/balance', { params }),
        getDetails: async (params) => wrapperIn.get('/games', { params }),
        getAll: async (params) => wrapperIn.get('/games', { params }),
        getOne: async (params) => wrapperIn.get('/games', { params })
    },
    loan: {
        getCreatedCount: async (params) => wrapperIn.get('/loans/created-loans-count', { params }),
        getDeletedCount: async (params) => wrapperIn.get('/loans/deleted-loans-count', { params }),
        getFreeBalanceOf: async (params) => wrapperIn.get('/loans/free-balance-of', { params }),
        getLoanedBalanceOf: async (params) => wrapperIn.get('/loans/loaned-balance-of', { params }),
        getSpecific: async (params) => wrapperIn.get('/loans', { params })
    },
    shop: {
        getOrderCount: async (params) => wrapperIn.get('/shop/order-count', { params }),
        getUserOrderCount: async (params) => wrapperIn.get('/shop/user-order-count', { params }),
        getSpecific: async (params) => wrapperIn.get('/shop/orders', { params }),
        getUserOrderCountInGame: async (params) => wrapperIn.get('/shop/orders/count', { params }),
        getUserOrderDetails: async (params) => wrapperIn.get('/shop/game-orders', { params }),
        getAllUserOrders: async (params) => wrapperIn.get('/shop/game-orders', { params }),
        getOneUserOrder: async (params) => wrapperIn.get('/shop/game-orders', { params })
    },
    trade: {
        getAll: async (params) => wrapperIn.get('/trades', { params }),
        getGameClosedCount: async (params) => wrapperIn.get('/trades/game/closed-count', { params }),
        getGameDetails: async (params) => wrapperIn.get('/trades/game', { params }),
        getGameTrade: async (params) => wrapperIn.get('/trades/game', { params }),
        getGameTrades: async (params) => wrapperIn.get('/trades/game', { params }),
        getGameOpenCount: async (params) => wrapperIn.get('/trades/game/open-count', { params }),
        getUserTradeCountDetails: async (params) => wrapperIn.get('/trades/game/user/count', { params }),
        getUserTradeCount: async (params) => wrapperIn.get('/trades/game/user/count', { params }),
        getUserTradeCountInGame: async (params) => wrapperIn.get('/trades/game/user/count', { params }),
        getUserTradeIds: async (params) => wrapperIn.get('/trades/user/all-trade-ids', { params }),
        getUserTradeIdsInGame: async (params) => wrapperIn.get('/trades/game/user/all-trade-ids', { params }),
        getUserTradeInGame: async (params) => wrapperIn.get('/trades/game/user/id', { params }),
        getUserTrades: async (params) => wrapperIn.get('/trades/user', { params }),
        getUserTradesInGame: async (params) => wrapperIn.get('/trades/game/user', { params })
    },
    tx: {
        getStatus: async (params) => wrapperIn.get('/tx/status', { params }),
        getData: async (params) => wrapperIn.get('/tx/return-data', { params })
    }
});
const stardustAPI = (baseURL) => ({
    setters: makeSetters(wrapper(baseURL)),
    getters: makeGetters(wrapper(baseURL))
});

exports.stardustAPI = stardustAPI;
