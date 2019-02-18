"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
exports.__esModule = true;
var paramType = __importStar(require("../data/paramtype.json"));
var paramTypes = __importStar(require("../data/paramtypes.json"));
var routesObj = __importStar(require("../data/routes.json"));
var axios_1 = __importDefault(require("axios"));
var ramda_1 = require("ramda");
var web3_1 = __importDefault(require("web3"));
var web3 = new web3_1["default"]();
// ! const invParamTypes = invertObj(paramType);
var objMap = function (obj, f) { return Object.assign.apply(Object, [{}].concat(Object.entries(obj).map(function (_a) {
    var k = _a[0], val = _a[1];
    var _b;
    return (_b = {}, _b[k] = f(val), _b);
}))); };
var secondLevelMap = function (obj, f) { return objMap(obj, function (a) { return objMap(a, f); }); };
var sigToString = function (sig) { return sig.signature + sig.message.slice(2); };
var signRaw = function (msg, privKey) { return web3.eth.accounts.sign(msg, privKey); };
exports.createRawWallet = function () { return web3.eth.accounts.create(); };
exports.createWallet = function () {
    var _a = exports.createRawWallet(), address = _a.address, privateKey = _a.privateKey;
    return [address, privateKey];
};
var sign = function (msg, privKey) { return sigToString(signRaw(msg, privKey)); };
var hashParam = function (value, type) { return web3.utils.soliditySha3(web3.eth.abi.encodeParameter(type, value)); };
var hashParams = function (values, types) { return values.map(function (value, index) { return hashParam(value, types[index]); }); };
var combineHashes = function (hashes) { return hashParam(hashes, 'bytes32[]'); };
// ! const getParamType  = (y: keyof typeof invParamTypes) => ({[y]: invParamTypes[y] as solidityParam});
var getParamType = function (y) {
    var _a;
    return (_a = {}, _a[y] = Object.keys(paramType).filter(function (k) { return k !== 'default' && paramType[k].includes(y); })[0], _a);
};
var hashMany = function (key1, key2) { return function (values) {
    var paramTypeArray = paramTypes[key1][key2].map(getParamType);
    var valuesArr = paramTypeArray.map(function (param) { return values[Object.keys(param)[0]]; });
    var types = paramTypeArray.map(function (param) { return Object.values(param)[0]; });
    return combineHashes(hashParams(valuesArr, types));
}; };
var combine = function () { return function (pathsMapped) { return pathsMapped.reduce(function (prev, _a) {
    var key1 = _a.key1, key2 = _a.key2, func = _a.func;
    var _b, _c;
    var toAdd = ((key1 in prev) ? prev[key1] : {});
    return __assign({}, prev, (_b = {}, _b[key1] = __assign({}, toAdd, (_c = {}, _c[key2] = func, _c)), _b));
}, {}); }; };
var createHashAndSign = function (f) { return function (data, privKey) { return sign(f(data), privKey); }; };
var createPostJSONF = function (f) { return function (data, privKey) { return (__assign({}, data, { signedMessage: sign(f(data), privKey) })); }; };
var paths = function (obj) { return Object.entries(obj).map(function (_a) {
    var key1 = _a[0], val = _a[1];
    return Object.keys(val).map(function (key2) { return ({ key1: key1, key2: key2 }); });
}).reduce(function (prev, curr) { return prev.concat(curr); }, []); };
var pathsMap = function (obj, f) { return paths(obj).map(function (_a) {
    var key1 = _a.key1, key2 = _a.key2;
    return ({ key1: key1, key2: key2, func: f(key1, key2) });
}); };
// ! ------------------------------------------------------
var v = 'v1';
var wrapper = function (baseURL) {
    if (baseURL === void 0) { baseURL = "http://api.sandbox.stardust.com/" + v; }
    return axios_1["default"].create({
        baseURL: baseURL,
        timeout: 25000,
        headers: { 'Content-Type': 'application/json' }
    });
};
exports.hash = combine()(pathsMap(routesObj.setters, hashMany));
exports.hashAndSign = secondLevelMap(exports.hash, createHashAndSign);
exports.createPostJSON = secondLevelMap(exports.hash, createPostJSONF);
var pluck = function (obj, names) { return ramda_1.fromPairs(Object.entries(obj).filter(function (_a) {
    var key = _a[0];
    return names.includes(key);
})); };
var createPost = function (baseURL) { return function (key1, key2) { return function (data, privKey, dataOnly) {
    if (dataOnly === void 0) { dataOnly = true; }
    return __awaiter(_this, void 0, void 0, function () {
        var _a, routes, paramKeys, postJSON, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = routesObj.setters[key1][key2], routes = _a.routes, paramKeys = _a.paramKeys;
                    postJSON = exports.createPostJSON[key1][key2];
                    return [4 /*yield*/, wrapper(baseURL).post(routes[0], postJSON(data, privKey), { params: pluck(data, paramKeys) })];
                case 1:
                    res = _b.sent();
                    return [2 /*return*/, dataOnly ? res.data : res];
            }
        });
    });
}; }; };
var createGet = function (baseURL) { return function (key1, key2) { return function (params, dataOnly) {
    if (dataOnly === void 0) { dataOnly = true; }
    return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wrapper(baseURL).get(routesObj.getters[key1][key2][0], { params: params })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, dataOnly ? res.data : res];
            }
        });
    });
}; }; };
exports.stardustAPI = function (baseURL) {
    var getters = combine()(pathsMap(routesObj.getters, createGet(baseURL)));
    var setters = combine()(pathsMap(routesObj.setters, createPost(baseURL)));
    return { setters: setters, getters: getters };
};
