"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hashAndSign_1 = require("./hashAndSign");
exports.createPostJSON = {
    token: {
        add: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.token.add(data, privKey) })),
        mint: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.token.mint(data, privKey) })),
        transfer: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.token.transfer(data, privKey) })),
        burn: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.token.burn(data, privKey) }))
    },
    box: {
        add: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.box.add(data, privKey) })),
        buy: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.box.buy(data, privKey) })),
        remove: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.box.remove(data, privKey) })),
        update: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.box.update(data, privKey) }))
    },
    game: {
        deploy: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.game.deploy(data, privKey) })),
        transfer: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.game.transfer(data, privKey) }))
    },
    loan: {
        finish: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.loan.finish(data, privKey) })),
        handlePrivate: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.loan.handlePrivate(data, privKey) })),
        handlePublic: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.loan.handlePublic(data, privKey) })),
        offerPrivate: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.loan.offerPrivate(data, privKey) })),
        offerPublic: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.loan.offerPublic(data, privKey) }))
    },
    shop: {
        cashToToken: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.shop.cashToToken(data, privKey) })),
        tokenToCash: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.shop.tokenToCash(data, privKey) })),
        tokenToToken: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.shop.tokenToToken(data, privKey) }))
    },
    trade: {
        offerPrivate: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.trade.offerPrivate(data, privKey) })),
        offerPublic: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.trade.offerPublic(data, privKey) })),
        remove: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.trade.remove(data, privKey) })),
        takePrivate: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.trade.takePrivate(data, privKey) })),
        takePublic: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.trade.takePublic(data, privKey) }))
    },
    user: {
        generate: (data, privKey) => (Object.assign({}, data, { signedMessage: hashAndSign_1.hashAndSign.user.generate(data, privKey) }))
    }
};
//# sourceMappingURL=postJSON.js.map