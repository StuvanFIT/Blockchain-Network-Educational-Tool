import React, {useState, useEffect, useRef} from 'react';
import {FileText, Wallet, Copy, RefreshCw, Send, Pickaxe, AlertCircle, CheckCircle, Zap, Clock, Blocks, SquareLibrary } from 'lucide-react';
import { UnspentTxOut, validateTransaction, getCoinbaseTransaction, Transaction, COINBASE_AMOUNT, updateUnspentTxOuts } from '../blockchain/transaction';
import { getTransactionPool, addToTransactionPool, clearTransactionPool, updateTransactionPool } from '../blockchain/transactionPool';
import { mockWalletFunctions, mockUnspentTxOuts, getBalance, createTransaction, Block, getBlockchain, getLatestBlock, calculateHash, hashMatchesDifficulty, addNewBlock, updateUTXOsAfterMining, updateMockUTXO } from './Wallet';



// Transactions Page
export const Transactions = () => {

  const [activeTab, setActiveTab] = useState(''); //send or mine
  const [recipientAddress, setRecipientAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState(mockWalletFunctions.getPublicFromWallet());
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [transactionPool, setTransactionPool] = useState<Transaction[]>([]);
  const poolRef = useRef<Transaction[]>([]);

  const [blocksMined, setBlocksMined] = useState<Block[]>([]);
  const [isMining, setIsMining] = useState(false);
  const isMiningRef = useRef(false);
  const [miningTime, setMiningTime] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const hashRef = useRef('');
  const [difficulty, setDifficulty] = useState(5);
  const timestampRef = useRef(0);



  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() => {
    updateMockUTXO(mockUnspentTxOuts);
    setTransactionPool(getTransactionPool());
    setBlocksMined(getBlockchain());
  }, []);

  useEffect(() => {
    const currentBalance = getBalance(walletAddress, mockUnspentTxOuts);
    setBalance(currentBalance);
  }, [walletAddress, mockUnspentTxOuts]);

  const handleWalletAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const addressVal = e.target.value;
    setWalletAddress(addressVal);
  };


  const copyToClipboard = (text:string) => {
    navigator.clipboard.writeText(text);
  };
  const refreshBalance = () =>{
    const currentBalance = getBalance(walletAddress, mockUnspentTxOuts);
    setBalance(currentBalance);
  };





  /*

  When using secp256k1 (the elliptic curve used in Bitcoin and Ethereum), a public key can be represented in uncompressed format
  An uncompressed public key is 130 hex characters long:

  1 byte (2 hex chars) prefix → 04

  32 bytes (64 hex chars) x-coordinate

  32 bytes (64 hex chars) y-coordinate
  
  */
  const validateAddress = (address:string) =>{
    if (address.length !== 130){
      return false;
    };
    if (!address.match('^[a-fA-F0-9]+$')){
      return false;
    };

    if (!address.startsWith('04')){
      return false;
    };
    return true;
  };




  const handleSendMoney = async () =>{

    setTransaction(null);

    //Validate recipient address
    if (!recipientAddress){
      setError('Please enter in a recipient address. Have a look at the example addresses below!');
      return;
    }

    if (!validateAddress(recipientAddress)){
      setError('Invalid recipient address format.')
      return;
    }

    if (recipientAddress === walletAddress ){
      setError('You cannot send money to yourself.');
      return;
    }

    const sendAmount = parseFloat(amount);
    if (!sendAmount || sendAmount <=0){
      setError('Please enter in an amount of coins address.');
      return;
    };

    if (sendAmount > balance){
      setError('Insufficient balance!');
      return;
    };

    setIsLoading(true);

    try{

      await new Promise(resolve => setTimeout(resolve, 1500));

      const privateKey = mockWalletFunctions.getPrivateFromWallet();
      console.log('before transaction')

      const newTransaction = createTransaction(recipientAddress, sendAmount,privateKey, mockUnspentTxOuts,transactionPool);
      console.log('after transaction')
      //Add to the transaction pool
      if (addToTransactionPool(newTransaction, mockUnspentTxOuts)){
        setTransaction(newTransaction);
        setSuccess(`New Transaction was created and added to the pool! Transaction ID: ${newTransaction.id.substring(0,16)}`);

        setTransactionPool(getTransactionPool());
        poolRef.current = getTransactionPool();

        // Clear form
        setRecipientAddress('');
        setError('');
        setAmount('');
      } else {
        setError('Failed to add to transaction pool!');
      }

    } catch (error:any) {
      setError('Failed to create new transaction!' + error.message)
    } finally {
      setIsLoading(false);

    }

  }

  const handleMineBlock = async () =>{

    if (transactionPool.length ===0){
      setError('No transactions in the transaction pool!');
      return;
    }

    setIsMining(true);
    isMiningRef.current = true;
    setMiningTime(0);
    setError('');

    try{
      //Create a coinbase transaction:
      const blockIndex = blocksMined.length;
      const coinbaseTx = getCoinbaseTransaction(walletAddress,blockIndex);

      //Then, we create a new block with all the transactions in the pool + coinbase reward
      const blockTransactions = [coinbaseTx, ...transactionPool];

      const blockChain = getBlockchain();
      const latestBlock = getLatestBlock();
      const previousHash = latestBlock.hash; //this is gonna be the previous hash

      //calculate the hash of the new block
      let nonce =0

      while (true){
        const time = Date.now();
        const currHash = calculateHash(blockIndex, previousHash, time, blockTransactions, difficulty, nonce );
        if (hashMatchesDifficulty(currHash, difficulty)){
          hashRef.current = currHash;
          timestampRef.current = time;
          console.log('Found valid hash with matching difficulty!');
          break;
        }
        nonce++;
      }

      //Create new block
      const newBlock = new Block(blockIndex, hashRef.current, previousHash, timestampRef.current, blockTransactions, difficulty, nonce);

      //Add the new block
      addNewBlock(newBlock);

      //Clear transaction pool
      clearTransactionPool();

      // Update UTXOs FIRST
      const newUTXO = updateUnspentTxOuts(newBlock.data, mockUnspentTxOuts);
      console.log("pol")
      console.log(newUTXO)
      updateMockUTXO(newUTXO);
      
      // Then update all dependent state
      const updatedBalance = getBalance(walletAddress, newUTXO);
      const updatedBlockchain = getBlockchain();
      const updatedTransactionPool = getTransactionPool(); // Should be empty now
      
      // Update state in correct order
      setBalance(updatedBalance);
      setBlocksMined(updatedBlockchain);
      setTransactionPool(updatedTransactionPool);
      
      setSuccess(
        `Block #${blockIndex} mined successfully! ` +
        `Added ${blockTransactions.length} transactions to the blockchain. ` +
        `Earned ${COINBASE_AMOUNT} coins reward!`
      );



    } catch (err:any) {
      setError('Mining failed: ' + err.message);
    } finally {
      setIsMining(false);
      setHashRate(0);
      setMiningTime(0);

    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7x1 mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
              <p className="text-slate-500 mt-1">View and manage all transactions</p>
            </div>
          </div>
          <p className="text-slate-600">Transaction list and management interface would go here...</p>
        </div>
        
        <div className="mt-4 bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className='rounded-t-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6'>
            <div className='flex items-center gap-2'>
              <Wallet className='w-8 h-8' />
              <div>
                <h1 className='text-2x1 font-bold'>Cryptocurrency Wallet & Mining</h1>
                <p className='text-blue-100'>Send money and mine blocks!</p>
              </div>
            </div>
          </div>

          <div className='p-6 border-b bg-gray-100'>

            {/*Wallet information */}
            <div className='flex flex-col gap-4'>
              <div>
                <label className='block text-base font-medium text-gray-700 mb-2'>Your Wallet Address</label>
                <div className='mt-4 flex items-center gap-2'>
                  <input type='text' onChange={handleWalletAddress} value={walletAddress} className='w-full text-sm bg-gray-200 p-2 rounded-lg font-mono'>

                  </input>

                  <button className='p-2 text-gray-500 hover:text-gray-700 transition-colors'
                    onClick={() => copyToClipboard(walletAddress)}>
                    <Copy className='w-5 h-5'/>
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-base font-medium text-gray-700 mb-2'>Your Current Balance</label>
                <div className='flex items-center gap-2'>
                  <span className="text-2xl font-bold text-green-600">{balance} coins</span>
                  <button

                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Refresh balance"
                    onClick={refreshBalance}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-base font-medium text-gray-700 mb-2'>Transaction Pool (No. of transactions)</label>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold text-emerald-500'>{transactionPool.length}</span>
                  <span className='text-sm text-gray-500'>pending transactions...</span>
                </div>
              </div>
            </div>

            {/*Navigation tab bar: send money and mine block */}
            <div className='mt-8 border border-gray-300'>
              <nav className='flex'>
                <button
                  onClick={() => setActiveTab('send')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                    activeTab === 'send'
                    ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'

                  }`}
                >
                  <div className='flex items-center gap-2'>
                    <Send className='w-4 h-4 inline mr-2'/>
                    <span>Send Money</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('mine')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                    activeTab === 'mine'
                    ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'

                  }`}
                >
                  <div className='flex items-center gap-2'>
                    <Pickaxe className='w-4 h-4 inline mr-2'/>
                    <span>Mine Blocks</span>
                  </div>
                </button>
              </nav>
            </div>
            
            {/*Tab Content */}
            <div className='p-6'>
              {activeTab === 'send' && (
                <div>
                  <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                    <Send className='w-4 h-4 inline mr-2'/>
                    <span>Send Money</span>
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label htmlFor='recipent' className='block text-sm font-medium text-gray-700 mb-2'> Recipent Address *</label>
                      <input
                        type='text'
                        id='recipent'
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        placeholder='04a1b2c3d4e5f6789abc123def456789...'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm' 
                        disabled={isLoading}
                      ></input>
                    </div>

                    <div className='relative'>
                      <label htmlFor='amount' className='block text-sm font-medium text-gray-700 mb-2'>  Amount *</label>
                      <input
                        type='number'
                        id='amount'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder='0.00'
                        min="0"
                        step="0.01"
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm' 
                        disabled={isLoading}
                      ></input>
                      <span className='absolute right-9 top-1/2 text-gray-500 text-base'>coins</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSendMoney}
                    disabled={isLoading || !recipientAddress || !amount}
                    className='w-full mt-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-3 py-4 rounded-lg
                    hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed 
                    transition-all duration-200 flex items-center justify-center gap-2'>


                    {isLoading ? (

                      <div className='flex items-center gap-2'>
                        <RefreshCw className='w-4 h-4 animate-spin'/>
                        Creating Transaction...
                      </div>
                    ): (

                     <div className='flex items-center gap-2'>
                        <Send className='w-4 h-4'/>
                        Send Money
                      </div>

                    )}
                  </button>
                </div>
              )}

              {activeTab === 'mine' && (
                <div>
                  <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                    <Pickaxe className='w-4 h-4 inline mr-2'/>
                    <span>Mine Blocks</span>
                  </h2>

                  <div className='space-y-4'>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                      <h3 className='font-semibold mb-2'>Mining Status</h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='text-base text-gray-500'>Transactions in Pool:</span>
                          <span className='text-xl font-medium'>{transactionPool.length}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-base text-gray-500'>Blocks Mined:</span>
                          <span className='text-xl font-medium'>{blocksMined.length}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-base text-gray-500'>Difficulty:</span>
                          <span className='text-xl font-medium'>{difficulty}</span>
                        </div>  

                        {isMining && (

                          <>
                            <div className='flex justify-between'>
                              <span className='text-base text-gray-500'>Hash Rate:</span>
                              <span className='text-xl font-medium'>{hashRate.toLocaleString()} H/s</span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-base text-gray-500'>Mining Time:</span>
                              <span className='text-xl font-medium'>{miningTime}s</span>
                            </div>                      
                          </>


                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleMineBlock}
                      disabled={isMining || transactionPool.length === 0}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-4 rounded-lg font-semibold 
                              hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed 
                              transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {isMining ? (
                        <>
                          <Zap className="w-4 h-4 animate-pulse" />
                          Mining Block...
                        </>
                      ) : (
                        <>
                          <Pickaxe className="w-4 h-4" />
                          Mine Block ({transactionPool.length} txns)
                        </>
                      )}
                    </button>

                    {transactionPool.length ===0 &&(
                      <p className='text-sm text-gray-500 text-center'>No transactions in the pool. Send money to create transactions for mining!</p>
                    )}
                  </div>
                  
                  {/*Transaction pool */}
                  <div>
                    <h3 className='font-semibold mt-8 mb-2 flex items-center gap-2'>
                      <SquareLibrary className='w-4 h-4'/>
                      Transaction Pool
                    </h3>
                    <div className='bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto'>
                      {transactionPool.length ===0 ? (
                        <p className='text-sm text-gray-500'>No Pending Transactions</p>
                      ): (
                        <div className='space-y-2'>
                          {transactionPool.map((tx,idx) => (
                          <div key={idx} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-start">
                              <div>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {tx.id.substring(0, 16)}...
                                </code>
                                <p className="text-xs text-gray-500 mt-1">
                                  {tx.txOuts.length} output(s)
                                </p>
                              </div>
                              <Clock className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {blocksMined.length >0 && (
                      <div className='mt-6'>
                        <h3 className='flex items-center font-semibold gap-2'>
                          <Blocks className='w-4 h-4' />
                          Blockchain ({blocksMined.length} blocks)
                        </h3>
                        <div className="space-y-2 mt-4 max-h-60 overflow-y-auto">
                          {blocksMined.map((block: Block, idx) => (
                            <div key={idx} className="bg-green-50 border border-green-200 p-3 rounded">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">Block #{block.index}</span>
                                    <code className="text-xs bg-green-100 px-2 py-1 rounded">
                                      {block.hash.substring(0, 16)}...
                                    </code>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {block.data.length} transactions
                                  </p>
                                </div>
                                <span className={`text-xs ${idx===0 ? " bg-blue-600 p-2 text-white rounded-lg text-blue-600 font-bold":"text-green-600 font-bold"}`}>
                                  {idx===0 ? 'Genesis Block': `+${COINBASE_AMOUNT} coins`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}




                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {(error || success) && (
            <div className="p-6 border-t">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Sample Addresses */}
          <div className="p-6 border-t bg-green-50">
            <h2 className="text-base font-semibold mb-2 text-emerald-800">Sample Addresses for Testing</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "04c1d2e3f4a5b6c7d8e9fa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef01",
                "04c3d4e5f6789abc123def456789012345678901234567890123456789abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12"
              ].map((addr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <code className="text-base bg-white p-2 rounded flex-1">{addr.substring(0, 40)}...</code>
                  <button
                    onClick={() => setRecipientAddress(addr)}
                    className="text-base text-blue-600 hover:text-blue-800"
                  >
                    <div className=' bg-gradient-to-r from-green-600 to-emerald-600 border border-blue-500 rounded-lg text-white font-semibold px-3 py-1'>
                      Use
                    </div>
                    
                  </button>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};