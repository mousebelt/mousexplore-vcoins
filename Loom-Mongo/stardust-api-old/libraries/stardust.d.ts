import { hexString, keccak256Hash, Wallet, Wrapper } from '../types/stardust';
declare type X = Wrapper.Setters;
declare type hashFunc<T> = (data: T) => keccak256Hash;
declare type hashAndSignFunc<T> = (data: T, privKey: hexString) => hexString;
declare type postJSONFunc<T> = (data: T, privKey: hexString) => T & {
    signedMessage: hexString;
};
declare type HashObjType = {
    [key1 in keyof X]: {
        [key2 in keyof X[key1]]: hashFunc<X[key1][key2]>;
    };
};
declare type HashAndSignObjType = {
    [key1 in keyof X]: {
        [key2 in keyof X[key1]]: hashAndSignFunc<X[key1][key2]>;
    };
};
declare type CreatePostJSONObjType = {
    [key1 in keyof X]: {
        [key2 in keyof X[key1]]: postJSONFunc<X[key1][key2]>;
    };
};
export declare const createRawWallet: () => Wallet;
export declare const createWallet: () => string[];
export declare const hash: HashObjType;
export declare const hashAndSign: HashAndSignObjType;
export declare const createPostJSON: CreatePostJSONObjType;
export declare const stardustAPI: (baseURL: string) => {
    setters: Wrapper.SetterMap;
    getters: Wrapper.GetterMap;
};
export {};
