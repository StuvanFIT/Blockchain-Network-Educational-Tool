import React from  'react';
import _ from 'lodash';
import { UnspentTxOut, validateTransaction, getCoinbaseTransaction } from '../blockchain/transaction';
import { getTransactionPool, addToTransactionPool, clearTransactionPool, updateTransactionPool } from '../blockchain/transactionPool';
import { TxIn, TxOut, Transaction, getTransactionId, signTxIn } from '../blockchain/transaction';


const mockWalletFunctions = {
    getPublicFromWallet: () => "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa",
    getPrivateFromWallet: () => "1234567890abcdef1234567890abcdef12345678",
    //getBalance(),
    //createTransaction(),
    //validateTransaction(),
    //getCoinbaseTransactione(),
}

// Mock data
const mockUnspentTxOuts = [
  new UnspentTxOut("tx1", 0, "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa",75 ),
  new UnspentTxOut("tx2", 1, "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa",25 ),
  new UnspentTxOut("tx3", 3, "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa",200 ),
];



const getBalance = (address: string, unspentTxOuts: UnspentTxOut[]): number => {
    return _(findUnspentTxOuts(address, unspentTxOuts))
        .map((uTxO: UnspentTxOut) => uTxO.amount)
        .sum();
};

const findUnspentTxOuts = (ownerAddress: string, unspentTxOuts: UnspentTxOut[]) => {
    return _.filter(unspentTxOuts, (uTxO: UnspentTxOut) => uTxO.address === ownerAddress);
};




const findTxOutsForAmount = (amount: number, myUnspentTxOuts: UnspentTxOut[]) => {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount = currentAmount + myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;
            return {includedUnspentTxOuts, leftOverAmount};
        }
    }

    const eMsg = 'Cannot create transaction from the available unspent transaction outputs.' +
        ' Required amount:' + amount + '. Available unspentTxOuts:' + JSON.stringify(myUnspentTxOuts);
    throw Error(eMsg);
};

const createTxOuts = (receiverAddress: string, myAddress: string, amount:number, leftOverAmount: number) => {
    const txOut1: TxOut = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
        return [txOut1];
    } else {
        const leftOverTx = new TxOut(myAddress, leftOverAmount);
        return [txOut1, leftOverTx];
    }
};

const filterTxPoolTxs = (unspentTxOuts: UnspentTxOut[], transactionPool: Transaction[]): UnspentTxOut[] => {
    const txIns: TxIn[] = _(transactionPool)
        .map((tx: Transaction) => tx.txIns)
        .flatten()
        .value();
    const removable: UnspentTxOut[] = [];
    for (const unspentTxOut of unspentTxOuts) {
        const txIn = _.find(txIns, (aTxIn: TxIn) => {
            return aTxIn.txOutIndex === unspentTxOut.txOutIndex && aTxIn.txOutId === unspentTxOut.txOutId;
        });

        if (txIn === undefined) {

        } else {
            removable.push(unspentTxOut);
        }
    }

    return _.without(unspentTxOuts, ...removable);
};

const createTransaction = (receiverAddress: string, amount: number, privateKey: string,
                           unspentTxOuts: UnspentTxOut[], txPool: Transaction[]): Transaction => {

    console.log('txPool: %s', JSON.stringify(txPool));
    const myAddress: string = mockWalletFunctions.getPublicFromWallet();
    const myUnspentTxOutsA = unspentTxOuts.filter((uTxO: UnspentTxOut) => uTxO.address === myAddress);

    const myUnspentTxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);

    // filter from unspentOutputs such inputs that are referenced in pool
    const {includedUnspentTxOuts, leftOverAmount} = findTxOutsForAmount(amount, myUnspentTxOuts);

    const toUnsignedTxIn = (unspentTxOut: UnspentTxOut) => {
        const txIn: TxIn = new TxIn('', 1, '');
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };

    const unsignedTxIns: TxIn[] = includedUnspentTxOuts.map(toUnsignedTxIn);

    const tx: Transaction = new Transaction('', [],[]);
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn: TxIn, index: number) => {
        txIn.signature = signTxIn(tx, index, privateKey, unspentTxOuts);
        return txIn;
    });

    return tx;
};



export {mockWalletFunctions, mockUnspentTxOuts, getBalance, findUnspentTxOuts, createTransaction}

