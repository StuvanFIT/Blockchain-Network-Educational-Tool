import React from  'react';
import _ from 'lodash';
import CryptoJS from 'crypto-js';
import { UnspentTxOut, validateTransaction, getCoinbaseTransaction } from '../blockchain/transaction';
import { getTransactionPool, addToTransactionPool, clearTransactionPool, updateTransactionPool } from '../blockchain/transactionPool';
import { TxIn, TxOut, Transaction, getTransactionId, signTxIn } from '../blockchain/transaction';
import { hexToBinary } from '../blockchain/utils';


const mockWalletFunctions = {
    getPublicFromWallet: () => "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa",
    getPrivateFromWallet: () => "1234567890abcdef1234567890abcdef12345678",
    //getBalance(),
    //createTransaction(),
    //validateTransaction(),
    //getCoinbaseTransactione(),
}

// Mock data
let mockUnspentTxOuts = [
  new UnspentTxOut("tx1", 0, "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa",75 ),
  new UnspentTxOut("tx2", 1, "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa",25 ),
  new UnspentTxOut("tx3", 3, "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa",200 ),
];

const updateMockUTXO = (newUTXO: UnspentTxOut[]) =>{
    mockUnspentTxOuts = [...newUTXO];
}



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



class Block {

    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: Transaction[];
    public difficulty: number;
    public nonce: number;

    constructor(index: number, hash: string, previousHash: string,
                timestamp: number, data: Transaction[], difficulty: number, nonce: number) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}

const genesisTransaction = {
    'txIns': [{'signature': '', 'txOutId': '', 'txOutIndex': 0}],
    'txOuts': [{
        'address': '04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534a',
        'amount': 50
    }],
    'id': 'e655f6a5f26dc9b4cac6e46f52336428287759cf81ef5ff10854f69d68f43fa3'
};

const genesisBlock: Block = new Block(
    0, '91a73664bc84c0baa1fc75ea6e4aa6d1d20c5df664c724e3159aefc2e1186627', '', 1465154705, [genesisTransaction], 0, 0
);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

const addNewBlock = (block: Block) => {
    blockchain.push(block);
}

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const calculateHash = (index: number, previousHash: string, timestamp: number, data: Transaction[],
                       difficulty: number, nonce: number): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data + difficulty + nonce).toString();

const hashMatchesDifficulty = (hash: string, difficulty: number): boolean => {
    const hashInBinary: string = hexToBinary(hash);
    const requiredPrefix: string = '0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
};

function updateUTXOsAfterMining(block:Block, currentUTXOs: UnspentTxOut[]) {
  let newUTXOs = [...currentUTXOs];
  
  // For each transaction in the block
  block.data.forEach(transaction => {
    // Remove spent UTXOs (referenced by transaction inputs)
    transaction.txIns.forEach(input => {
      newUTXOs = newUTXOs.filter(utxo => 
        !(utxo.txOutId === input.txOutId && utxo.txOutIndex === input.txOutIndex)
      );
    });
    
    // Add new UTXOs (transaction outputs)
    transaction.txOuts.forEach((output, index) => {
      newUTXOs.push(new UnspentTxOut(transaction.id, index, output.address, output.amount));
    });
  });
  
  return newUTXOs;
}


export {mockWalletFunctions, mockUnspentTxOuts, Block, getBalance, findUnspentTxOuts, createTransaction, getBlockchain, getLatestBlock, calculateHash, hashMatchesDifficulty
    ,updateUTXOsAfterMining,updateMockUTXO, addNewBlock}

