import React, {useCallback, useEffect, useState} from 'react';
import { Transaction } from '../blockchain/transaction';
import { Network, Users, Plus, Link, Server, Wifi, WifiOff, Pickaxe, Database, Link2, MessageCircle, Activity, X, RefreshCcw } from 'lucide-react';
import { update } from 'lodash';

interface Block {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: string;
  difficulty: number;
  nonce: number;
}

interface Peer {
    id: string,
    name: string,
    blockchain: Block[],
    transactionPool: Transaction[],
    connected: boolean,
    connections: string[],
    color: string
}

// Utility functions
const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

const createGenesisBlock = (): Block => ({
  index: 0,
  hash: generateHash('genesis'),
  previousHash: '0',
  timestamp: Date.now(),
  data: 'Genesis Block',
  difficulty: 0,
  nonce: 0
});


const createBlock = (prevBlock: Block |undefined, data: string, difficulty:number, nonce: number): Block => {
  const newBlock: Block = {
    index: (prevBlock?.index ?? -1) + 1,
    hash: '',
    previousHash: (prevBlock?.hash ?? '0'),
    timestamp: Date.now(),
    data: data,
    difficulty: difficulty,
    nonce: nonce
  };
  newBlock.hash = generateHash(`${newBlock.index}${newBlock.previousHash}${newBlock.timestamp}${newBlock.data}`);
  return newBlock;
};

