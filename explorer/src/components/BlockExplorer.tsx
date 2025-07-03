import React, { useEffect, useState } from 'react';
import { Hash, Clock, Coins, FileText, Database } from 'lucide-react';
import { useBlockchainStore } from '../stores/BlockChainStore';


type TxIn = { txOutId: string; txOutIndex: number; signature: string };
type TxOut = { address: string; amount: number };
type Transaction = { id: string; txIns: TxIn[]; txOuts: TxOut[] };

type Block = {
  index: number;
  timestamp: number;
  previousHash: string;
  hash: string;
  data: Transaction[];
};

const BlockExplorer = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const {blockchain}  = useBlockchainStore();

  useEffect(() => {
    const currBlockChain = [...blockchain].reverse();
    setBlocks(currBlockChain);
    setSelectedBlock(currBlockChain[0]);
  }, [blockchain]);

  const formatHash = (hash: string, length = 8) => `${hash.slice(0, length)}...${hash.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden ">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-96 bg-slate-800/90 backdrop-blur-sm shadow-2xl border-r border-slate-600/50 flex flex-col">
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Blockchain Explorer</h1>
                <p className="text-blue-100 text-sm opacity-90">{blocks.length} blocks mined</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed opacity-90">
              Head to the 'Create Transactions' page and send money! You should see your new block down below!
            </p>
            <br/>
            <p className="text-blue-100 text-sm leading-relaxed opacity-90">
              Explore blocks and transactions on the blockchain. Click any block to view its details.
            </p>
          </div>
          
          {/* Block List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {blocks.map((block, index) => (
              <div
                key={block.hash}
                onClick={() => setSelectedBlock(block)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                  selectedBlock?.hash === block.hash 
                    ? 'bg-slate-700/80 border-cyan-400/60 shadow-lg' 
                    : 'bg-slate-800/60 border-slate-600/40 hover:bg-slate-700/70 hover:border-slate-500/60 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-emerald-400 shadow-sm' : 'bg-gray-300'}`} />
                    <span className="font-semibold text-white">Block #{block.index}</span>
                  </div>
                  {index === 0 && (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      Latest
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Hash className="w-3.5 h-3.5" />
                    <span className="font-mono text-xs">{formatHash(block.hash, 10)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{block.data.length} transaction{block.data.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(block.timestamp * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedBlock ? (
            <div className="p-8 max-w-6xl mx-auto">
              {/* Block Header */}
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-slate-600/40">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg">
                    <Hash className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Block #{selectedBlock.index}</h2>
                    <p className="text-gray-300 mt-1">Block details and transactions</p>
                  </div>
                </div>

                {/* Block Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-white">Timestamp</span>
                    </div>
                    <p className="font-mono text-sm text-gray-300">{new Date(selectedBlock.timestamp * 1000).toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600/30">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-white">Transactions</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-300">{selectedBlock.data.length}</p>
                  </div>

                  <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Hash className="w-5 h-5 text-purple-400" />
                      <span className="text-sm font-medium text-white">Block Index</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-300">#{selectedBlock.index}</p>
                  </div>

                  <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Coins className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-white">Total BTC</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-300">
                      {selectedBlock.data.reduce((sum, tx) => sum + tx.txOuts.reduce((txSum, out) => txSum + out.amount, 0), 0)}
                    </p>
                  </div>
                </div>

                {/* Hash Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-600/30">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Block Hash
                    </h4>
                    <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-500/40">
                      <p className="font-mono text-sm text-gray-300 break-all leading-relaxed">
                        {selectedBlock.hash}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-600/30">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Previous Hash
                    </h4>
                    <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-500/40">
                      <p className="font-mono text-sm text-gray-300 break-all leading-relaxed">
                        {selectedBlock.previousHash}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Coins className="w-7 h-7 text-sky-300" />
                  <h3 className="text-2xl font-bold text-white">Transactions</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {selectedBlock.data.length}
                  </span>
                </div>
                
                {selectedBlock.data.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">No Transactions</h4>
                    <p className="text-gray-300">This block contains no transactions</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedBlock.data.map((tx, i) => (
                      <div key={tx.id} className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-600/40 overflow-hidden">
                        {/* Transaction Header */}
                        <div className="bg-slate-700/50 p-6 border-b border-slate-600/40">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">Transaction #{i + 1}</h4>
                              <p className="font-mono text-sm text-gray-300 break-all">{tx.id}</p>
                            </div>
                          </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Inputs */}
                            <div>
                              <h5 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                                </div>
                                Inputs ({tx.txIns.length})
                              </h5>
                              <div className="space-y-3">
                                {tx.txIns.map((input, idx) => (
                                  <div key={idx} className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                                    <div className="flex items-start gap-3">
                                      <Hash className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1 space-y-2 min-w-0">
                                        <p className="font-mono text-sm text-gray-300 break-all">
                                          TXOUT ID: {(input.txOutId)}
                                        </p>
                                        <p className="font-mono text-sm text-gray-300 break-all">
                                          TXOUT INDEX: {input.txOutIndex}
                                        </p>
                                        <p className="text-base text-gray-300 mt-1">Output Reference</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>


                            {/* Outputs */}
                            <div>
                              <h5 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                </div>
                                Outputs ({tx.txOuts.length})
                              </h5>
                              <div className="space-y-3">
                                {tx.txOuts.map((output, idx) => (
                                  <div key={idx} className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-500/30">
                                    <div className="flex items-start gap-3">
                                      <Coins className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="font-mono text-sm text-gray-300 break-all mb-2">
                                          RECIPIENT ADDRESS: {(output.address)}
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <span className="text-base text-gray-300">Amount:</span>
                                          <span className="font-bold text-emerald-700">{output.amount} BTC</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Hash className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">Select a Block</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Choose a block from the sidebar to explore its transactions and details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockExplorer;