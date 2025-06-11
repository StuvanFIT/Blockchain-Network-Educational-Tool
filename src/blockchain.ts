import * as CryptoJs from 'crypto-js';
import {broadcastLatest} from './p2p';
//Code for simple block structure
class Block {

    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: string;


    constructor(index: number, hash: string, previousHash: string, timestamp: number, data: string){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}

//Genesis block: the first block of the blockchain. THis block has no previousHash (root).
const genesisBlock: Block = new Block (
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', ' ', 1465154705, 'my genesis block!!');


//Storing the Block chain:
//For now, we will be using a JS array to store the block chain
let blockchain: Block[] = [genesisBlock];

const getBlockChain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length -1];

//Computing the hash of the block. The hash is calculated over all data of the block
const calculateHash = (index: number, previousHash: string, timestamp: number, data: string): string =>
    CryptoJs.SHA256( index + previousHash + timestamp + data).toString();

const calculateHashForBlock = (newBlock: Block): string =>
    calculateHash(newBlock.index, newBlock.previousHash, newBlock.timestamp, newBlock.data);


/*
Add a new block to the block chain
*/

const addBlock = (newBlock: Block) =>{
    if (isValidNewBlock(newBlock, getLatestBlock())){
        blockchain.push(newBlock);
    }
}

const addBlockToChain = (newBlock: Block) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
};

//Generate the next block:
//We must know the hash of the previous block and create the rest of the required content.
const generateNextBlock = (blockData: string) => {

    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index + 1;
    const nextTimeStamp: number = new Date().getTime() /1000;
    const nextHash: string = calculateHash(nextIndex, previousBlock.hash, nextTimeStamp, blockData);
    const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimeStamp, blockData);
    addBlock(newBlock);
    broadcastLatest();
    return newBlock;
};





/*
Validate the structure of the Block
*/
const isValidBlockStructure = (block: Block): boolean =>{
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
}


 /*
 Validating the integrity of the block:

 For a block to be valid:
 1. The index of the block must be one number larger than the previous.
 2. The previousHash of the block must match the hash of the previous block.
 3. The hash of the block itself must be valid 
 */

const isValidNewBlock = (newBlock: Block, previousBlock: Block) =>{

    if (previousBlock.index +1 !== newBlock.index){
        console.log("This is an invalid index! Previous index + 1 !== new block index");
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log("The current hash of the block does not match the hash of the previous block.");
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log( typeof(newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }

    return true;
}


/*
Validating the block chain

1. Check if the first block is the genesis block
2. Check each consecutive block using isValidNewBlock
*/

const isValidChain = (blockChainToValidate: Block[]): boolean => {

    const isValidGenesis = (block: Block): boolean =>{
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if (!isValidGenesis(blockChainToValidate[0])){
        return false;
    };

    //Start at the block after genesis
    for (let i=1; i < blockChainToValidate.length; i++){
        
        if (!isValidNewBlock(blockChainToValidate[i], blockChainToValidate[i-1])){
            return false;
        }
    }
    return true;
}

/*

There should always be only one explicit set of blocks in the chain at a given time.

So when multiple valid chains exists, the network chooses the longest chain. In case of conflicts (e.g. two nodes both generate block number 72),
we choose the chain that has the longest number of blocks. 

Without sharing, each node would have its own separate blockchain
The whole point of blockchain is that all participants agree on the same ledger
Sharing ensures everyone has the same version of the "truth"

*/

const replaceChain = (newBlocks: Block[]) =>{
    
    if (isValidChain(newBlocks) && newBlocks.length > getBlockChain().length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        broadcastLatest();
    } else {
        console.log(" Received blockchain is invalid!");
    }
}


export {Block, getBlockChain, getLatestBlock, generateNextBlock, isValidBlockStructure, replaceChain, addBlockToChain};