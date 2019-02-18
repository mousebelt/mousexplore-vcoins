"use strict";
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
/*************************************************************\
 *                                                           *
 *        THIS FILE WAS AUTOMATICALLY GENERATED              *
 *      ANY CHANGES TO THIS FILE WILL BE REVERTED            *
 *                                                           *
\*************************************************************/
const axios_1 = __importDefault(require("axios"));
const ramda_1 = require("ramda");
const postJSON_1 = require("../postJSON");
const v = 'v1';
const wrapper = (baseURL = `http://api.sandbox.stardust.com/${v}`) => axios_1.default.create({
    baseURL,
    timeout: 25000,
    headers: { 'Content-Type': 'application/json' }
});
const dataOnly = (res) => res.data;
const makeSetters = (wrapperIn) => ({
    token: {
        add: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/tokens', postJSON_1.createPostJSON.token.add(data, privKey), { params: ramda_1.pick(['gameAddr'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        mint: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/tokens/mint', postJSON_1.createPostJSON.token.mint(data, privKey), { params: ramda_1.pick(['gameAddr', 'tokenId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        transfer: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/tokens/transfer', postJSON_1.createPostJSON.token.transfer(data, privKey), { params: ramda_1.pick(['gameAddr', 'tokenId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        burn: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/tokens/burn', postJSON_1.createPostJSON.token.burn(data, privKey), { params: ramda_1.pick(['gameAddr', 'tokenId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        })
    },
    box: {
        add: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/boxes', postJSON_1.createPostJSON.box.add(data, privKey), { params: ramda_1.pick(['gameAddr'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        buy: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/boxes/buy', postJSON_1.createPostJSON.box.buy(data, privKey), { params: ramda_1.pick(['gameAddr', 'boxId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        remove: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/boxes/delete', postJSON_1.createPostJSON.box.remove(data, privKey), { params: ramda_1.pick(['gameAddr', 'boxId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        update: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/boxes/update', postJSON_1.createPostJSON.box.update(data, privKey), { params: ramda_1.pick(['gameAddr', 'boxId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        })
    },
    game: {
        deploy: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/games', postJSON_1.createPostJSON.game.deploy(data, privKey), { params: ramda_1.pick([], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        transfer: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/games/transfer', postJSON_1.createPostJSON.game.transfer(data, privKey), { params: ramda_1.pick(['gameAddr'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        })
    },
    loan: {
        finish: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/loans/finish', postJSON_1.createPostJSON.loan.finish(data, privKey), { params: ramda_1.pick(['gameAddr', 'loanId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        handlePrivate: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/loans/handle-private', postJSON_1.createPostJSON.loan.handlePrivate(data, privKey), { params: ramda_1.pick(['gameAddr', 'loanId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        handlePublic: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/loans/handle-public', postJSON_1.createPostJSON.loan.handlePublic(data, privKey), { params: ramda_1.pick(['gameAddr', 'loanId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        offerPrivate: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/loans/offer-private', postJSON_1.createPostJSON.loan.offerPrivate(data, privKey), { params: ramda_1.pick(['gameAddr', 'tokenId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        offerPublic: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/loans/offer-public', postJSON_1.createPostJSON.loan.offerPublic(data, privKey), { params: ramda_1.pick(['gameAddr', 'tokenId'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        })
    },
    shop: {
        cashToToken: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/shop/cash-to-token', postJSON_1.createPostJSON.shop.cashToToken(data, privKey), { params: ramda_1.pick(['gameAddr'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        tokenToCash: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/shop/token-to-cash', postJSON_1.createPostJSON.shop.tokenToCash(data, privKey), { params: ramda_1.pick(['gameAddr'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        tokenToToken: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/shop/token-to-token', postJSON_1.createPostJSON.shop.tokenToToken(data, privKey), { params: ramda_1.pick(['gameAddr'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        })
    },
    trade: {
        offerPrivate: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/trades/offer-private', postJSON_1.createPostJSON.trade.offerPrivate(data, privKey), { params: ramda_1.pick(['gameAddr'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        offerPublic: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/trades/offer-public', postJSON_1.createPostJSON.trade.offerPublic(data, privKey), { params: ramda_1.pick(['gameAddr'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        remove: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/trades/remove', postJSON_1.createPostJSON.trade.remove(data, privKey), { params: ramda_1.pick(['gameAddr', 'index'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        takePrivate: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/trades/take-private', postJSON_1.createPostJSON.trade.takePrivate(data, privKey), { params: ramda_1.pick(['gameAddr', 'index'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        }),
        takePublic: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/trades/take-public', postJSON_1.createPostJSON.trade.takePublic(data, privKey), { params: ramda_1.pick(['gameAddr', 'index'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        })
    },
    user: {
        generate: (data, privKey) => __awaiter(this, void 0, void 0, function* () {
            const returnVal = yield wrapperIn.post('/user/generate', postJSON_1.createPostJSON.user.generate(data, privKey), { params: ramda_1.pick(['gameAddr'], data) }).then(dataOnly);
            return wrapperIn.get(`/tx/return-data?txId=${returnVal.txId}&blocking=true`).then(dataOnly);
        })
    }
});
const makeGetters = (wrapperIn) => ({
    token: {
        getAllTokensOf: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/allTokensOf', { params }).then(dataOnly); }),
        getTokensOf: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tokensOf', { params }).then(dataOnly); }),
        getDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tokens', { params }).then(dataOnly); }),
        getAll: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tokens', { params }).then(dataOnly); }),
        getOne: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tokens', { params }).then(dataOnly); })
    },
    box: {
        getDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/boxes', { params }).then(dataOnly); }),
        getAll: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/boxes', { params }).then(dataOnly); }),
        getOne: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/boxes', { params }).then(dataOnly); })
    },
    game: {
        getBalanceOf: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/games/balance', { params }).then(dataOnly); }),
        getDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/games', { params }).then(dataOnly); }),
        getAll: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/games', { params }).then(dataOnly); }),
        getOne: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/games', { params }).then(dataOnly); })
    },
    loan: {
        getCreatedCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/loans/created-loans-count', { params }).then(dataOnly); }),
        getDeletedCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/loans/deleted-loans-count', { params }).then(dataOnly); }),
        getFreeBalanceOf: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/loans/free-balance-of', { params }).then(dataOnly); }),
        getLoanedBalanceOf: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/loans/loaned-balance-of', { params }).then(dataOnly); }),
        getSpecific: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/loans', { params }).then(dataOnly); })
    },
    shop: {
        getOrderCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/order-count', { params }).then(dataOnly); }),
        getUserOrderCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/user-order-count', { params }).then(dataOnly); }),
        getSpecific: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/orders', { params }).then(dataOnly); }),
        getUserOrderCountInGame: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/orders/count', { params }).then(dataOnly); }),
        getUserOrderDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/game-orders', { params }).then(dataOnly); }),
        getAllUserOrders: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/game-orders', { params }).then(dataOnly); }),
        getOneUserOrder: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/shop/game-orders', { params }).then(dataOnly); })
    },
    trade: {
        getAll: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades', { params }).then(dataOnly); }),
        getGameClosedCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/closed-count', { params }).then(dataOnly); }),
        getGameDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game', { params }).then(dataOnly); }),
        getGameTrade: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game', { params }).then(dataOnly); }),
        getGameTrades: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game', { params }).then(dataOnly); }),
        getGameOpenCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/open-count', { params }).then(dataOnly); }),
        getUserTradeCountDetails: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user/count', { params }).then(dataOnly); }),
        getUserTradeCount: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user/count', { params }).then(dataOnly); }),
        getUserTradeCountInGame: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user/count', { params }).then(dataOnly); }),
        getUserTradeIds: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/user/all-trade-ids', { params }).then(dataOnly); }),
        getUserTradeIdsInGame: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user/all-trade-ids', { params }).then(dataOnly); }),
        getUserTradeInGame: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user/id', { params }).then(dataOnly); }),
        getUserTrades: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/user', { params }).then(dataOnly); }),
        getUserTradesInGame: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/trades/game/user', { params }).then(dataOnly); })
    },
    tx: {
        getStatus: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tx/status', { params }).then(dataOnly); }),
        getData: (params) => __awaiter(this, void 0, void 0, function* () { return wrapperIn.get('/tx/return-data', { params }).then(dataOnly); })
    }
});
exports.stardustAPI = (baseURL) => {
    const wrapperIn = wrapper(baseURL);
    const getters = makeGetters(wrapperIn);
    const setters = makeSetters(wrapperIn);
    return { setters, getters };
};
//# sourceMappingURL=data-only.js.map