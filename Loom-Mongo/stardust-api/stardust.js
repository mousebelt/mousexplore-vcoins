"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const web3_1 = __importDefault(require("web3"));
exports.web3 = new web3_1.default();
exports.getSigner = (sig) => {
    const sigIn = typeof sig === 'string' ? sig : sig.signedMessage;
    try {
        return exports.web3.eth.accounts.recover(`0x${sigIn.slice(132)}`, `0x${sigIn.slice(130, 132)}`, `0x${sigIn.slice(2, 66)}`, `0x${sigIn.slice(66, 130)}`);
    }
    catch (err) {
        return '0x0000000000000000000000000000000000000000';
    }
};
const sigToString = (sig) => sig.signature + sig.message.slice(2);
exports.toCheckSumAddr = (address) => exports.web3.utils.toChecksumAddress(address);
const signRaw = (msg, privKey) => exports.web3.eth.accounts.sign(msg, privKey);
exports.createRawWallet = () => exports.web3.eth.accounts.create();
exports.createWallet = () => {
    const { address, privateKey } = exports.web3.eth.accounts.create();
    return [address, privateKey];
};
exports.sign = (msg, privKey) => sigToString(signRaw(msg, privKey));
exports.hashParam = (value, type) => exports.web3.utils.soliditySha3(exports.web3.eth.abi.encodeParameter(type, value));
bignumber_js_1.BigNumber.config({ EXPONENTIAL_AT: 300 });
const BN = (x) => new bignumber_js_1.BigNumber(x);
const tsExtraShift = BN(2).pow(120);
const unitShift = BN(2).pow(248);
exports.packTS = ({ timestamp, unitIn }) => {
    const tsBN = typeof timestamp === 'number' ? BN(timestamp) : timestamp;
    const unitInBN = typeof unitIn === 'number' ? BN(unitIn) : unitIn;
    const ts = tsBN.shiftedBy(-unitInBN.toNumber()).integerValue(bignumber_js_1.BigNumber.ROUND_DOWN);
    const tsExtraShifted = tsBN.modulo(BN(10).pow(unitIn)).multipliedBy(tsExtraShift);
    const unitShifted = unitInBN.multipliedBy(unitShift);
    return ts.plus(tsExtraShifted).plus(unitShifted).toString();
};
exports.unpackTS = (data) => {
    const dataBN = BN(data);
    const unit = dataBN.dividedBy(unitShift).integerValue();
    const tsExtra = dataBN.minus(unit.multipliedBy(unitShift)).dividedBy(tsExtraShift).integerValue();
    const ts = dataBN.minus(unit.multipliedBy(unitShift)).minus(tsExtra.multipliedBy(tsExtraShift));
    return { unit, tsExtra, ts };
};
exports.scaleUp = (rarityPercs) => {
    const smallestFraction = Math.max(...rarityPercs.map((z) => new bignumber_js_1.BigNumber(z).decimalPlaces()));
    const scaleFactor = new bignumber_js_1.BigNumber(10).pow(smallestFraction);
    const scaledUp = rarityPercs.map((z) => new bignumber_js_1.BigNumber(z).multipliedBy(scaleFactor)).map(String);
    return [scaledUp, smallestFraction];
};
var data_only_1 = require("./api/data-only");
exports.stardustAPI = data_only_1.stardustAPI;
var postJSON_1 = require("./postJSON");
exports.createPostJSON = postJSON_1.createPostJSON;
//# sourceMappingURL=stardust.js.map