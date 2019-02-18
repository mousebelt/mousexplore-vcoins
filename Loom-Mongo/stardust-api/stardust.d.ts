import { solidityParam, solidityValue, Wallet } from './types/stardust';
import { BigNumber } from 'bignumber.js';
import Web3 from 'web3';
export declare const web3: Web3;
export declare const getSigner: (sig: string | {
    signedMessage: string;
}) => string;
export declare const toCheckSumAddr: (address: string) => string;
export declare const createRawWallet: () => Wallet;
export declare const createWallet: () => string[];
export declare const sign: (msg: string, privKey: string) => string;
export declare const hashParam: (value: solidityValue, type: solidityParam) => string;
export declare const packTS: ({ timestamp, unitIn }: {
    timestamp: number | BigNumber;
    unitIn: number | BigNumber;
}) => string;
export declare const unpackTS: (data: string) => {
    unit: BigNumber;
    tsExtra: BigNumber;
    ts: BigNumber;
};
export declare const scaleUp: (rarityPercs: ReadonlyArray<number>) => [string[], number];
export { stardustAPI } from './api/data-only';
export { createPostJSON } from './postJSON';
