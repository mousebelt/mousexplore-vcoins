import { AxiosPromise } from 'axios';
import { Request, Response } from 'express';
export declare type valueof<T> = T[keyof T];
export declare type rarityType = 1 | 2 | 3 | 4 | 5;
type solidityParamSingle = 'bytes32' | 'uint256' | 'address' | 'string' | 'bytes' | 'bool';
type solidityParamArray = 'bytes32[]' | 'uint256[]' | 'address[]' | 'string[]';
export declare type solidityParam = solidityParamArray | solidityParamSingle;
export declare type address = string;
export declare type base64 = string;
export declare type hexString = string;
export declare type signedMessage = hexString;
export declare type keccak256Hash = hexString;
export declare type solidityValue = number | string | boolean | ReadonlyArray<number> | ReadonlyArray<string> | ReadonlyArray<boolean>;
export declare type maybePromise<T> = Promise<T> | T;
export declare type maybePromisedProps<T> = {
    [P in keyof T]: maybePromise<T[P]>;
};
export declare type ThenArg<T> = T extends Promise<infer U> ? U : T;
export declare type unMaybePromisedProps<T> = {
    [P in keyof T]: ThenArg<T[P]>;
};
export interface map<T> {
    readonly [key: string]: T;
}
export declare type logLevel = 'silly' | 'debug' | 'verbose' | 'info' | 'warn' | 'error';
export interface JOICheck<T = any> {
    readonly valid: boolean;
    readonly value: T;
}
interface baseData {
    readonly gameAddr: addr;
}
export interface hashCheck {
    readonly correctHash: boolean;
    readonly suppliedHash: keccak256Hash;
}
export interface sigCheck {
    readonly correctSigner: boolean;
    readonly signer: addr;
}
export interface Wallet {
    readonly address: addr;
    readonly privateKey: hexString;
}
export declare namespace API {
    type endpoint = (req: Request, res: Response) => void;
    type endpointAsync = (req: Request, res: Response) => Promise<void>;
    type endpointNew<T> = (data: T, res: Response) => Promise<void>;
    interface baseErrorsObj {
        readonly timestamp?: string;
        readonly signer?: string;
        readonly hash?: string;
    }
    interface signedData {
        readonly signedMessage: hexString;
    }
}
export declare namespace IPFSMeta {
    type TokenData = Readonly<{
        tokenId: number;
        name: string;
        desc: string;
        image: string;
        rarity: number;
        cap: number;
    }>;
    interface BoxData {
        readonly boxId: number;
        readonly name: string;
        readonly desc: string;
        readonly image: string;
    }
    interface GameData extends baseData {
        readonly name: string;
        readonly symbol: string;
        readonly desc: string;
        readonly image: string;
    }
    interface GameDataFile {
        readonly game: GameData;
        readonly tokens: ReadonlyArray<TokenData>;
        readonly boxes: ReadonlyArray<BoxData>;
    }
}
export declare namespace Token {
    interface metaData extends baseData {
        readonly tokenId: number;
        readonly name: string;
        readonly desc: string;
        readonly image: string;
        readonly rarity: number;
        readonly cap: number;
        readonly val: number;
        readonly owners: ReadonlyArray<address>;
        readonly totalSupply: number;
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface deployData extends baseData {
        readonly cap: number;
        readonly desc: string;
        readonly image: string;
        readonly name: string;
        readonly rarity: rarityType;
        readonly val: number;
        readonly timestamp: number;
    }
    interface deployDataContract extends baseData {
        readonly cap: number;
        readonly rarity: rarityType;
        readonly val: number;
        readonly timestamp: number;
    }
    interface deployDataSigned extends deployData, API.signedData {
    }
    interface deployErrorObj extends API.baseErrorsObj {
        readonly rarity_cap?: string;
    }
    interface mintData extends baseData {
        readonly tokenId: number;
        readonly to: addr;
        readonly amount: number;
        readonly timestamp: number;
    }
    interface mintDataSigned extends mintData, API.signedData {
    }
    interface transferData {
        readonly from: addr;
        readonly to: addr;
        readonly amount: number;
        readonly timestamp: number;
        readonly tokenId: number;
        readonly gameAddr: addr;
    }
    interface transferDataSigned extends transferData, API.signedData {
    }
}
export declare namespace Box {
    interface metaData extends baseData {
        readonly boxId: number;
        readonly isValid: boolean;
        readonly name: string;
        readonly desc: string;
        readonly image: string;
        readonly tokens: ReadonlyArray<number>;
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface deployData extends baseData {
        readonly name: string;
        readonly desc: string;
        readonly image: string;
        readonly tokens: number[];
        readonly timestamp: number;
    }
    interface deployDataContract extends baseData {
        readonly tokens: number[];
        readonly timestamp: number;
    }
    interface deployDataSigned extends deployData, API.signedData {
    }
    interface deployErrorObj extends API.baseErrorsObj {
        readonly tokens?: string;
    }
    interface removeData extends baseData {
        readonly boxId: number;
        readonly timestamp: number;
    }
    interface removeDataSigned extends removeData, API.signedData {
    }
    interface updateData extends baseData {
        readonly boxId: number;
        readonly isValid: boolean;
        readonly name: string;
        readonly desc: string;
        readonly image: string;
        readonly tokens: number[];
        readonly timestamp: number;
    }
    interface updateDataContract extends baseData {
        readonly boxId: number;
        readonly isValid: boolean;
        readonly tokens: number[];
        readonly timestamp: number;
    }
    interface updateDataSigned extends updateData, API.signedData {
    }
    interface buyData extends baseData {
        readonly boxId: number;
        readonly timestamp: number;
    }
    interface buyDataSigned extends buyData, API.signedData {
    }
}
export declare namespace Game {
    interface metaData extends baseData {
        readonly desc: string;
        readonly gameOwner: addr;
        readonly image: string;
        readonly name: string;
        readonly rarityNames: ReadonlyArray<string>;
        readonly rarityPercs: ReadonlyArray<number>;
        readonly symbol: string;
        readonly totalSupply: number;
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface unpromisedMetaData extends unMaybePromisedProps<maybePromisedProps<metaData>> {
    }
    interface deployData {
        readonly name: string;
        readonly symbol: string;
        readonly desc: string;
        readonly image: string;
        readonly owner: addr;
        readonly timestamp: number;
    }
    interface deployDataSigned extends deployData, API.signedData {
    }
    interface transferData extends baseData {
        readonly from: addr;
        readonly to: addr;
        timestamp: number;
    }
    interface transferDataSigned extends transferData, API.signedData {
    }
}
export declare namespace Loan {
    interface metaData extends baseData {
        readonly loanId: number;
        readonly isActive: boolean;
        readonly lender: addr;
        readonly borrower: addr;
        readonly tokenId: number;
        readonly amount: number;
        readonly start: number;
        readonly length: number;
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface metaDataArray extends baseData {
        readonly isActive: ReadonlyArray<boolean>;
        readonly lender: ReadonlyArray<address>;
        readonly borrower: ReadonlyArray<address>;
        readonly tokenId: ReadonlyArray<number>;
        readonly amount: ReadonlyArray<number>;
        readonly start: ReadonlyArray<number>;
        readonly length: ReadonlyArray<number>;
    }
    interface offerPrivateData extends baseData {
        readonly lender: addr;
        readonly borrower: addr;
        readonly tokenId: number;
        readonly amount: number;
        readonly length: number;
        timestamp: number;
    }
    interface offerPrivateDataSigned extends offerPrivateData, API.signedData {
    }
    interface offerPublicData extends baseData {
        readonly lender: addr;
        readonly tokenId: number;
        readonly amount: number;
        readonly length: number;
        readonly timestamp: number;
    }
    interface offerPublicDataSigned extends offerPublicData, API.signedData {
    }
    interface handlePublicData extends baseData {
        readonly loanId: number;
        readonly timestamp: number;
        decision: boolean;
    }
    interface handlePublicDataSigned extends handlePublicData, API.signedData {
    }
    interface handlePrivateData extends baseData {
        readonly loanId: number;
        readonly decision: boolean;
        readonly timestamp: number;
    }
    interface handlePrivateDataSigned extends handlePrivateData, API.signedData {
    }
    interface finishData extends baseData {
        readonly loanId: number;
        readonly timestamp: number;
    }
    interface finishDataSigned extends finishData, API.signedData {
    }
}
export declare namespace Shop {
    interface metaData extends baseData {
        readonly id: number;
        readonly tokenId: number;
        readonly amount: number;
        readonly created: number;
        readonly gameAddr: addr;
        readonly caller: addr;
    }
    interface promisedMetaData extends maybePromisedProps<metaData> {
    }
    interface metaDataArray {
        readonly ids: number[];
        readonly tokenIds: number[];
        readonly amounts: number[];
        readonly createds: number[];
        readonly gameAddrs: addr[];
        readonly callers: addr[];
    }
    interface tokenToCashData extends baseData {
        readonly tokenId: number;
        readonly amount: number;
        readonly timestamp: number;
    }
    interface tokenToCashDataSigned extends tokenToCashData, API.signedData {
    }
    interface cashToTokenData extends baseData {
        readonly tokenId: number;
        readonly amount: number;
        readonly timestamp: number;
    }
    interface cashToTokenDataSigned extends cashToTokenData, API.signedData {
    }
    interface tokenToTokenData extends baseData {
        readonly fromId: number;
        readonly fromAmount: number;
        readonly toId: number;
        readonly toAmount: number;
        readonly timestamp: number;
    }
    interface tokenToTokenDataSigned extends tokenToTokenData, API.signedData {
    }
}
export declare namespace Trade {
    interface metaData extends baseData {
        readonly taker: addr;
        readonly trader: addr;
        readonly offeredId: num;
        readonly offeredAmount: num;
        readonly wantedId: num;
        readonly wantedAmount: num;
        readonly createdOn: num;
        readonly state: num;
    }
    interface promiedMetaData extends maybePromisedProps<metaData> {
    }
    interface metaDataArray extends baseData {
        readonly takers: addr[];
        readonly traders: addr[];
        readonly offeredIds: num[];
        readonly offeredAmounts: num[];
        readonly wantedIds: num[];
        readonly wantedAmounts: num[];
        readonly createdOns: num[];
        readonly states: num[];
    }
    interface offerPrivateData extends baseData {
        readonly taker: addr;
        readonly offeredId: num;
        readonly offeredAmount: num;
        readonly wantedId: num;
        readonly wantedAmount: num;
        readonly timestamp: num;
    }
    interface offerPrivateDataSigned extends offerPrivateData, API.signedData {
    }
    interface offerPublicData extends baseData {
        readonly offeredId: num;
        readonly offeredAmount: num;
        readonly wantedId: num;
        readonly wantedAmount: num;
        readonly timestamp: num;
    }
    interface offerPublicDataSigned extends offerPublicData, API.signedData {
    }
    interface takePrivateData extends baseData {
        readonly index: num;
        readonly timestamp: num;
    }
    interface takePrivateDataSigned extends takePrivateData, API.signedData {
    }
    interface takePublicData extends baseData {
        readonly index: num;
        readonly timestamp: num;
    }
    interface takePublicDataSigned extends takePublicData, API.signedData {
    }
    interface removeTradeData extends baseData {
        readonly index: num;
        readonly timestamp: num;
    }
    interface removeTradeDataSigned extends removeTradeData, API.signedData {
    }
}
export declare namespace Wrapper {
    interface Setters {
        token: {
            add: Token.deployData;
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
            handlePublic: Loan.handlePrivateData;
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
    }
    interface Getters {
        token: {
            getAll: {
                gameAddr: addr;
            };
            getSpecific: {
                gameAddr: addr;
                tokenId: num;
            };
            getTokensOf: {
                gameAddr: addr;
                userAddr: addr;
            };
        };
        box: {
            getAll: {
                gameAddr: addr;
            };
            getDetails: {
                gameAddr: addr;
                boxId: num;
            };
        };
        game: {
            getAll: {};
            getBalanceOf: {
                gameAddr: addr;
                userAddr: addr;
            };
            getDetails: {
                gameAddr: addr;
            };
        };
        loan: {
            getSpecific: {
                gameAddr: addr;
                loanId: num;
            };
            getFreeBalanceOf: {
                gameAddr: addr;
                userAddr: addr;
                tokenId: num;
            };
            getLoanedBalanceOf: {
                gameAddr: addr;
                userAddr: addr;
                tokenId: num;
            };
            getCreatedCount: {
                gameAddr: addr;
            };
            getDeletedCount: {
                gameAddr: addr;
            };
        };
        shop: {
            getOrderCount: {
                gameAddr: addr;
            };
            getSpecific: {
                gameAddr: addr;
                orderId: num;
            };
            getUserOrder: {
                gameAddr: addr;
                userAddr: addr;
                orderId: num;
            };
            getUserOrderCountInGame: {
                gameAddr: addr;
                userAddr: addr;
            };
            getUserOrders: {
                gameAddr: addr;
                userAddr: addr;
            };
        };
        trade: {
            getClosedCount: {
                gameAddr: addr;
            };
            getOpenCount: {
                gameAddr: addr;
            };
            getSpecific: {
                gameAddr: addr;
                index: num;
            };
            getUserTradeInGame: {
                gameAddr: addr;
                userAddr: addr;
                index: num;
            };
            getUserTradeCount: {
                gameAddr: addr;
                userAddr: addr;
            };
            getUserTradeIdsInGame: {
                gameAddr: addr;
                userAddr: addr;
            };
        };
    }
    type APICall<T> = <U = any>(data: T, privKey: str) => AxiosPromise<U>;
    type APICallGet<T> = <U = any>(params: T) => AxiosPromise<U>;
    type SetterMap = {
        [key in keyof Setters]: {
            [key2 in keyof Setters[key]]: APICall<Setters[key][key2]>;
        };
    };
    type SetterObj<T> = {
        [key in keyof Setters]: {
            [key2 in keyof Setters[key]]: T;
        };
    };
    type GetterMap = {
        [key in keyof Getters]: {
            [key2 in keyof Getters[key]]: APICallGet<Getters[key][key2]>;
        };
    };
}
export declare type chainFunction<T, U = void> = (user: addr, data: T, ts: num, tsExtra: num, unit: num) => Promise<U>;
export declare type chainFunction2<T, U = void> = (user: addr, data: T, unit: num) => Promise<U>;
export declare type chainCall<U = void> = (user: addr, ...args: any[]) => Promise<U>;
export declare type chainSend<T> = chainFunction<T>;
export declare type chainSend2<T> = chainFunction2<T>;
export declare type num = number;
export declare type str = string;
export declare type addr = address;
declare type GameTypes = Game.deployData | Game.transferData;
declare type TokenTypes = Token.deployData | Token.mintData | Token.transferData;
declare type LoanTypes = Loan.offerPublicData | Loan.offerPrivateData | Loan.handlePrivateData | Loan.handlePublicData | Loan.finishData;
declare type BoxTypes = Box.deployData | Box.updateData | Box.buyData | Box.removeData;
declare type ShopTypes = Shop.tokenToCashData | Shop.cashToTokenData | Shop.tokenToTokenData;
export declare type DataTypes = GameTypes | BoxTypes | LoanTypes | TokenTypes | ShopTypes;
export declare type ArgsTuple<T, U> = T extends () => U ? [] : T extends (arg0: infer A) => U ? [A] : T extends (arg0: infer A, arg1: infer B) => U ? [A, B] : T extends (arg0: infer A, arg1: infer B, arg2: infer C) => U ? [A, B, C] : T extends (arg0: infer A, arg1: infer B, arg2: infer C, arg3: infer D) => U ? [A, B, C, D] : T extends (arg0: infer A, arg1: infer B, arg2: infer C, arg3: infer D, arg4: infer E) => U ? [A, B, C, D, E] : T extends (arg0: infer A, arg1: infer B, arg2: infer C, arg3: infer D, arg4: infer E, arg5: infer F) => U ? [A, B, C, D, E, F] : [U];
export {};