const peerColors = [
  'bg-blue-500', 'bg-green-600', 'bg-purple-500', 'bg-red-500', 
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

const initialPeers: Peer[] = [
    {
        id: '1',
        name: 'Steven',
        blockchain: [createGenesisBlock()],
        transactionPool: [],
        connected: true,
        connections: ['2'],
        color: peerColors[0]
    },
    {
        id: '2',
        name: 'Jason',
        blockchain: [createGenesisBlock()],
        transactionPool: [],
        connected: true,
        connections: ['1', '3'],
        color: peerColors[1]
    },
    {
        id: '3',
        name: 'Mike',
        blockchain: [createGenesisBlock()],
        transactionPool: [],
        connected: true,
        connections: ['1','2'],
        color: peerColors[2]
    }
];

const PeerToPeerNetwork = () => {
    //Add activity to network activoty log
    const addActivity = useCallback((message:string) =>{
        setNetworkActivity(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev]);
    },[])

    //Peers/Nodes
    const [peers, setPeers] = useState<Peer[]>(() => {
        try {
            const storagePeers = localStorage.getItem('peers');

            if (!storagePeers) {
                addActivity("Network intialised with 3 default peers.")
            };
            return storagePeers ? JSON.parse(storagePeers) : initialPeers;
        } catch (error) {
            console.warn('Error parsing peers from localStorage: ', error);
            return initialPeers;
        }
    });

    //Current selected peer
    const [selectedPeer, setSelectedPeer] = useState(() => {
        try {
            const storageSelectedPeer = localStorage.getItem('selectedPeer');
            return storageSelectedPeer ? storageSelectedPeer : ''

        } catch (error) {
            console.warn('Error parsing selected peer from localStorage: ', error);
            return ''
        }
    });

    //Network activity
    const [networkActivity, setNetworkActivity] = useState<string[]>(() =>{
        try {
            const storageNetworkActivity = localStorage.getItem('networkActivity');
            return storageNetworkActivity ? JSON.parse(storageNetworkActivity) : [];

        } catch (error) {
            console.warn('Error parsing network activity from localStorage: ', error);
            return [];
        }
    });

    const [newPeerName, setNewPeerName] = useState(''); // New added peer/node
    const [newBlockData, setNewBlockData] = useState(''); //Mined block Data
    const [showActivityLog, setShowActivityLog] =useState(false);
    const [autoSync, setAutoSync] = useState(false);


    let selectedPeerData: Peer | undefined = peers.find(p => p.id === selectedPeer);


    useEffect(() =>{
        const newSelectedPeer = peers.find(p => p.id === selectedPeer);
        selectedPeerData = newSelectedPeer;
    }, [selectedPeer])

    //Peers to localStorage
    useEffect(() => {
        localStorage.setItem('peers', JSON.stringify(peers));
    }, [peers]);

    //SelectedPeer to localStorage
    useEffect(() => {
        localStorage.setItem('selectedPeer', selectedPeer);
    }, [selectedPeer]);

    //networkActivity to localStorage
    useEffect(() => {
        localStorage.setItem('networkActivity',JSON.stringify(networkActivity));
    }, [networkActivity]);

    // Auto-sync functionality
    useEffect(() => {
        if (!autoSync) return;
        
        const interval = setInterval(() => {
            syncAllPeers();
        }, 3000);
        
        return () => clearInterval(interval);
    }, [autoSync, peers]);

    const addPeer = () => {

        //If no new peer name was entered:
        if (!newPeerName.trim()){
            return;
        };

        //Create new Peer object
        const newPeer: Peer = {
            id: Date.now().toString(),
            name: newPeerName,
            blockchain: [createGenesisBlock()],
            transactionPool: [],
            connected: true,
            connections: peers.length > 0 ? [peers[0].id] : [],
            color: peerColors[peers.length % peerColors.length]
        };

        //Set new Peer
        setPeers(prev => {
            const updated = [...peers, newPeer];

            // Connect the first peer to the new peer
            if (prev.length > 0) {
                updated[0] = { ...updated[0], connections: [...updated[0].connections, newPeer.id] };
            }
            return updated;
        });

        setNewPeerName('');
        setSelectedPeer(newPeer.id);
        addActivity(`New Peer ${newPeer.name} has joined the network!`);
    };

    const togglePeerConnection = (peerId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPeers(prev => prev.map(peer => {
        if (peer.id === peerId) {
            const newStatus = !peer.connected;
            addActivity(`${peer.name} ${newStatus ? 'connected to' : 'disconnected from'} the network`);
            return { ...peer, connected: newStatus };
        }
        return peer;
        }));
    };

    const mineNewBlock = () => {
        if (!newBlockData.trim()) return;

        let minedMessage:string = '';

        const updatedPeers = peers.map(peer => {
            if (peer.id === selectedPeerData?.id){
                const lastBlock = peer.blockchain[peer.blockchain.length -1];
                const newMinedBlock = createBlock(lastBlock, newBlockData, 5, 5);
                minedMessage = `${peer.name} mined a new block: "${newBlockData}"`;
                return { ...peer, blockchain: [...peer.blockchain, newMinedBlock] };
            }
            return peer;
        })

        //Set updated peers
        setPeers(updatedPeers);
        addActivity(minedMessage);
        setNewBlockData('');
    };

    const syncPeerWithNetwork = (peerId: string) => {
        if (!peerId) return;

        let newPeers = [...peers];
        const peerData = newPeers.find(p => p.id === peerId);
        
        if (!peerData || !peerData.connected) {
            addActivity(`Cannot sync ${peerData?.name || 'unknown peer'} - peer not found or disconnected`);
            return;
        }

        // Find the longest blockchain among the selected peer's connections
        let longestChain = peerData.blockchain;
        let sourcePeer = '';

        peerData.connections.forEach(connId => {
            const connectedPeer = newPeers.find(p => p.id === connId);
            if (connectedPeer && connectedPeer.connected && 
                connectedPeer.blockchain.length > longestChain.length) {
                longestChain = connectedPeer.blockchain;
                sourcePeer = connectedPeer.name;
            }
        });

        // Update the selected peer with the longest chain
        newPeers = newPeers.map(peer => {
            if (peer.id !== peerId) return peer;
            
            if (longestChain !== peer.blockchain) {
                addActivity(`${peer.name} synced blockchain from ${sourcePeer} (${longestChain.length} blocks)`);
                return { ...peer, blockchain: [...longestChain] };
            }
            
            return peer;
        });

        // Check if any sync happened
        const originalPeer = peers.find(p => p.id === peerId);
        const updatedPeer = newPeers.find(p => p.id === peerId);
        
        if (originalPeer && updatedPeer && 
            originalPeer.blockchain.length === updatedPeer.blockchain.length) {
            addActivity(`${peerData.name} attempted sync but already had the longest chain.`);
        }

        // Actually update the state!
        setPeers(newPeers);
    };

    const syncAllPeers = () => {
        let changed = false;
        //We have a local copy of the peers, having the updated version of peers each iteration
        let newPeers = [...peers];

        do {
            changed = false;

            newPeers = newPeers.map(peer => {
                if (!peer.connected) return peer;

                let longestChain = peer.blockchain;
                let sourcePeer = '';

                peer.connections.forEach(connId => {
                    const connectedPeer = newPeers.find(p => p.id === connId);
                    if (connectedPeer && connectedPeer.blockchain.length > longestChain.length) {
                        longestChain = connectedPeer.blockchain;
                        sourcePeer = connectedPeer.name;
                    }
                });

                if (longestChain !== peer.blockchain) {
                    addActivity(`${peer.name} synced blockchain from ${sourcePeer} (${longestChain.length} blocks)`);
                    changed = true;
                    return { ...peer, blockchain: [...longestChain] };
                }

                return peer;
            });
        } while (changed);

        setPeers(newPeers);
    };




    return (
        <div className='p-8 bg-gray-50 min-h-screen'>
            <div className='max-w-7xl mx-auto space-y-8'>
                <div className='bg-white rounded-2xl shadow-lg p-8 border border-slate-200'>
                    <div className='flex items-center gap-4 mb-6'>
                        <div className='bg-gradient-to-r from-cyan-400 to-sky-600 rounded-lg text-white p-3'>
                            <Network className='w-8 h-8'/>
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold text-slate-800'> P2P Blockchain Network</h1>
                            <p className="text-slate-500 mt-1">Add and connect to peers!</p>
                        </div>
                    </div>
                    <p className='text-slate-600'>Click on any peer node to view its blockchain. Nodes sync with connected peers automatically.</p>
                </div>

                <div className='mt-4 space-y-8 bg-white rounded-xl shadow-2xl p-8 border border-slate-200'>
                    {/*Network nodes title */}
                    <div className='flex items-center gap-2'>
                        <Users className='w-6 h-6' />
                        <p className='text-xl font-semibold '>Network Nodes (Peers)</p>
                    </div>
                    {/*Add new peer buttons */}
                    <div className='flex items-center gap-6'>
                        <div>
                            <input
                                type= "text"
                                placeholder= 'Node Name...'
                                value={newPeerName}
                                onChange={(e) => setNewPeerName(e.target.value)}
                                className='px-3 py-3 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                            />
                        </div>
                        <div>
                            <button
                                onClick={addPeer}
                                className='bg-cyan-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-500 flex items-center gap-1 text-sm'
                            >
                                <div className='flex items-center gap-2'>
                                    <Plus className='w-4 h-4' />
                                    Add New Peer
                                </div>
                            </button>
                        </div>
                        <div>
                            <button
                            onClick={syncAllPeers}
                                className='bg-cyan-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-500 flex items-center gap-1 text-sm'
                            >
                                <div className='flex items-center gap-2'>
                                    <Link className='w-4 h-4' />
                                    Sync All Nodes
                                </div>
                            </button>
                        </div>
                        <label className='flex items-center gap-2 text-sm'>
                            <input 
                                type="checkbox"
                                className='rounded w-5 h-5'
                                checked={autoSync}
                                onChange={(e)=> setAutoSync(e.target.checked)}
                            />
                            <p className='text-base'>Auto Sync Nodes</p>
                            
                        </label>
                    </div>

                    {/*Peer icons */}
                    <div className='flex flex-wrap gap-8'>
                        {peers.map(peer => (

                            <div
                                key={peer.id}
                                className= {`relative cursor-pointer transition-all duration-5 ${
                                    selectedPeer === peer.id ? 'transform scale-110': 'hover:transform hover:scale-105'
                                }`}
                                onClick={() => setSelectedPeer(peer.id)}
                            >
                                {/*Peer bubble */}
                                <div className={`relative w-16 h-16 ${peer.color} rounded-full flex items-center justify-center shadow-lg ${selectedPeer == peer.id ? 'outline outline-4 outline-indigo-600 animate-pulse': '' }`}>
                                    <Server className='text-white' />

                                    {/*Wifi circle */}
                                    <button title={peer.connected ? 'Disconnect' : 'Connect'} onClick={(e) => togglePeerConnection(peer.id, e)} className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center 
                                        ${peer.connected ?'bg-green-400': 'bg-red-400'}
                                    `}>
                                        {/*Wifi icon */}
                                        {peer.connected ? <Wifi className='w-3 h-3 text-white' /> : <WifiOff className='w-3 h-3 text-white'/>}

                                    </button>
                                    {/*Block chain length for peer */}
                                    <div className='absolute -bottom-1 -right-1 bg-white text-xs font-bold text-gray-700 rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-200'>
                                        {peer.blockchain.length}
                                    </div>
                                </div>

                                <div className="text-center mt-2">
                                    <div className="text-sm font-medium text-gray-800">{peer.name}</div>
                                    <div className="text-xs text-gray-500">
                                    {peer.connections.length} connections
                                    </div>
                                </div>
                            </div>


                        ))}
                    </div>
                </div>

    
                {selectedPeerData ? (
                    <div className='mt-4 space-y-12 bg-white rounded-xl shadow-2xl p-8 border border-slate-200'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-2xl font-semibold text-gray-800 flex items-center gap-3'>
                                <div className= {`${selectedPeerData.color} p-4 rounded-full`}>
                                    <Server className='text-white' />
                                </div>
                                {selectedPeerData.name}'s Blockchain
                                <span className='text-sm font-normal text-gray-500'>
                                    {selectedPeerData.blockchain.length > 1  ? `(${selectedPeerData.blockchain.length} blocks)` : `(${selectedPeerData.blockchain.length} block)` }
                                </span>
                            </h2>
                        </div>

                        <div className={`w-full p-8 ${selectedPeerData.color} bg-opacity-20 rounded-lg text-gray-500`}>
                            <h2>Connections: {selectedPeerData.connections.map((connection, index)=> (
                                connection



                            ))}
                            </h2>



                        </div>


                        <div className='flex items-center gap-6'>
                            <div>
                                <input
                                    type= "text"
                                    placeholder= 'Block Data Input...'
                                    value={newBlockData}
                                    onChange={(e) => setNewBlockData(e.target.value)}
                                    className='px-3 py-3 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                />
                            </div>
                            <div>
                                <button
                                    onClick={mineNewBlock}
                                    disabled={!selectedPeerData.connected || !newBlockData.trim()}
                                    className='bg-cyan-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-500 flex items-center gap-1 text-sm'
                                >
                                    <div className='flex items-center gap-2'>
                                        <Pickaxe className='w-4 h-4' />
                                        Mine Block
                                    </div>
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => syncPeerWithNetwork(selectedPeerData?.id ?? '')}
                                    className='bg-cyan-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-500 flex items-center gap-1 text-sm'
                                >
                                    <div className='flex items-center gap-2'>
                                        <RefreshCcw className='w-4 h-4' />
                                        Sync Current Node with Network
                                    </div>
                                </button>

                            </div>

                        </div>

                        {/*block chain visualisation */}
                        <div className='space-y-4'>
                            {!selectedPeerData.blockchain || selectedPeerData.blockchain.length ===0 ? (
                                <div className='text-center py-12 text-gray-500'>
                                    <Database size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No blocks in blockchain</p>
                                </div>

                            ): (
                                <div className='space-y-10'>
                                    <div className='flex items-center gap-2 overflow-x-auto'>
                                        {selectedPeerData && selectedPeerData.blockchain.map((block, idx) => (
                                            <React.Fragment key={block.index}>
                                                <div className={`flex-shrink-0 w-24 h-20 ${selectedPeerData?.color} bg-opacity-20 border-2 border-current rounded-lg flex flex-col items-center justify-center text-sm`}>
                                                    <div className="font-bold">#{block.index}</div>
                                                    <div className="text-xs opacity-75 truncate w-full text-center px-1">
                                                        {typeof block.data === 'object' ? JSON.stringify(block.data) : block.data}
                                                    </div>
                                                </div>

                                                {idx < (selectedPeerData?.blockchain.length ?? 100) - 1 && (
                                                <div className="">
                                                    <Link2 className='w-20 h-20' />

                                                </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className='space-y-4 max-h-96 overflow-y-auto'>
                                        {selectedPeerData.blockchain.slice().reverse().map((block, index) =>(
                                            <div key={block.index} className={`${selectedPeerData?.color} bg-opacity-5 border border-gray-500 border-opcity-20 rounded-lg p-4`}>
                                                <div>
                                                    <div className="font-semibold text-gray-700">Block #{block.index}</div>
                                                    <div className="text-gray-600">{block.data}</div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-700">Hash</div>
                                                    <div className="text-gray-600 font-mono text-xs">{block.hash.substring(0, 12)}...</div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-700">Previous Hash</div>
                                                    <div className="text-gray-600 font-mono text-xs">{block.previousHash.substring(0, 12)}...</div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-700">Timestamp</div>
                                                    <div className="text-gray-600 text-xs">{new Date(block.timestamp).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                ) : (
                    <div>
                    </div>
                )}

                {/* Floating Network activity button */}
                <button
                    onClick={() => setShowActivityLog(!showActivityLog)}
                    title='Network Activity'
                    className='fixed bottom-6 right-6 p-4 w-15 h-15 bg-cyan-500 hover:bg-cyan-700 text-white rounded-full shadow-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-110'
                >
                    <MessageCircle  size={30}/>
                    {networkActivity.length > 0 && (
                        <div className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold'>
                            {networkActivity.length >99 ? '99+': networkActivity.length}
                        </div>


                    )}
                </button>
                
                {showActivityLog && (
                    
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                        <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col'>

                            {/*Header */}
                            <div className='flex items-center justify-between p-4 border-b'>
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Activity className="text-orange-600" />
                                    Network Activity Log
                                </h3>
                                <button
                                    onClick={() => setShowActivityLog(false)}
                                    className="text-gray-500 hover:text-gray-700 p-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/*Chat Messages */}
                            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                                {networkActivity.length === 0 ? (
                                    <div className='text-center text-gray-500'>
                                        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No network activity yet...</p>
                                        <p className="text-sm mt-2">Network events will appear here as they happen</p>
                                    </div>
                                ) : (

                                    networkActivity.map((activity, index) => (
                                        <div key={index} className='flex flex-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div className="flex-1">
                                            <p className="text-sm text-gray-800">{activity.split(': ')[1]}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.split(': ')[0]}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {/* Chat Footer */}
                            <div className="p-4 border-t bg-gray-50">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>{networkActivity.length} total events</span>
                                    <button
                                    onClick={() => setNetworkActivity([])}
                                    className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                    Clear Log
                                    </button>
                                </div>
                            </div>
                            

                        </div>


                    </div>
                )}
            </div>
        </div>
    )
}


export {PeerToPeerNetwork}