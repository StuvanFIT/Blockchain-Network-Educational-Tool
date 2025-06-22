import { ec } from 'elliptic';
import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { getPublicKey, UnspentTxOut } from '../blockchain/transaction';
import { Transaction } from '../blockchain/transaction';
import { WalletStructure } from '../components/Wallet';

/*
We will be utilising the Zustand store management

Step 1: Set up the store 
Step 2: Subscribe with the selector manually to prevent unnecessary re-rendering
Step 3: Use it in a React Component

set(): sets or updates the values in the store you defined
get(): retrieves the values of variables and calls methods defined in the store

*/
const EC = new ec('secp256k1');

//Interface: Wallet Store
interface WalletStore {

  // State
  publicKey: string;
  privateKey: string;
  utxos: UnspentTxOut[];
  transactionPool: Transaction[];
  balance: number;
  exampleWallets: WalletStructure[];
  
  // Actions
  setPublicKey: (publicKey: string) => void;
  setPrivateKey: (privateKey: string) => void;
  updateUTXOs: (utxos: UnspentTxOut[]) => void;
  updateWallets: (wallets: WalletStructure[]) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (transactionId: string) => void;
  clearTransactionPool: () => void;
  calculateBalance: (address?: string) => number;
  updateBalance: () => void;
  
  // Computed getters
  getPublicFromPrivateKey: (privateKeyInput: string) => string;
  getCurrentBalance: () => number;
  getPublicKey: () => string;
  getPrivateKey: () => string;
}


const generatePrivateKey = (): string => {
    const keyPair = EC.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};

//Use Wallet Store
export const useWalletStore = create<WalletStore>()(((set, get) => ({
    // Initial state
    publicKey: "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa",
    privateKey: "1234567890abcdef1234567890abcdef12345678",
    utxos: [
      new UnspentTxOut("tx1", 0, "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa", 75),
      new UnspentTxOut("tx2", 1, "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa", 25),
      new UnspentTxOut("tx3", 3, "0498eaebc69ddc929d4b9c4834a41179fb4b4dad8ba2b60661de4b261a9de996376a43fdc5160a1a9ac8dc9d15f34c14e8dba8624dc2fa4ee13d53b0d1aed2c8aa", 200),
    ],
    transactionPool: [],
    balance: 300,

    exampleWallets: [],

    updateWallets: (exampleWallets: WalletStructure[]) =>{
      set({exampleWallets});
    },

    // Actions
    setPublicKey: (publicKey: string) => {
      set({ publicKey });
      // Auto-recalculate balance when public key changes
      const newBalance = get().calculateBalance(publicKey);
      set({ balance: newBalance });
    },

    setPrivateKey: (privateKey: string) => set({ privateKey }),

    updateUTXOs: (utxos: UnspentTxOut[]) => {
      set({ utxos });
      // Auto-recalculate balance when UTXOs change
      const { publicKey } = get();
      const newBalance = get().calculateBalance(publicKey);
      set({ balance: newBalance });
    },

    addTransaction: (transaction: Transaction) =>
      set((state) => ({
        transactionPool: [...state.transactionPool, transaction]
      })),

    removeTransaction: (transactionId: string) =>
      set((state) => ({
        transactionPool: state.transactionPool.filter(tx => tx.id !== transactionId)
      })),

    clearTransactionPool: () => set({ transactionPool: [] }),

    calculateBalance: (address?: string) => {
      const { publicKey, utxos } = get();
      const targetAddress = address || publicKey;
      return utxos
        .filter(utxo => utxo.address === targetAddress)
        .reduce((sum, utxo) => sum + utxo.amount, 0);
    },
    updateBalance: () =>{
      const {publicKey} = get();
      const newBalance = get().calculateBalance(publicKey);
      set({balance: newBalance});
    },

    // Computed getters
    getPublicFromPrivateKey: (privateKeyInput:string):string => {

      if (privateKeyInput === get().getPrivateKey()){
        return get().getPublicKey();
      }
      return 'Private key does not match with the current {Public, Private} key pair!';
    },
    getCurrentBalance: () => get().balance,
    getPublicKey: () => get().publicKey,
    getPrivateKey: () => get().privateKey,
  })
  )
);

export {generatePrivateKey}