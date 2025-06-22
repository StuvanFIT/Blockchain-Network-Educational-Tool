import React from  'react';
import { create } from 'zustand';
import _ from 'lodash';
import CryptoJS from 'crypto-js';
import { UnspentTxOut, Transaction, TxIn, TxOut, getTransactionId, signTxIn} from '../blockchain/transaction';
import { hexToBinary } from '../blockchain/utils';
import { useWalletStore } from './WalletStore';



class Block {
  constructor(
    public index: number,
    public hash: string,
    public previousHash: string,
    public timestamp: number,
    public data: Transaction[],
    public difficulty: number,
    public nonce: number
  ) {}
}

// Genesis block
const genesisTransaction: Transaction = {
  txIns: [{ signature: '', txOutId: '', txOutIndex: 0 }],
  txOuts: [{
    address: '04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534a',
    amount: 50
  }],
  id: 'e655f6a5f26dc9b4cac6e46f52336428287759cf81ef5ff10854f69d68f43fa3'
};

const genesisBlock = new Block(
  0,
  '91a73664bc84c0baa1fc75ea6e4aa6d1d20c5df664c724e3159aefc2e1186627',
  'This is the first (genesis) block, there is no previous block.',
  1465154705,
  [genesisTransaction],
  0,
  0
);

let testChain: Block[] = [];


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

const createTransaction = (
  receiverAddress: string,
  amount: number,
  publicKey:string,
  privateKey: string,
  myAddress: string, 
  unspentTxOuts: UnspentTxOut[],
  txPool: Transaction[]
): Transaction => {
  const myUnspentTxOutsA = unspentTxOuts.filter((uTxO) => uTxO.address === myAddress);
  const myUnspentTxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);
  const { includedUnspentTxOuts, leftOverAmount } = findTxOutsForAmount(amount, myUnspentTxOuts);

  const toUnsignedTxIn = (unspentTxOut: UnspentTxOut): TxIn => ({
    txOutId: unspentTxOut.txOutId,
    txOutIndex: unspentTxOut.txOutIndex,
    signature: ''
  });

  const unsignedTxIns: TxIn[] = includedUnspentTxOuts.map(toUnsignedTxIn);
  const txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
  const tx: Transaction = { id: '', txIns: unsignedTxIns, txOuts };
  tx.id = getTransactionId(tx);
  tx.txIns = tx.txIns.map((txIn, index) => ({
    ...txIn,
    signature: signTxIn(tx, index,publicKey, privateKey, unspentTxOuts)
  }));

  return tx;
};





type BlockchainState = {
  blockchain: Block[];
  addNewBlock: (block: Block) => void;
  getLatestBlock: () => Block;
  getBlockchain: () => Block[];
  calculateHash: (
    index: number,
    previousHash: string,
    timestamp: number,
    data: Transaction[],
    difficulty: number,
    nonce: number
  ) => string;
  hashMatchesDifficulty: (hash: string, difficulty: number) => boolean;
  updateUTXOsAfterMining: (block: Block, currentUTXOs: UnspentTxOut[]) => UnspentTxOut[];
};

export const useBlockchainStore = create<BlockchainState>((set, get) => ({
  blockchain: [genesisBlock],

  addNewBlock: (block: Block) =>
    set((state) => ({
      blockchain: [...state.blockchain, block],
    })),

  getBlockchain: () => get().blockchain,

  getLatestBlock: () => {
    const chain = get().blockchain;
    return chain[chain.length - 1];
  },

  calculateHash: (index, previousHash, timestamp, data, difficulty, nonce) => {
    return CryptoJS
      .SHA256(index + previousHash + timestamp + JSON.stringify(data) + difficulty + nonce)
      .toString();
  },

  hashMatchesDifficulty: (hash, difficulty) => {
    const hashInBinary = hexToBinary(hash);
    const requiredPrefix = '0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
  },

  updateUTXOsAfterMining: (block, currentUTXOs) => {
    let newUTXOs = [...currentUTXOs];

    block.data.forEach(transaction => {
      // Remove spent UTXOs
      transaction.txIns.forEach(input => {
        newUTXOs = newUTXOs.filter(
          utxo => !(utxo.txOutId === input.txOutId && utxo.txOutIndex === input.txOutIndex)
        );
      });

      // Add new UTXOs
      transaction.txOuts.forEach((output, index) => {
        newUTXOs.push(new UnspentTxOut(transaction.id, index, output.address, output.amount));
      });
    });

    return newUTXOs;
  }

}));

export {Block, createTransaction, testChain}
