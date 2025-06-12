import * as CryptoJS from 'crypto-js';
import * as ecdsa from 'elliptic';
import * as _ from 'lodash'

import { toHexString } from './utils';

const ec = new ecdsa.ec('secp256k1');


/*
EXAMPLE:
const previousTx = new Transaction();
previousTx.id = 'tx123';
previousTx.txOuts = [
  new TxOut('alice-address', 10),  // index 0
  new TxOut('bob-address', 20)     // index 1
];

Output at index 0 → 10 coins to Alice
Output at index 1 → 20 coins to Bob

Now, if Bob wants to spend his 20 coins…He creates a new transaction that includes a TxIn:
const txIn = new TxIn();
txIn.txOutId = 'tx123';     // Refers to previous transaction
txIn.txOutIndex = 1;        // Refers to Bob’s output (20 coins)
txIn.signature = '...';     // Signature proving ownership of address

txOutIndex = 1 says: “I'm spending the second output of the transaction with ID tx123.

*/

const COINBASE_AMOUNT: number = 50;

//Transaction inputs (txIn) provide the information “where” the coins are coming from. It proves you own the coins your are spending (signature)
//Each TxIn refers to a previous TxOut.
class TxIn {

    public txOutId: string; //ID of the previous transaction
    public txOutIndex: number; //Index of the output in that previous transaction. In a blockchain, every transaction can have multiple outputs (TxOuts) stored in an array. Thus, we say we are referring to index .... of the TxOuts array
    public signature: string; //Signature to prove ownership
}

//Transaction outputs (txOut) consists of an address and an amount of coins.
//Each TxOut says where the coins are going and how much.
//TxOuts are the actual money being sent in the transaction.
class TxOut {
    public address: string; //Receipents address
    public amount: number; //Amount of coins sent

    constructor(address: string, amount: number) {
        this.address = address;
        this.amount = amount;
    }
}

/*
A transaction is basically:

"I prove I received coins in the past (txIns), and now I want to send them to these addresses (txOuts)."

*/
class Transaction {
    public id: string; // A unique ID for the transaction (calculated via hash)
    public txIns: TxIn[]; // Array of inputs (what's being spent)
    public txOuts: TxOut[];  // Array of outputs (who gets what)
}


/*
When a transaction is processed, its outputs become “coins” you can spend later.
Each TxOut becomes an UnspentTxOut (UTXO) if no one has spent it yet.
So you can think of a UTXO as:
“This output (from tx123, output index 0) contains 15 coins, owned by Alice.”

UTXO lifecycle:
1. You receive 15 coins in a TxOut → it’s a new UTXO

2. You spend those coins in a new transaction → that UTXO is removed

3. The new TxOuts from your transaction → become new UTXOs
*/
class UnspentTxOut {
    public readonly txOutId: string; 
    public readonly txOutIndex: number;
    public readonly address: string;
    public readonly amount: number;

    constructor(txOutId: string, txOutIndex: number, address: string, amount: number) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}


/*
Transaction ID
The transaction id is calculated by taking a hash from the contents of the transaction.
However, the signatures of the txIds are not included in the transaction hash as the will be added later on to the transaction.
*/

const getTransactionId = (transaction: Transaction): string =>{

    const txInContent: string = transaction.txIns
        .map((txIn: TxIn) => txIn.txOutId +  txIn.txOutIndex)
        .reduce((accumulator, currentValue) => accumulator+currentValue, '');

        
    const txOutContent: string = transaction.txOuts
        .map((txOut: TxOut) => txOut.address +  txOut.amount)
        .reduce((accumulator, currentValue) => accumulator+currentValue, '');


    return CryptoJS.SHA256(txInContent + txOutContent).toString();
}

const getPublicKey = (aPrivateKey: string): string => {
    return ec.keyFromPrivate(aPrivateKey, 'hex').getPublic().encode('hex');
};


/*
Signing TxIn:
It is important that the contents of the transaction cannot be altered, after it has been signed.
As the transactions are public, anyone can access to the transactions, even before they are included in the blockchain.

When signing the transaction inputs, only the txId will be signed.
If any of the contents in the transactions is modified, the txId must change, making the transaction and signature invalid.

Each input (TxIn) is signed with the private key of the address that owns the coins.
This signature is based on the transaction ID, which is a hash of the transaction content excluding signatures.

*/

const signTxIn = (transaction: Transaction, txInIndex: number, privateKey:string, unspentTxOuts: UnspentTxOut[]): string =>{
    
    const txIn: TxIn = transaction.txIns[txInIndex];
    const dataToSign = transaction.id;

    //Find the UTXO this input refers to:
    //Every TxIn references a previous output UTXO using txoutid and txoutindex
    //This function searches through the list of UTXOs and finds the one this input is trying to spend.
    const referencedUnspentTxOut: UnspentTxOut = findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, unspentTxOuts);

    //This gives us the public key that owns the referenced UTXO.
    const referencedAddress = referencedUnspentTxOut.address;

    //Generate the signature
    const key = ec.keyFromPrivate(privateKey, 'hex');
    const signature: string = toHexString(key.sign(dataToSign).toDER());
    return signature;

}


