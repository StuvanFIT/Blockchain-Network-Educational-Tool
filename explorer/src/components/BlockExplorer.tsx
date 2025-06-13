import React, { useEffect, useState } from 'react';
import { Hash, Clock, ArrowRight, Coins, FileText } from 'lucide-react';


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

  useEffect(() => {
    fetch('http://localhost:3001/blocks')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setBlocks(data.reverse()); // newest first. 
        setSelectedBlock(data[data.length - 1]);
      });
  }, []);

  const formatHash = (hash: string, length = 8) => `${hash.slice(0, length)}...${hash.slice(-4)}`;
  const formatAddress = (address: string) => `${address.slice(0, 8)}...${address.slice(-6)}`;

  return (

    <div className="flex h-screen">
    {/* Sidebar */}
    <div className="w-80 bg-white shadow-xl border-r border-slate-200">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className='flex flex-col'>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Hash className="w-6 h-6" />
                    </div>
                    <div>
                    <h2 className="text-xl font-bold">Blockchain Explorer</h2>
                    <p className="text-blue-100 text-sm">{blocks.length} blocks</p>
                    </div>
                </div>
                <span className='mt-6 text-blue-100 text-sm'>Each card represents a block on the chain. Feel free to click on the block to see the transactions inside of it!  </span>
            </div>
        </div>
        
        {/*Block chain elements on left side */}
        <div className="overflow-y-auto h-full pb-6">
        {blocks.map((block, index) => (
            <div
            key={block.hash}
            onClick={() => setSelectedBlock(block)}
            className={`p-4 mx-3 mt-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedBlock?.hash === block.hash 
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-sm' 
                : 'bg-slate-50 hover:bg-white border border-slate-200'
            }`}
            >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-400' : 'bg-slate-300'}`} />
                <span className="font-bold text-slate-800">Block #{block.index}</span>
                </div>
                {index === 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Latest
                </span>
                )}
            </div>
            
            <div className="space-y-1 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                <Hash className="w-3 h-3" />
                <span className="font-mono">{formatHash(block.hash)}</span>
                </div>
                <div className="flex items-center gap-2">
                <FileText className="w-3 h-3" />
                <span>{block.data.length} transaction{block.data.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>

    {/* Block Details */}
    <div className="flex-1 p-8">
        {selectedBlock ? (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                <Hash className="w-8 h-8" />
                </div>
                <div>
                <h1 className="text-3xl font-bold text-slate-800">Block #{selectedBlock.index}</h1>
                <p className="text-slate-500 mt-1">Blockchain Block Details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <div>
                    <p className="text-sm font-medium text-slate-600">Timestamp</p>
                    <p className="font-mono text-slate-800">{new Date(selectedBlock.timestamp * 1000).toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <div>
                    <p className="text-sm font-medium text-slate-600">Transactions</p>
                    <p className="text-xl font-bold text-slate-800">{selectedBlock.data.length}</p>
                    </div>
                </div>
                </div>

                <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm font-medium text-slate-600 mb-2">Block Hash</p>
                    <p className="font-mono text-sm text-slate-800 break-all bg-white p-3 rounded-lg border">
                    {selectedBlock.hash}
                    </p>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm font-medium text-slate-600 mb-2">Previous Hash</p>
                    <p className="font-mono text-sm text-slate-800 break-all bg-white p-3 rounded-lg border">
                    {selectedBlock.previousHash}
                    </p>
                </div>
                </div>
            </div>
            </div>

            {/* Transactions */}
            <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Coins className="w-7 h-7 text-blue-600" />
                Transactions
            </h2>
            
            {selectedBlock.data.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg">No transactions in this block</p>
                </div>
            ) : (
                selectedBlock.data.map((tx, i) => (
                <div key={tx.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {i + 1}
                        </div>
                        <div>
                        <p className="text-sm font-medium text-slate-600">Transaction ID</p>
                        <p className="font-mono text-sm text-slate-800">{tx.id}</p>
                        </div>
                    </div>
                    </div>

                    <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Inputs */}
                        <div>
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            </div>
                            Inputs ({tx.txIns.length})
                        </h4>
                        <div className="space-y-3">
                            {tx.txIns.map((input, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                <Hash className="w-4 h-4 text-red-600" />
                                <div className="flex-1">
                                <p className="font-mono text-sm text-slate-700">
                                    {formatHash(input.txOutId)}:{input.txOutIndex}
                                </p>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>

                        {/* Arrow */}
                        <div className="hidden lg:flex items-center justify-center">
                        <ArrowRight className="w-8 h-8 text-slate-400" />
                        </div>

                        {/* Outputs */}
                        <div>
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            </div>
                            Outputs ({tx.txOuts.length})
                        </h4>
                        <div className="space-y-3">
                            {tx.txOuts.map((output, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                <Coins className="w-4 h-4 text-green-600" />
                                <div className="flex-1">
                                <p className="font-mono text-sm text-slate-700">
                                    Address: {formatAddress(output.address)}
                                </p>
                                <p className="text-sm font-semibold text-green-700 mt-1">
                                    Total Amount: {output.amount} coins
                                </p>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                ))
            )}
            </div>
        </div>
        ) : (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-xl text-slate-500">Select a block to view details</p>
            <p className="text-slate-400 mt-2">Choose a block from the sidebar to explore its transactions</p>
            </div>
        </div>
        )}
    </div>
    </div>
  );
};

export default BlockExplorer;