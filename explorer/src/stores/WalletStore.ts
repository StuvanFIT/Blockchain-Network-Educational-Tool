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
  resetWallets: () => void;
  recalculateAllBalances: () => void;
  
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

//Initial wallet
const initialWallet: WalletStructure = {
  id: Date.now() + Math.random(),
  name: `Wallet 0`,
  publicKey: '0488e683f272afc630c0e4798d99526a0d81fc40f42d8f081c72ffd37a43927a0797777b25b2c308223cb73721c6f0330cd5d7e293fe15e37ccac1ff7aad2cbdcf',
  privateKey: '15c8692bdce6cba00b99c469b59cc051e878b9ef07780defc75f9a283190c3f4',
  balance: 300.0,
}


//Use Wallet Store
export const useWalletStore = create<WalletStore>()(((set, get) => ({
    // Initial state
    publicKey: "0488e683f272afc630c0e4798d99526a0d81fc40f42d8f081c72ffd37a43927a0797777b25b2c308223cb73721c6f0330cd5d7e293fe15e37ccac1ff7aad2cbdcf",
    privateKey: "15c8692bdce6cba00b99c469b59cc051e878b9ef07780defc75f9a283190c3f4",
    utxos: [
      new UnspentTxOut("tx1", 0, "0488e683f272afc630c0e4798d99526a0d81fc40f42d8f081c72ffd37a43927a0797777b25b2c308223cb73721c6f0330cd5d7e293fe15e37ccac1ff7aad2cbdcf", 75),
      new UnspentTxOut("tx2", 1, "0488e683f272afc630c0e4798d99526a0d81fc40f42d8f081c72ffd37a43927a0797777b25b2c308223cb73721c6f0330cd5d7e293fe15e37ccac1ff7aad2cbdcf", 25),
      new UnspentTxOut("tx3", 2, "0488e683f272afc630c0e4798d99526a0d81fc40f42d8f081c72ffd37a43927a0797777b25b2c308223cb73721c6f0330cd5d7e293fe15e37ccac1ff7aad2cbdcf", 200),
    ],
    transactionPool: [],
    balance: 300,

    exampleWallets: [initialWallet],

    updateWallets: (exampleWallets: WalletStructure[]) =>{
      set({exampleWallets});
    },

    resetWallets: () =>{
      set({exampleWallets: [initialWallet]})
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

      get().recalculateAllBalances();
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
    recalculateAllBalances: () => {
      const {utxos, exampleWallets} = get();

      const updatedWallets = exampleWallets.map(wallet => {
        const walletBalance = utxos
          .filter(u => u.address === wallet.publicKey)
          .reduce((sum, a) => sum + a.amount,0);
        return {...wallet,  balance: walletBalance};
      });

      set({exampleWallets: updatedWallets});
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