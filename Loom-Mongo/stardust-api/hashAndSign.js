"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stardust_1 = require("./stardust");
const hash_1 = require("./hash");
exports.hashAndSign = {
    token: {
        add: (data, privKey) => stardust_1.sign(hash_1.hash.token.add(data), privKey),
        mint: (data, privKey) => stardust_1.sign(hash_1.hash.token.mint(data), privKey),
        transfer: (data, privKey) => stardust_1.sign(hash_1.hash.token.transfer(data), privKey),
        burn: (data, privKey) => stardust_1.sign(hash_1.hash.token.burn(data), privKey)
    },
    box: {
        add: (data, privKey) => stardust_1.sign(hash_1.hash.box.add(data), privKey),
        buy: (data, privKey) => stardust_1.sign(hash_1.hash.box.buy(data), privKey),
        remove: (data, privKey) => stardust_1.sign(hash_1.hash.box.remove(data), privKey),
        update: (data, privKey) => stardust_1.sign(hash_1.hash.box.update(data), privKey)
    },
    game: {
        deploy: (data, privKey) => stardust_1.sign(hash_1.hash.game.deploy(data), privKey),
        transfer: (data, privKey) => stardust_1.sign(hash_1.hash.game.transfer(data), privKey)
    },
    loan: {
        finish: (data, privKey) => stardust_1.sign(hash_1.hash.loan.finish(data), privKey),
        handlePrivate: (data, privKey) => stardust_1.sign(hash_1.hash.loan.handlePrivate(data), privKey),
        handlePublic: (data, privKey) => stardust_1.sign(hash_1.hash.loan.handlePublic(data), privKey),
        offerPrivate: (data, privKey) => stardust_1.sign(hash_1.hash.loan.offerPrivate(data), privKey),
        offerPublic: (data, privKey) => stardust_1.sign(hash_1.hash.loan.offerPublic(data), privKey)
    },
    shop: {
        cashToToken: (data, privKey) => stardust_1.sign(hash_1.hash.shop.cashToToken(data), privKey),
        tokenToCash: (data, privKey) => stardust_1.sign(hash_1.hash.shop.tokenToCash(data), privKey),
        tokenToToken: (data, privKey) => stardust_1.sign(hash_1.hash.shop.tokenToToken(data), privKey)
    },
    trade: {
        offerPrivate: (data, privKey) => stardust_1.sign(hash_1.hash.trade.offerPrivate(data), privKey),
        offerPublic: (data, privKey) => stardust_1.sign(hash_1.hash.trade.offerPublic(data), privKey),
        remove: (data, privKey) => stardust_1.sign(hash_1.hash.trade.remove(data), privKey),
        takePrivate: (data, privKey) => stardust_1.sign(hash_1.hash.trade.takePrivate(data), privKey),
        takePublic: (data, privKey) => stardust_1.sign(hash_1.hash.trade.takePublic(data), privKey)
    },
    user: {
        generate: (data, privKey) => stardust_1.sign(hash_1.hash.user.generate(data), privKey)
    }
};
//# sourceMappingURL=hashAndSign.js.map