import * as CryptoJs from 'crypto-js';
import {broadcastLatest} from './p2p';
import {hexToBinary} from './utils';
//Code for simple block structure
class Block {

    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: string;
    public difficulty: number;
    public nonce: number; //nonce is the current value that when combined with other block data and hashed, results in a hash that meets the network's difficulty target. 


    constructor(index: number, hash: string, previousHash: string, timestamp: number, data: string, difficulty:number, nonce: number){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}

//Genesis block: the first block of the blockchain. THis block has no previousHash (root).
const genesisBlock: Block = new Block (
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', ' ', 1465154705, 'my genesis block!!', 0,0);


//Storing the Block chain:
//For now, we will be using a JS array to store the block chain
let blockchain: Block[] = [genesisBlock];


const getBlockChain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length -1];

/*
Consensus on the difficulty
We have now the means to find and verify the hash for a given difficulty, but how is the difficulty determined?

block generation interval: how often a new block should be found
difficulty adjustmnet interval: how often the difficulty should adjust to the increasing/decreasing network hash rate

Based on BITCOIN:
const BLOCK_GENERATION_INTERVAL: number = 10; // in seconds
const DIFFICULTY_ADJUSTMNET_INTERVAL:number = 2016; // in blocks

In the below example:
For every 10 blocks generated, we check if the time that took to generate those blocks are larger or smaller than the expected time

*/
const BLOCK_GENERATION_INTERVAL: number = 10; // in seconds
const DIFFICULTY_ADJUSTMNET_INTERVAL:number = 10; // in blocks

const getDifficulty = (blockChain: Block[]): number =>{

    const latestBlock: Block = blockChain[blockChain.length - 1];

    if (latestBlock.index % DIFFICULTY_ADJUSTMNET_INTERVAL ===0 && latestBlock.index !== 0){
        return getAdjustedDifficulty(latestBlock, blockChain);
    }

    return latestBlock.difficulty;

}

const getAdjustedDifficulty = (latestBlock: Block, blockChain: Block[]): number => {

    //Expected time to generate 10 blocks = 100 seconds
    const expectedTime: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMNET_INTERVAL;
    const previousAdjustmentBlock: Block = blockchain[blockChain.length - DIFFICULTY_ADJUSTMNET_INTERVAL];
    const timeTaken: number = latestBlock.timestamp - previousAdjustmentBlock.timestamp;

    /*
    If blocks were generated too quickly (less than half the expected time)  --> increase difficulty
    If blocks were generated too slowly (more than double the expected time) --> decrease difficulty
    Else, keep the difficulty the same
    */
    if (timeTaken < expectedTime/2){
        return previousAdjustmentBlock.difficulty + 1;
    } else if (timeTaken > expectedTime * 2){
        return previousAdjustmentBlock.difficulty - 1;
    } else {
        return previousAdjustmentBlock.difficulty;
    };
}




//Computing the hash of the block. The hash is calculated over all data of the block
const calculateHash = (index: number, previousHash: string, timestamp: number, data: string): string =>
    CryptoJs.SHA256( index + previousHash + timestamp + data).toString();

const calculateHashForBlock = (newBlock: Block): string =>
    calculateHash(newBlock.index, newBlock.previousHash, newBlock.timestamp, newBlock.data);



const hashMatchesDifficulty = (hash:string, difficulty: number): boolean  =>{
    const binaryHash:string = hexToBinary(hash);
    const requiredPrefix: string = '0'.repeat(difficulty);
    return binaryHash.startsWith(requiredPrefix);   
};





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
    const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimeStamp, blockData,0,0);
    addBlock(newBlock);
    broadcastLatest();
    return newBlock;
};

//Finding a block: to find a valid block hash we must increase the nonce as until we get a valid hash
//When the block is found, it is broadcasted to the network
const findBlock = (index:number, previousHash:string, timestamp:number, data:string, difficulty:number):Block =>{

    let nonce = 0;

    while (true) {
        const currHash: string = calculateHash(index, previousHash, timestamp, data);

        if (hashMatchesDifficulty(currHash, difficulty)){
            return new Block(index, currHash, previousHash, timestamp, data, difficulty, nonce);
        }

        nonce++;
    }
}





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