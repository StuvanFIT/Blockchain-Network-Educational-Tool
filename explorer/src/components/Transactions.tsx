
import React, {useState} from 'react';
import {FileText, Wallet, Copy, RefreshCw, Send, Pickaxe} from 'lucide-react';

// Transactions Page
export const Transactions = () => {

  const [activeTab, setActiveTab] = useState(''); //send or mine
  const [recipentAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMoney = () =>{



  }







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
          <div className='rounded-t-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6'>
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
                  <code className='text-sm bg-gray-200 p-2 rounded-lg font-mono'>
                    WalletAddressHashString10000000000000000000000000000000000000000.substring(0,30)
                  </code>

                  <button className='p-2 text-gray-500 hover:text-gray-700 transition-colors'>
                    <Copy className='w-5 h-5'/>
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-base font-medium text-gray-700 mb-2'>Your Current Balance</label>
                <div className='flex items-center gap-2'>
                  <span className="text-2xl font-bold text-green-600">250 coins</span>
                  <button

                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Refresh balance"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-base font-medium text-gray-700 mb-2'>Transaction Pool (No. of transactions)</label>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold text-red-600'>0</span>
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
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
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
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
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
                        value={recipentAddress}
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
                    disabled={isLoading || !recipentAddress || !amount}
                    className='w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-3 py-4 rounded-lg
                    hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed 
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
                <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                  <Pickaxe className='w-4 h-4 inline mr-2'/>
                  <span>Mine Blocks</span>
                </h2>
              )}

            </div>
          </div>
          
          {/* Sample Addresses */}
          <div className="p-6 border-t bg-blue-50">
            <h2 className="text-base font-semibold mb-2 text-blue-800">Sample Addresses for Testing</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "04b2c3d4e5f6789abc123def456789012345678901234567890123456789abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
                "04c3d4e5f6789abc123def456789012345678901234567890123456789abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12"
              ].map((addr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <code className="text-base bg-white p-2 rounded flex-1">{addr.substring(0, 40)}...</code>
                  <button
                    onClick={() => setRecipientAddress(addr)}
                    className="text-base text-blue-600 hover:text-blue-800"
                  >
                    <div className=' bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-500 rounded-lg text-white font-semibold px-3 py-1'>
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