const findUnspentTxOut = (transactionId: string, index: number, aUnspentTxOuts: UnspentTxOut[]): UnspentTxOut => {

    const unspentTxOut  = aUnspentTxOuts.find((uTxO) => uTxO.txOutId === transactionId && uTxO.txOutIndex === index);

    if (!unspentTxOut){
        throw new Error(`UnspentTxOut not found for txOutId: ${transactionId}, index: ${index}`);
    }
    return unspentTxOut;
};

/*
Updating unspent transaction Outputs:
Every time a new block is added to the chain, we must update our list of unspent transaction outputs.
This is because the new transactions will spend some of the existing transaction outputs and introduce new unspent outputs.
 */
const updateUnspentTxOuts = (newTransactions: Transaction[], aUnspentTxOuts: UnspentTxOut[]): UnspentTxOut[] => {
    const newUnspentTxOuts: UnspentTxOut[] = newTransactions
        .map((t) => {
            return t.txOuts.map((txOut, index) => new UnspentTxOut(t.id, index, txOut.address, txOut.amount));
        })
        .reduce((a, b) => a.concat(b), []);

    const consumedTxOuts: UnspentTxOut[] = newTransactions
        .map((t) => t.txIns)
        .reduce((a, b) => a.concat(b), [])
        .map((txIn) => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));

    const resultingUnspentTxOuts = aUnspentTxOuts
        .filter(((uTxO) => !findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts)))
        .concat(newUnspentTxOuts);

    return resultingUnspentTxOuts;
};


/*
Validating Transaction Structure
*/

const isValidTxInStructure = (txIn: TxIn): boolean => {
    if (txIn == null) {
        console.log('txIn is null');
        return false;
    } else if (typeof txIn.signature !== 'string') {
        console.log('invalid signature type in txIn');
        return false;
    } else if (typeof txIn.txOutId !== 'string') {
        console.log('invalid txOutId type in txIn');
        return false;
    } else if (typeof  txIn.txOutIndex !== 'number') {
        console.log('invalid txOutIndex type in txIn');
        return false;
    } else {
        return true;
    }
};

const isValidTxOutStructure = (txOut: TxOut): boolean => {
    if (txOut == null) {
        console.log('txOut is null');
        return false;
    } else if (typeof txOut.address !== 'string') {
        console.log('invalid address type in txOut');
        return false;
    } else if (!isValidAddress(txOut.address)) {
        console.log('invalid TxOut address');
        return false;
    } else if (typeof txOut.amount !== 'number') {
        console.log('invalid amount type in txOut');
        return false;
    } else {
        return true;
    }
};

const isValidTransactionsStructure = (transactions: Transaction[]): boolean => {
    return transactions
        .map(isValidTransactionStructure)
        .reduce((a, b) => (a && b), true);
};

const isValidTransactionStructure = (transaction: Transaction) => {
    if (typeof transaction.id !== 'string') {
        console.log('transactionId missing');
        return false;
    }
    if (!(transaction.txIns instanceof Array)) {
        console.log('invalid txIns type in transaction');
        return false;
    }
    if (!transaction.txIns
            .map(isValidTxInStructure)
            .reduce((a, b) => (a && b), true)) {
        return false;
    }

    if (!(transaction.txOuts instanceof Array)) {
        console.log('invalid txIns type in transaction');
        return false;
    }

    if (!transaction.txOuts
            .map(isValidTxOutStructure)
            .reduce((a, b) => (a && b), true)) {
        return false;
    }
    return true;
};

//valid address is a valid ecdsa public key in the 04 + X-coordinate + Y-coordinate format
const isValidAddress = (address: string): boolean => {
    if (address.length !== 130) {
        console.log('invalid public key length');
        return false;
    } else if (address.match('^[a-fA-F0-9]+$') === null) {
        console.log('public key must contain only hex characters');
        return false;
    } else if (!address.startsWith('04')) {
        console.log('public key must start with 04');
        return false;
    }
    return true;
};


/*
CoinBase transaction
*/
const validateCoinbaseTx = (transaction: Transaction, blockIndex: number): boolean => {
    if (transaction == null) {
        console.log('the first transaction in the block must be coinbase transaction');
        return false;
    }
    if (getTransactionId(transaction) !== transaction.id) {
        console.log('invalid coinbase tx id: ' + transaction.id);
        return false;
    }
    if (transaction.txIns.length !== 1) {
        console.log('one txIn must be specified in the coinbase transaction');
        return false;
    }
    if (transaction.txIns[0].txOutIndex !== blockIndex) {
        console.log('the txIn signature in coinbase tx must be the block height');
        return false;
    }
    if (transaction.txOuts.length !== 1) {
        console.log('invalid number of txOuts in coinbase transaction');
        return false;
    }
    if (transaction.txOuts[0].amount != COINBASE_AMOUNT) {
        console.log('invalid coinbase amount in coinbase transaction');
        return false;
    }
    return true;
};

export {
    signTxIn, getTransactionId,
    UnspentTxOut, TxIn, TxOut,getPublicKey,
    Transaction
}