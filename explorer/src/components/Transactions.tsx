import React, {useState, useEffect, useRef} from 'react';
import {FileText, Wallet, Copy, RefreshCw, Send, Pickaxe, AlertCircle, CheckCircle, Zap, Clock, Blocks, SquareLibrary, LocationEdit, Check} from 'lucide-react';
import { UnspentTxOut, validateTransaction, getCoinbaseTransaction, Transaction, COINBASE_AMOUNT, updateUnspentTxOuts } from '../blockchain/transaction';
import { getTransactionPool, addToTransactionPool, clearTransactionPool, updateTransactionPool } from '../blockchain/transactionPool';

//Import Subscription
import { useWalletStore } from '../stores/WalletStore';
import { useBlockchainStore, Block, createTransaction } from '../stores/BlockChainStore';
import { generatePrivateKey } from '../stores/WalletStore';


// Transactions Page
const Transactions = () => {
  //use the wallest store
  const {
    publicKey: walletAddress,
    privateKey,
    balance,
    utxos,
    exampleWallets,
    transactionPool: storeTransactionPool,
    setPublicKey,
    setPrivateKey,
    updateUTXOs,
    recalculateAllBalances,
    addTransaction,
    clearTransactionPool: clearStoreTransactionPool,
    updateBalance
  } = useWalletStore();

  //use the blockchain store
  const {
    addNewBlock,
    getLatestBlock,
    getBlockchain,
    calculateHash,
    hashMatchesDifficulty,
    updateUTXOsAfterMining
  } = useBlockchainStore();
 


  const [activeTab, setActiveTab] = useState(''); //send or mine
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const poolRef = useRef<Transaction[]>([]);

  const [blocksMined, setBlocksMined] = useState<Block[]>([]);
  const [isMining, setIsMining] = useState(false);
  const isMiningRef = useRef(false);
  const [miningTime, setMiningTime] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const hashRef = useRef('');
  const [difficulty, setDifficulty] = useState(5);
  const timestampRef = useRef(0);
  const [copied, setCopied] = useState(false);



  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() =>{
    poolRef.current = storeTransactionPool;
  }, [storeTransactionPool]);

  useEffect(() => {
    // Initialize with blockchain data
    setBlocksMined(getBlockchain());
  }, []);


  const handleWalletAddress = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const addressVal = e.target.value;

    //Set the public key
    setPublicKey(addressVal);

    //Set the private key
    setPrivateKey('None');

    for (let i=0; i< exampleWallets.length; i++){
      let currWallet = exampleWallets[i];

      if (currWallet.publicKey === addressVal){
        setPrivateKey(currWallet.privateKey);
        console.log(currWallet.privateKey)
      };
    };
    console.log(privateKey)



  };



  const copyToClipboard = (text:string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };
  const refreshBalance = () =>{
    updateBalance();
  };

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
      setError('You cannot send money to yourself. Select a different wallet.');
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

      console.log('before transaction')
      const newTransaction = createTransaction(recipientAddress, sendAmount,walletAddress,privateKey, walletAddress,utxos,storeTransactionPool);
      console.log('after transaction')

      //Add to the transaction pool
      if (addToTransactionPool(newTransaction, utxos)){
        setTransaction(newTransaction);
        addTransaction(newTransaction);

        setSuccess(`New Transaction was created and added to the pool! Transaction ID: ${newTransaction.id.substring(0,16)}`);


        // Clear form
        setRecipientAddress('');
        setError('');
        setAmount('');
      } else {
        setError('Failed to add to transaction pool!');
      }

    } catch (error: any) {
      setError('Failed to create new transaction!' + error.message)
    } finally {
      setIsLoading(false);

    }

  }

  const handleMineBlock = async () =>{

    if (storeTransactionPool.length ===0){
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
      const blockTransactions = [coinbaseTx, ...storeTransactionPool];
      
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
      clearStoreTransactionPool();

      // Retrieve the new UTXOs and Update UTXOs FIRST
      const newUTXO = updateUTXOsAfterMining(newBlock, utxos);
      updateUTXOs(newUTXO); //this updates the UTXOS but also the balance
      recalculateAllBalances(); //updates wallet balances
      
    
      const updatedBlockchain = getBlockchain();
      setBlocksMined(updatedBlockchain);
      
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
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
      <div className="max-w-7x1 mx-auto space-y-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-slate-500/50 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Transactions</h1>
              <p className="text-slate-300 mt-1">View and manage all transactions</p>
            </div>
          </div>
          <p className="text-white">Transaction list and management interface would go here...</p>
        </div>
        
        <div className="mt-4 bg-slate-800/70 rounded-xl shadow-2xl overflow-hidden">
          <div className='rounded-t-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6'>
            <div className='flex items-center gap-2'>
              <Wallet className='w-8 h-8' />
              <div>
                <h1 className='text-2x1 font-bold'>Cryptocurrency Wallet & Mining</h1>
                <p className='text-blue-100'>Send money and mine blocks!</p>
              </div>
            </div>
          </div>

          <div className='p-6 border-b border-slate-600/50 bg-slate-800/70'>
            {/*Wallet information */}
            <div className='flex flex-col gap-4'>
              <div>
                <label className='block text-base font-medium text-white mb-2'>Your Wallet Address</label>
                <div className='mt-4 flex items-center gap-2'>
                  <select onChange={handleWalletAddress} value={walletAddress} className='w-full text-sm bg-slate-700/80 text-white p-2 rounded-lg font-mono border border-slate-600/50'>

                    {exampleWallets.map((wallet, index) => (
                      <option key={`sender-${wallet.publicKey}`} value={wallet.publicKey} className="bg-slate-700 text-white">{wallet.name}: {wallet.publicKey}</option>
                    ))}
                  </select>

                  <button className='p-2 text-slate-300 hover:text-white transition-colors'
                    onClick={() => copyToClipboard(walletAddress)}>
                    <Copy className='w-5 h-5'/>
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-base font-medium text-white mb-2'>Your Current Balance</label>
                <div className='flex items-center gap-2'>
                  <span className="text-2xl font-bold text-green-400">{balance} BTC</span>
                  <button

                    className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Refresh balance"
                    onClick={refreshBalance}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-base font-medium text-white mb-2'>Transaction Pool (No. of transactions)</label>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold text-emerald-400'>{storeTransactionPool.length}</span>
                  <span className='text-sm text-slate-300'>pending transactions...</span>
                </div>
              </div>
            </div>

            {/*Navigation tab bar: send money and mine block */}
            <div className='mt-8 border border-slate-300/50 rounded-lg overflow-hidden'>
              <nav className='flex'>
                <button
                  onClick={() => setActiveTab('send')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                    activeTab === 'send'
                    ? 'bg-green-500/20 text-green-400 border-b-2 border-green-500'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/50'

                  }`}
                >
                  <div className='flex items-center justify-center gap-2'>
                    <Send className='w-4 h-4'/>
                    <span>Send Money</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('mine')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                    activeTab === 'mine'
                    ? 'bg-green-500/20 text-green-400 border-b-2 border-green-500'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/50'

                  }`}
                >
                  <div className='flex items-center justify-center gap-2'>
                    <Pickaxe className='w-4 h-4'/>
                    <span>Mine Blocks</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Messages */}
            {(error || success) && (
              <div className="p-6 border-t border-slate-600/50">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 mb-2 break-all">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-900/30 border border-green-700/50 rounded-lg text-green-300 break-all">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}
              </div>
            )}
            
            {/*Tab Content */}
            <div className='p-6'>
              {activeTab === 'send' && (
                <div>
                  <h2 className='text-xl font-semibold mb-4 flex items-center gap-2 text-white'>
                    <Send className='w-4 h-4 inline mr-2'/>
                    <span>Send Money</span>
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label htmlFor='recipient' className='block text-sm text-white font-medium mb-2'> Recipient Address *</label>
                      <select
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className='w-full p-2 bg-slate-700/80 text-white border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm' 
                        disabled={isLoading}
                      >
                        <option value="" className="bg-slate-700">Select a Wallet...</option>
                        {exampleWallets.map((wallet, index) => (
                          <option key={`recipient-${wallet.publicKey}`} value={wallet.publicKey} className="bg-slate-700">{wallet.name}: {wallet.publicKey}</option>
                        ))}
                      </select>
                    </div>

                    <div className='relative'>
                      <label htmlFor='amount' className='block text-sm text-white font-medium mb-2'>  Amount *</label>
                      <input
                        type='number'
                        id='amount'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder='0.00'
                        min="0"
                        step="0.01"
                        className='w-full p-3 bg-slate-700/80 text-white border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm placeholder-slate-400' 
                        disabled={isLoading}
                      ></input>
                      <span className='absolute right-9 top-1/2 text-slate-400 text-base'>coins</span>
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
                  <h2 className='text-xl font-semibold mb-4 flex items-center gap-2 text-white'>
                    <Pickaxe className='w-4 h-4 inline mr-2'/>
                    <span>Mine Blocks</span>
                  </h2>

                  <div className='space-y-4'>
                    <div className='bg-slate-800/60 border border-slate-600/50 p-4 rounded-lg'>
                      <h3 className='font-semibold mb-2 text-white'>Mining Status</h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='text-base text-slate-300'>Transactions in Pool:</span>
                          <span className='text-xl font-medium text-white'>{Array.isArray(storeTransactionPool) ?storeTransactionPool.length : 'Invalid transaction pool'}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-base text-slate-300'>Blocks Mined:</span>
                          <span className='text-xl font-medium text-white'>{blocksMined.length}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-base text-slate-300'>Difficulty:</span>
                          <span className='text-xl font-medium text-white'>{difficulty}</span>
                        </div>  

                        {isMining && (

                          <>
                            <div className='flex justify-between'>
                              <span className='text-base text-slate-300'>Hash Rate:</span>
                              <span className='text-xl font-medium text-white'>{hashRate.toLocaleString()} H/s</span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-base text-slate-300'>Mining Time:</span>
                              <span className='text-xl font-medium text-white'>{miningTime}s</span>
                            </div>                      
                          </>


                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleMineBlock}
                      disabled={isMining || (Array.isArray(storeTransactionPool) ?storeTransactionPool.length : 'Invalid Transaction pool') === 0}
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
                          Mine Block ({Array.isArray(storeTransactionPool) ?storeTransactionPool.length : 'Invalid transaction pool'} txns)
                        </>
                      )}
                    </button>

                    {(Array.isArray(storeTransactionPool) ?storeTransactionPool.length : 'Invalid transaction pool') ===0 &&(
                      <p className='text-sm text-slate-400 text-center'>No transactions in the pool. Send money to create transactions for mining!</p>
                    )}
                  </div>
                  
                  {/*Transaction pool */}
                  <div>
                    <h3 className='font-semibold mt-8 mb-2 flex items-center gap-2 text-white'>
                      <SquareLibrary className='w-4 h-4'/>
                      Transaction Pool
                    </h3>
                    <div className='bg-slate-800/60 border border-slate-600/50 p-4 rounded-lg max-h-60 overflow-y-auto'>
                      {(Array.isArray(storeTransactionPool) ?storeTransactionPool.length : 'Invalid transaction pool') ===0 ? (
                        <p className='text-sm text-slate-400'>No Pending Transactions</p>
                      ): (
                        <div className='space-y-2'>
                          {storeTransactionPool.map((tx,idx) => (
                          <div key={idx} className="bg-slate-700/60 border border-slate-600/50 p-3 rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <code className="text-xs bg-slate-600/60 text-slate-200 px-2 py-1 rounded">
                                  {tx.id.substring(0, 16)}...
                                </code>
                                <p className="text-xs text-slate-400 mt-1">
                                  {Array.isArray(tx.txOuts) ? `${tx.txOuts.length} outputs(s)`: `Invalid tx data!`}
                                </p>
                              </div>
                              <Clock className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      {blocksMined.length >0 && (
                        <div className='mt-6'>
                          <h3 className='flex items-center font-semibold gap-2 text-white'>
                            <Blocks className='w-4 h-4' />
                            Blockchain ({blocksMined.length} blocks)
                          </h3>
                          <div className="space-y-2 mt-4 max-h-60 overflow-y-auto">
                            {blocksMined.map((block: Block, idx) => (
                              <div key={idx} className="bg-green-900/30 border border-green-700/50 p-3 rounded">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-white">Block #{block.index}</span>
                                      <code className="text-xs bg-green-800/40 text-green-200 px-2 py-1 rounded">
                                        {block.hash.substring(0, 16)}...
                                      </code>
                                    </div>
                                    <p className="text-xs text-slate-300 mt-1">
                                      {Array.isArray(block.data) ? `${block.data.length} transactions` : 'Invalid block data'}
                                    </p>
                                  </div>
                                  <span className={`text-xs ${idx===0 ? "bg-blue-600 p-2 text-white rounded-lg font-bold":"text-green-400 font-bold"}`}>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export {Transactions}
