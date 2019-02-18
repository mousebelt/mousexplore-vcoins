import { AxiosPromise } from 'axios';
import { Response } from 'express';
export declare type valueof<T> = T[keyof T];
export declare type rarityType = 1 | 2 | 3 | 4 | 5;
type solidityParamSingle = 'bytes32' | 'uint256' | 'address' | 'string' | 'bytes' | 'bool';
type solidityParamArray = 'bytes32[]' | 'uint256[]' | 'address[]' | 'string[]';
export declare type solidityParam = solidityParamArray | solidityParamSingle;
export declare type solidityValue = number | string | boolean | ReadonlyArray<number> | ReadonlyArray<string> | ReadonlyArray<boolean>;
export declare type maybePromise<T> = Promise<T> | T;
export declare type maybePromisedProps<T> = {
    [P in keyof T]: maybePromise<T[P]>;
};
export declare type logLevel = 'silly' | 'debug' | 'verbose' | 'info' | 'warn' | 'error';
export interface JOICheck<T = any> {
    readonly valid: boolean;
    readonly value: T;
}
interface baseData {
    readonly gameAddr: addr;
}
interface timed {
    readonly timestamp: number;
}
interface Meta extends Readonly<{
    name: string;
    desc: string;
    image: string;
}> {
}
export interface Wallet {
    readonly address: addr;
    readonly privateKey: string;
}
export declare type Signed<T> = T & {
    readonly signedMessage: string;
};
export declare type BulkSigned<T> = T & {
    readonly signedMessages: string[];
};
export declare namespace API {
    type Endpoint<T> = (data: T, res: Response) => Promise<void>;
    interface S {
        token: {
            add: Token.deployDataSigned;
            mint: Token.mintDataSigned;
            transfer: Token.transferDataSigned;
            burn: Token.burnDataSigned;
        };
        box: {
            add: Box.deployDataSigned;
            buy: Box.buyDataSigned;
            remove: Box.removeDataSigned;
            update: Box.updateDataSigned;
        };
        game: {
            deploy: Game.deployDataSigned;
            transfer: Game.transferDataSigned;
        };
        loan: {
            finish: Loan.finishDataSigned;
            handlePrivate: Loan.handlePrivateDataSigned;
            handlePublic: Loan.handlePrivateDataSigned;
            offerPrivate: Loan.offerPrivateDataSigned;
            offerPublic: Loan.offerPublicDataSigned;
        };
        shop: {
            cashToToken: Shop.cashToTokenDataSigned;
            tokenToCash: Shop.tokenToCashDataSigned;
            tokenToToken: Shop.tokenToTokenDataSigned;
        };
        trade: {
            offerPrivate: Trade.offerPrivateDataSigned;
            offerPublic: Trade.offerPublicDataSigned;
            remove: Trade.removeTradeDataSigned;
            takePrivate: Trade.takePrivateDataSigned;
            takePublic: Trade.takePublicDataSigned;
        };
        user: {
            generate: {
                gameAddr: string;
            };
        };
    }
    type Setter<K1 extends keyof S, K2 extends keyof S[K1]> = Endpoint<S[K1][K2]>;
    interface G {
        token: {
            getAll: {
                gameAddr: addr;
            };
            getOne: {
                gameAddr: addr;
                tokenId: number;
            };
            getDetails: {
                gameAddr: addr;
                tokenId?: number;
            };
            getTokensOf: {
                gameAddr: addr;
                userAddr: addr;
            };
            getAllTokensOf: {
                userAddr: addr;
            };
        };
        box: {
            getOne: {
                gameAddr: addr;
                boxId: number;
            };
            getAll: {
                gameAddr: addr;
            };
            getDetails: {
                gameAddr: addr;
                boxId?: number;
            };
        };
        game: {
            getAll: {};
            getOne: {
                gameAddr: addr;
            };
            getBalanceOf: {
                gameAddr: addr;
                userAddr: addr;
            };
            getDetails: {
                gameAddr?: addr;
            };
        };
        loan: {
            getCreatedCount: {
                gameAddr: addr;
            };
            getDeletedCount: {
                gameAddr: addr;
            };
            getSpecific: {
                gameAddr: addr;
                loanId: number;
            };
            getLoanedBalanceOf: {
                gameAddr: addr;
                userAddr: addr;
                tokenId: number;
            };
            getFreeBalanceOf: {
                gameAddr: addr;
                userAddr: addr;
                tokenId: number;
            };
        };
        shop: {
            getOrderCount: {
                gameAddr: addr;
            };
            getUserOrderCount: {
                userAddr: addr;
            };
            getUserOrderCountInGame: {
                gameAddr: addr;
                userAddr: addr;
            };
            getSpecific: {
                gameAddr: addr;
                orderId: number;
            };
            getOneUserOrder: {
                gameAddr: addr;
                userAddr: addr;
                orderId: number;
            };
            getAllUserOrders: {
                gameAddr: addr;
                userAddr: addr;
            };
            getUserOrderDetails: {
                gameAddr: addr;
                userAddr: addr;
                orderId?: number;
            };
        };
        trade: {
            getAll: {};
            getGameOpenCount: {
                gameAddr: addr;
            };
            getGameClosedCount: {
                gameAddr: addr;
            };
            getGameTrade: {
                gameAddr: addr;
                index: number;
            };
            getGameTrades: {
                gameAddr: addr;
            };
            getGameDetails: {
                gameAddr: addr;
                index?: number;
            };
            getUserTradeCount: {
                userAddr: addr;
            };
            getUserTradeCountInGame: {
                gameAddr: addr;
                userAddr: addr;
            };
            getUserTradeCountDetails: {
                gameAddr?: addr;
                userAddr: addr;
            };
            getUserTradeIds: {
                userAddr: addr;
            };
            getUserTradeIdsInGame: {
                gameAddr: addr;
                userAddr: addr;
            };
            getUserTradeInGame: {
                gameAddr: addr;
                userAddr: addr;
                index: number;
            };
            getUserTradesInGame: {
                gameAddr: addr;
                userAddr: addr;
            };
            getUserTrades: {
                userAddr: addr;
            };
        };
        tx: {
            getStatus: {
                txId: string;
                blocking?: boolean;
            };
            getData: {
                txId: string;
                blocking?: boolean;
            };
        };
    }
    type Getter<K1 extends keyof G, K2 extends keyof G[K1]> = Endpoint<G[K1][K2]>;
    interface baseErrorsObj {
        readonly timestamp?: string;
        readonly signer?: string;
        readonly hash?: string;
        readonly rarity_cap?: string;
        readonly tokens?: string;
    }
}
export declare namespace IPFSMeta {
    type TokenData = Meta & Readonly<{
        tokenId: number;
        rarity: number;
        cap: number;
    }>;
    type BoxData = Meta & Readonly<{
        boxId: number;
    }>;
    type GameData = Meta & baseData & Readonly<{
        symbol: string;
        rarityNames: ReadonlyArray<string>;
    }>;
    type GameDataFile = Readonly<{
        game: GameData;
        tokens: ReadonlyArray<TokenData>;
        boxes: ReadonlyArray<BoxData>;
    }>;
}
export declare namespace Token {
    interface metaData extends baseData, Meta, Readonly<{
        tokenId: number;
        rarity: number;
        cap: number;
        val: number;
        owners: ReadonlyArray<addr>;
        totalSupply: number;
    }> {
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface deployData extends baseData, timed, Meta, Readonly<{
        cap: number;
        rarity: number;
        val: number;
    }> {
    }
    interface deployDataContract extends baseData, timed, Readonly<{
        cap: number;
        rarity: number;
        val: number;
    }> {
    }
    interface deployDataSigned extends Signed<deployData> {
    }
    interface mintData extends baseData, timed, Readonly<{
        tokenId: number;
        to: addr;
        amount: number;
    }> {
    }
    interface mintDataSigned extends Signed<mintData> {
    }
    interface transferData extends baseData, timed, Readonly<{
        from: addr;
        to: addr;
        amount: number;
        tokenId: number;
    }> {
    }
    interface transferDataSigned extends Signed<transferData> {
    }
    interface burnData extends baseData {
        readonly from: addr;
        readonly amount: number;
        readonly timestamp: number;
        readonly tokenId: number;
        readonly gameAddr: addr;
    }
    interface burnDataSigned extends Signed<burnData> {
    }
}
export declare namespace Box {
    interface metaData extends baseData, Meta, Readonly<{
        boxId: number;
        isValid: boolean;
        tokens: ReadonlyArray<number>;
    }> {
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface deployDataContract extends baseData, timed {
        readonly tokens: number[];
    }
    interface deployData extends Meta, deployDataContract {
    }
    interface deployDataSigned extends Signed<deployData> {
    }
    interface removeData extends baseData, timed {
        readonly boxId: number;
    }
    interface removeDataSigned extends Signed<removeData> {
    }
    interface updateData extends baseData, timed, Meta, Readonly<{
        boxId: number;
        isValid: boolean;
        tokens: number[];
    }> {
    }
    interface updateDataContract extends baseData, timed, Readonly<{
        boxId: number;
        isValid: boolean;
        tokens: number[];
    }> {
    }
    interface updateDataSigned extends Signed<updateData> {
    }
    interface buyData extends baseData, timed {
        readonly boxId: number;
    }
    interface buyDataSigned extends Signed<buyData> {
    }
}
export declare namespace Game {
    interface metaData extends baseData, Meta, Readonly<{
        gameOwner: addr;
        rarityNames: ReadonlyArray<string>;
        rarityPercs: ReadonlyArray<number>;
        symbol: string;
        totalSupply: number;
    }> {
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface deployData extends timed, Readonly<{
        name: string;
        symbol: string;
        desc: string;
        image: string;
        owner: addr;
        rarityPercs: ReadonlyArray<number>;
        rarityNames: ReadonlyArray<string>;
    }> {
    }
    interface deployDataSigned extends Signed<deployData> {
    }
    interface transferData extends baseData {
        readonly from: addr;
        readonly to: addr;
        timestamp: number;
    }
    interface transferDataSigned extends Signed<transferData> {
    }
}
export declare namespace Loan {
    interface metaData extends baseData, Readonly<{
        loanId: number;
        isActive: boolean;
        lender: addr;
        borrower: addr;
        tokenId: number;
        amount: number;
        start: number;
        length: number;
    }> {
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface metaDataArray extends baseData, Readonly<{
        isActive: ReadonlyArray<boolean>;
        lender: ReadonlyArray<addr>;
        borrower: ReadonlyArray<addr>;
        tokenId: ReadonlyArray<number>;
        amount: ReadonlyArray<number>;
        start: ReadonlyArray<number>;
        length: ReadonlyArray<number>;
    }> {
    }
    interface offerPrivateData extends baseData {
        readonly lender: addr;
        readonly borrower: addr;
        readonly tokenId: number;
        readonly amount: number;
        readonly length: number;
        timestamp: number;
    }
    interface offerPrivateDataSigned extends Signed<offerPrivateData> {
    }
    interface offerPublicData extends baseData, timed, Readonly<{
        lender: addr;
        tokenId: number;
        amount: number;
        length: number;
    }> {
    }
    interface offerPublicDataSigned extends Signed<offerPublicData> {
    }
    interface handlePublicData extends baseData, timed, Readonly<{
        loanId: number;
    }> {
    }
    interface handlePublicDataSigned extends Signed<handlePublicData> {
    }
    interface handlePrivateData extends baseData, timed, Readonly<{
        loanId: number;
        decision: boolean;
    }> {
    }
    interface handlePrivateDataSigned extends Signed<handlePrivateData> {
    }
    interface finishData extends baseData, timed {
        readonly loanId: number;
    }
    interface finishDataSigned extends Signed<finishData> {
    }
}
export declare namespace Shop {
    interface metaData extends baseData, Readonly<{
        id: number;
        tokenId: number;
        amount: number;
        created: number;
        gameAddr: addr;
        caller: addr;
    }> {
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface metaDataArray extends Readonly<{
        ids: number[];
        tokenIds: number[];
        amounts: number[];
        createds: number[];
        gameAddrs: addr[];
        callers: addr[];
    }> {
    }
    interface tokenToCashData extends baseData, timed, Readonly<{
        tokenId: number;
        amount: number;
    }> {
    }
    interface tokenToCashDataSigned extends Signed<tokenToCashData> {
    }
    interface cashToTokenData extends baseData, timed, Readonly<{
        tokenId: number;
        amount: number;
    }> {
    }
    interface cashToTokenDataSigned extends Signed<cashToTokenData> {
    }
    interface tokenToTokenData extends baseData, timed, Readonly<{
        fromId: number;
        fromAmount: number;
        toId: number;
        toAmount: number;
    }> {
    }
    interface tokenToTokenDataSigned extends Signed<tokenToTokenData> {
    }
}
export declare namespace Trade {
    interface metaData extends baseData, Readonly<{
        taker: addr;
        trader: addr;
        offeredId: number;
        offeredAmount: number;
        wantedId: number;
        wantedAmount: number;
        createdOn: number;
        state: number;
    }> {
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface metaDataArray extends baseData, Readonly<{
        takers: addr[];
        traders: addr[];
        offeredIds: number[];
        offeredAmounts: number[];
        wantedIds: number[];
        wantedAmounts: number[];
        createdOns: number[];
        states: number[];
    }> {
    }
    interface offerPrivateData extends baseData, timed, Readonly<{
        taker: addr;
        offeredId: number;
        offeredAmount: number;
        wantedId: number;
        wantedAmount: number;
    }> {
    }
    interface offerPrivateDataSigned extends Signed<offerPrivateData> {
    }
    interface offerPublicData extends baseData, timed, Readonly<{
        offeredId: number;
        offeredAmount: number;
        wantedId: number;
        wantedAmount: number;
    }> {
    }
    interface offerPublicDataSigned extends Signed<offerPublicData> {
    }
    interface takePrivateData extends baseData, timed, Readonly<{
        index: number;
    }> {
    }
    interface takePrivateDataSigned extends Signed<takePrivateData> {
    }
    interface takePublicData extends baseData, timed, Readonly<{
        index: number;
    }> {
    }
    interface takePublicDataSigned extends Signed<takePublicData> {
    }
    interface removeTradeData extends baseData, timed, Readonly<{
        index: number;
    }> {
    }
    interface removeTradeDataSigned extends Signed<removeTradeData> {
    }
}
export declare namespace Wrapper {
    interface Setters {
        token: {
            add: Token.deployData;
            burn: Token.burnData;
            mint: Token.mintData;
            transfer: Token.transferData;
        };
        box: {
            add: Box.deployData;
            buy: Box.buyData;
            remove: Box.removeData;
            update: Box.updateData;
        };
        game: {
            deploy: Game.deployData;
            transfer: Game.transferData;
        };
        loan: {
            finish: Loan.finishData;
            handlePrivate: Loan.handlePrivateData;
            handlePublic: Loan.handlePublicData;
            offerPrivate: Loan.offerPrivateData;
            offerPublic: Loan.offerPublicData;
        };
        shop: {
            cashToToken: Shop.cashToTokenData;
            tokenToCash: Shop.tokenToCashData;
            tokenToToken: Shop.tokenToTokenData;
        };
        trade: {
            offerPrivate: Trade.offerPrivateData;
            offerPublic: Trade.offerPublicData;
            remove: Trade.removeTradeData;
            takePrivate: Trade.takePrivateData;
            takePublic: Trade.takePublicData;
        };
        user: {
            generate: {
                gameAddr: string;
            };
        };
    }
    type APICall<T> = <U = any>(data: T, privKey: str) => AxiosPromise<U>;
    type APICallGet<T> = <U = any>(params: T) => AxiosPromise<U>;
    type APICallGet2<T> = <U = any>(params: T) => U;
    type SetterMap = {
        [key in keyof Setters]: {
            [key2 in keyof Setters[key]]: APICall<Setters[key][key2]>;
        };
    };
    type GetterMap = {
        [key in keyof API.G]: {
            [key2 in keyof API.G[key]]: APICallGet<API.G[key][key2]>;
        };
    };
    type GetterMap2 = {
        [key in keyof API.G]: {
            [key2 in keyof API.G[key]]: APICallGet2<API.G[key][key2]>;
        };
    };
    type SetterOf<T> = {
        [key in keyof API.S]: {
            [key2 in keyof API.S[key]]: T;
        };
    };
    type hashFunc<T> = (data: T) => string;
    type hashAndSignFunc<T> = (data: T, privKey: string) => string;
    type postJSONFunc<T> = (data: T, privKey: string) => T & {
        signedMessage: string;
    };
    type HashObjType = {
        [key1 in keyof Setters]: {
            [key2 in keyof Setters[key1]]: hashFunc<Setters[key1][key2]>;
        };
    };
    type HashAndSignObjType = {
        [key1 in keyof Setters]: {
            [key2 in keyof Setters[key1]]: hashAndSignFunc<Setters[key1][key2]>;
        };
    };
    type PostJSONObjType = {
        [key1 in keyof Setters]: {
            [key2 in keyof Setters[key1]]: postJSONFunc<Setters[key1][key2]>;
        };
    };
}
export declare type num = number;
export declare type str = string;
export declare type addr = string;
declare type DataTypesOf<T extends keyof Wrapper.Setters> = valueof<Wrapper.Setters[T]>;
export declare type DataTypes = DataTypesOf<'game'> | DataTypesOf<'token'> | DataTypesOf<'shop'> | DataTypesOf<'box'> | DataTypesOf<'loan'> | DataTypesOf<'trade'>;
export {};
