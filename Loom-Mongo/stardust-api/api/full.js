"use strict";
/*************************************************************\
 *                                                           *
 *        THIS FILE WAS AUTOMATICALLY GENERATED              *
 *      ANY CHANGES TO THIS FILE WILL BE REVERTED            *
 *                                                           *
\*************************************************************/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ramda_1 = require("ramda");
const postJSON_1 = require("../postJSON");
const v = 'v1';
const wrapper = (baseURL = `http://api.sandbox.stardust.com/${v}`) => axios_1.default.create({
    baseURL,
    timeout: 25000,
    headers: { 'Content-Type': 'application/json' }
});
const makeSetters = (wrapperIn) => ({
    token: {
        add: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/tokens', postJSON_1.createPostJSON.token.add(data, privKey), { params: ramda_1.pick(['gameAddr'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        mint: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/tokens/mint', postJSON_1.createPostJSON.token.mint(data, privKey), { params: ramda_1.pick(['gameAddr', 'tokenId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        transfer: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/tokens/transfer', postJSON_1.createPostJSON.token.transfer(data, privKey), { params: ramda_1.pick(['gameAddr', 'tokenId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        burn: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/tokens/burn', postJSON_1.createPostJSON.token.burn(data, privKey), { params: ramda_1.pick(['gameAddr', 'tokenId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        })
    },
    box: {
        add: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/boxes', postJSON_1.createPostJSON.box.add(data, privKey), { params: ramda_1.pick(['gameAddr'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        buy: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/boxes/buy', postJSON_1.createPostJSON.box.buy(data, privKey), { params: ramda_1.pick(['gameAddr', 'boxId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        remove: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/boxes/delete', postJSON_1.createPostJSON.box.remove(data, privKey), { params: ramda_1.pick(['gameAddr', 'boxId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        update: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/boxes/update', postJSON_1.createPostJSON.box.update(data, privKey), { params: ramda_1.pick(['gameAddr', 'boxId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        })
    },
    game: {
        deploy: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/games', postJSON_1.createPostJSON.game.deploy(data, privKey), { params: ramda_1.pick([], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        transfer: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/games/transfer', postJSON_1.createPostJSON.game.transfer(data, privKey), { params: ramda_1.pick(['gameAddr'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        })
    },
    loan: {
        finish: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/loans/finish', postJSON_1.createPostJSON.loan.finish(data, privKey), { params: ramda_1.pick(['gameAddr', 'loanId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        handlePrivate: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/loans/handle-private', postJSON_1.createPostJSON.loan.handlePrivate(data, privKey), { params: ramda_1.pick(['gameAddr', 'loanId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        handlePublic: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/loans/handle-public', postJSON_1.createPostJSON.loan.handlePublic(data, privKey), { params: ramda_1.pick(['gameAddr', 'loanId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        offerPrivate: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/loans/offer-private', postJSON_1.createPostJSON.loan.offerPrivate(data, privKey), { params: ramda_1.pick(['gameAddr', 'tokenId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        offerPublic: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/loans/offer-public', postJSON_1.createPostJSON.loan.offerPublic(data, privKey), { params: ramda_1.pick(['gameAddr', 'tokenId'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        })
    },
    shop: {
        cashToToken: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/shop/cash-to-token', postJSON_1.createPostJSON.shop.cashToToken(data, privKey), { params: ramda_1.pick(['gameAddr'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        tokenToCash: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/shop/token-to-cash', postJSON_1.createPostJSON.shop.tokenToCash(data, privKey), { params: ramda_1.pick(['gameAddr'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        tokenToToken: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/shop/token-to-token', postJSON_1.createPostJSON.shop.tokenToToken(data, privKey), { params: ramda_1.pick(['gameAddr'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        })
    },
    trade: {
        offerPrivate: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/trades/offer-private', postJSON_1.createPostJSON.trade.offerPrivate(data, privKey), { params: ramda_1.pick(['gameAddr'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        offerPublic: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/trades/offer-public', postJSON_1.createPostJSON.trade.offerPublic(data, privKey), { params: ramda_1.pick(['gameAddr'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        remove: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/trades/remove', postJSON_1.createPostJSON.trade.remove(data, privKey), { params: ramda_1.pick(['gameAddr', 'index'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        takePrivate: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/trades/take-private', postJSON_1.createPostJSON.trade.takePrivate(data, privKey), { params: ramda_1.pick(['gameAddr', 'index'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        }),
        takePublic: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/trades/take-public', postJSON_1.createPostJSON.trade.takePublic(data, privKey), { params: ramda_1.pick(['gameAddr', 'index'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        })
    },
    user: {
        generate: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/user/generate', postJSON_1.createPostJSON.user.generate(data, privKey), { params: ramda_1.pick(['gameAddr'], data) });
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.data.txId}&blocking=true`);
        })
    }
});
const makeGetters = (wrapperIn) => ({
    token: {
        getAllTokensOf: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/allTokensOf', { params }); }),
        getTokensOf: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tokensOf', { params }); }),
        getDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tokens', { params }); }),
        getAll: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tokens', { params }); }),
        getOne: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tokens', { params }); })
    },
    box: {
        getDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/boxes', { params }); }),
        getAll: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/boxes', { params }); }),
        getOne: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/boxes', { params }); })
    },
    game: {
        getBalanceOf: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/games/balance', { params }); }),
        getDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/games', { params }); }),
        getAll: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/games', { params }); }),
        getOne: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/games', { params }); })
    },
    loan: {
        getCreatedCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/loans/created-loans-count', { params }); }),
        getDeletedCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/loans/deleted-loans-count', { params }); }),
        getFreeBalanceOf: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/loans/free-balance-of', { params }); }),
        getLoanedBalanceOf: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/loans/loaned-balance-of', { params }); }),
        getSpecific: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/loans', { params }); })
    },
    shop: {
        getOrderCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/order-count', { params }); }),
        getUserOrderCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/user-order-count', { params }); }),
        getSpecific: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/orders', { params }); }),
        getUserOrderCountInGame: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/orders/count', { params }); }),
        getUserOrderDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/game-orders', { params }); }),
        getAllUserOrders: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/game-orders', { params }); }),
        getOneUserOrder: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/game-orders', { params }); })
    },
    trade: {
        getAll: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades', { params }); }),
        getGameClosedCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/closed-count', { params }); }),
        getGameDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game', { params }); }),
        getGameTrade: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game', { params }); }),
        getGameTrades: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game', { params }); }),
        getGameOpenCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/open-count', { params }); }),
        getUserTradeCountDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user/count', { params }); }),
        getUserTradeCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user/count', { params }); }),
        getUserTradeCountInGame: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user/count', { params }); }),
        getUserTradeIds: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/user/all-trade-ids', { params }); }),
        getUserTradeIdsInGame: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user/all-trade-ids', { params }); }),
        getUserTradeInGame: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user/id', { params }); }),
        getUserTrades: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/user', { params }); }),
        getUserTradesInGame: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user', { params }); })
    },
    tx: {
        getStatus: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tx/status', { params }); }),
        getData: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tx/return-data', { params }); })
    }
});
exports.stardustAPI = (baseURL) => {
    const wrapperIn = wrapper(baseURL);
    const getters = makeGetters(wrapperIn);
    const setters = makeSetters(wrapperIn);
    return { setters, getters };
};
//# sourceMappingURL=full.js.map