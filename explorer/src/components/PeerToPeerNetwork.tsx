import React, {useCallback, useEffect, useState} from 'react';
import { Transaction } from '../blockchain/transaction';
import { Network, Users, Plus, Link, Server, Wifi, WifiOff, Pickaxe, Database, Link2, MessageCircle, Activity, X, RefreshCcw, UserRoundPlus, Cable, Blocks, Unplug } from 'lucide-react';

import { BlockchainNode } from './Network/BlockchainNode';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, addEdge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomEdge from './Network/BlockchainEdge';


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


const nodeTypes = {
    peer: BlockchainNode
}

const edgeTypes ={
    'custom-edge': CustomEdge
}

const styles = {
  background: '#1e1b4b',
  borderRadius: '0.5rem',
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
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
  'bg-emerald-500', 'bg-fuchsia-500', 'bg-gray-500', 'bg-cyan-500',
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
        name: 'Lebron',
        blockchain: [createGenesisBlock()],
        transactionPool: [],
        connected: true,
        connections: ['1'],
        color: peerColors[1]
    },
    {
        id: '3',
        name: 'Durant',
        blockchain: [createGenesisBlock()],
        transactionPool: [],
        connected: true,
        connections: [],
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

    

    const getNodesFromPeers = (peers: Peer[]): any[] => {
        return peers.map((peer, index) => ({
            id:peer.id,
            type: 'peer',
            position: {
                x: 150 + (index % 4) * 200, // Arrange in a grid pattern
                y: 100 + Math.floor(index / 4) * 150 
            },
            data: { 
                peer: peer, // Pass entire peer object
                selected: peer.id === selectedPeer,
            }
        }))
    }
    const getEdgesFromPeers = (peers: Peer[]): any[] => {
        const edges: any[] = [];

        peers.forEach(peer => {
            peer.connections.forEach(connectionId => {

                const edgeId = `${peer.id}->${connectionId}`;
                const reverseEdgeId = `${connectionId}->${peer.id}`;

                //Check if the reverse edge already exists
                const existingEdge = edges.find(e => e.id === reverseEdgeId);
                console.log(existingEdge)

                if (!existingEdge){
                    edges.push({
                        id: edgeId,
                        source: peer.id,
                        target: connectionId,
                        type: 'custom-edge',
                        animated:true,
                        style: {stroke: '#3b82f6', strokeWidth: 5},
                    })
                }
            })
        })

        return edges
    }

        
    const initialNodes = getNodesFromPeers(initialPeers);
    const initialEdges = getEdgesFromPeers(initialPeers);


    const [newPeerName, setNewPeerName] = useState(''); // New added peer/node
    const [newBlockData, setNewBlockData] = useState(''); //Mined block Data
    const [showActivityLog, setShowActivityLog] =useState(false);
    const [autoSync, setAutoSync] = useState(false);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
        (connection: Connection) => {
        const edge = { ...connection, type: 'custom-edge' };
        setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges],
    );
 


    let selectedPeerData: Peer | undefined = peers.find(p => p.id === selectedPeer);

    useEffect(() =>{
        const newSelectedPeer = peers.find(p => p.id === selectedPeer);
        selectedPeerData = newSelectedPeer;
        setNodes(getNodesFromPeers(peers));
        setEdges(getEdgesFromPeers(peers));
    }, [selectedPeer])


    //Peers to localStorage
    useEffect(() => {
        localStorage.setItem('peers', JSON.stringify(peers));
        setNodes(getNodesFromPeers(peers));
        setEdges(getEdgesFromPeers(peers));
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
            connections: [],
            color: peerColors[peers.length % peerColors.length]
        };

        //Set new Peer
        setPeers([...peers, newPeer]);

        setNewPeerName('');
        setSelectedPeer(newPeer.id);
        addActivity(`New Peer ${newPeer.name} has joined the network!`);
    };

    const togglePeerConnection = (peerId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        const updatePeers = peers.map(peer => {
            if (peer.id === peerId){
                const newStatus = !peer.connected;
                addActivity(`${peer.name} ${newStatus ? 'connected to' : 'disconnected from'} the network`);
                return {...peer, connected: newStatus};
            };

            return peer;
        });


        setPeers(updatePeers);
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

    //Connecting the current peer (selectedPeer source) with the selected peer (destination)
    const connectWithPeer = (e: React.MouseEvent, connectWithPeerId:string) => {
        e.stopPropagation();

        //Connecting to data:
        const connectWithPeerData = peers.find(p => p.id === connectWithPeerId);

        let newPeers = [...peers];

        newPeers = peers.map(peer => {

            if (peer.id === selectedPeer){
                return {...peer, connections: [...peer.connections, connectWithPeerId]}
            } else if (peer.id === connectWithPeerId){
                return {...peer, connections: [...peer.connections, selectedPeer]}
            } else {
                return peer
            }
        });


        //Check if the sync occurred
        const originalConnections = peers.find(p => p.id === selectedPeerData?.id);
        const latestConnections = newPeers.find(p => p.id === selectedPeerData?.id);

        // Compare by value
        const wereDifferent = JSON.stringify(originalConnections?.connections) !== JSON.stringify(latestConnections?.connections);

        if (wereDifferent && connectWithPeerData) {
            addActivity(`${originalConnections?.name} has connected to ${connectWithPeerData.name}.`);
        }
        
        setPeers(newPeers);
    }

    //disconnectTargetId: the peer we want to disconnect from.
    const disconnectFromPeer = (e: React.MouseEvent, disconnectTargetId: string) => {

        //Disconnecting to data:
        const disconnectedPeerData = peers.find(p => p.id === disconnectTargetId);

        let newPeers = [...peers];

        newPeers = peers.map(peer => {

            if (peer.id === selectedPeer){
                return {...peer, connections: [...peer.connections.filter(connId=> connId !== disconnectTargetId)]};
            } else if (peer.id === disconnectTargetId){
                return {...peer, connections: [...peer.connections.filter(connId => connId !== selectedPeer)]};
            } else {
                return peer;
            }
        });
        const originalConnections = peers.find(p => p.id === selectedPeer);
        const latestConnections = newPeers.find(p => p.id === selectedPeer);

        // Compare by value
        const wereDifferent = JSON.stringify(originalConnections?.connections) !== JSON.stringify(latestConnections?.connections);

        if (wereDifferent && disconnectedPeerData) {
            addActivity(`${originalConnections?.name} has disconnected from ${disconnectedPeerData.name}.`);
        }

        setPeers(newPeers);
    }




    const getPeerFromID = (peerId:string): Peer | undefined => {
        const peerData = peers.find(p => p.id === peerId);
        return peerData;
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
        <div className='p-2 sm:p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden'>
            <div className='max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8'>
                {/* Header Section */}
                <div className='bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-slate-200'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6'>
                        <div className='bg-gradient-to-r from-cyan-400 to-sky-600 rounded-lg text-white p-2 sm:p-3'>
                            <Network className='w-6 h-6 sm:w-8 sm:h-8'/>
                        </div>
                        <div>
                            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-white'>P2P Blockchain Network</h1>
                            <p className="text-slate-300 mt-1 text-sm sm:text-base">Add and connect to peers!</p>
                        </div>
                    </div>
                    <p className='text-white text-sm sm:text-base'>Click on any peer node to view its blockchain. Nodes sync with connected peers automatically.</p>
                </div>

                {/* Network Control Section */}
                <div className='bg-slate-800/70 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-slate-200 space-y-4 sm:space-y-6 lg:space-y-8'>
                    
                    {/* Network Header with Auto Sync */}
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white'>
                        <div className='flex items-center gap-3 sm:gap-4'>
                            <Users className='w-5 h-5 sm:w-6 sm:h-6' />
                            <p className='text-lg sm:text-xl font-semibold'>Network Nodes</p>
                        </div>
                        
                        <label className='flex items-center gap-2 sm:gap-3 text-sm sm:text-base cursor-pointer'>
                            <input 
                                type="checkbox"
                                className='rounded w-4 h-4 sm:w-5 sm:h-5'
                                checked={autoSync}
                                onChange={(e)=> setAutoSync(e.target.checked)}
                            />
                            <span className='text-white'>Auto Sync</span>
                        </label>
                    </div>
                    
                    {/* Control Buttons - Stacked on mobile */}
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6'>
                        <div className='flex-1 sm:flex-none'>
                            <input
                                type="text"
                                placeholder='Node Name...'
                                value={newPeerName}
                                onChange={(e) => setNewPeerName(e.target.value)}
                                className='w-full px-3 py-2 sm:py-3 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                            />
                        </div>
                        <div className='flex gap-2 sm:gap-3'>
                            <button
                                onClick={addPeer}
                                className='flex-1 sm:flex-none bg-gradient-to-r from-cyan-400 to-sky-600 text-white font-bold px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:from-cyan-500 hover:to-sky-700 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm transition-all duration-200'
                            >
                                <Plus className='w-3 h-3 sm:w-4 sm:h-4' />
                                <span className='hidden sm:inline'>Add Peer</span>
                                <span className='sm:hidden'>Add</span>
                            </button>
                            <button
                                onClick={syncAllPeers}
                                className='flex-1 sm:flex-none bg-gradient-to-r from-cyan-400 to-sky-600 text-white font-bold px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:from-cyan-500 hover:to-sky-700 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm transition-all duration-200'
                            >
                                <Link className='w-3 h-3 sm:w-4 sm:h-4' />
                                <span className='hidden sm:inline'>Sync All</span>
                                <span className='sm:hidden'>Sync</span>
                            </button>
                        </div>
                    </div>

                    {/* Peer Nodes Grid - Responsive */}
                    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6 lg:gap-8'>
                        {peers.map(peer => (
                            <div
                                key={peer.id}
                                className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                                    selectedPeer === peer.id ? 'transform scale-110': 'hover:transform hover:scale-105'
                                }`}
                                onClick={() => setSelectedPeer(peer.id)}
                            >
                                {/* Peer Node */}
                                <div className={`relative w-12 h-12 sm:w-16 sm:h-16 ${peer.color} rounded-full flex items-center justify-center shadow-lg ${
                                    selectedPeer === peer.id ? 'ring-4 ring-indigo-400 ring-opacity-75 animate-pulse': ''
                                }`}>
                                    <Server className='text-white w-4 h-4 sm:w-5 sm:h-5' />

                                    {/* Connection Status */}
                                    <button 
                                        title={peer.connected ? 'Disconnect' : 'Connect'} 
                                        onClick={(e) => togglePeerConnection(peer.id, e)} 
                                        className={`absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                                            peer.connected ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                    >
                                        {peer.connected ? 
                                            <Wifi className='w-2 h-2 sm:w-3 sm:h-3 text-white' /> : 
                                            <WifiOff className='w-2 h-2 sm:w-3 sm:h-3 text-white'/>
                                        }
                                    </button>

                                    {/* Connect Button */}
                                    {selectedPeer && selectedPeer !== peer.id && !peer.connections.includes(selectedPeer) &&(
                                        <button
                                            title='Connect with peer'
                                            onClick={(e) => connectWithPeer(e, peer.id)}
                                            className='absolute -bottom-0.5 -right-0.5 bg-white text-gray-700 rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center border-2 border-gray-200 hover:border-gray-300 transition-all duration-200'
                                        >
                                            <UserRoundPlus className='w-2 h-2 sm:w-3 sm:h-3'/>
                                        </button>
                                    )}
                                </div>

                                {/* Peer Info */}
                                <div className="text-center mt-2">
                                    <div className="text-xs sm:text-sm font-medium text-white truncate">{peer.name}</div>
                                    <div className="text-xs text-slate-300">
                                        {peer.connections.length} conn
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* ReactFlow Network Visualization */}
                    <div className='w-full border border-slate-500 rounded-lg overflow-hidden'>
                        <div style={{width: '100%', height: '40vh'}} className='sm:h-[50vh] md:h-[60vh]'>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                nodeTypes={nodeTypes}
                                edgeTypes={edgeTypes}
                                fitView
                                fitViewOptions={{ padding: 0.2 }}
                                proOptions={{hideAttribution:true}}
                                style={styles}
                            >
                                <Background />
                                <Controls />
                            </ReactFlow>
                        </div>
                    </div>
                </div>

                {/* Selected Peer Details */}
                {selectedPeerData ? (
                    <div className='bg-slate-800/70 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-slate-200 space-y-6 sm:space-y-8 lg:space-y-12'>
                        
                        {/* Peer Header */}
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4'>
                            <div className='flex items-center gap-3'>
                                <div className={`${selectedPeerData.color} p-2 sm:p-3 rounded-full`}>
                                    <Server className='text-white w-5 h-5 sm:w-6 sm:h-6' />
                                </div>
                                <div>
                                    <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold text-white'>
                                        {selectedPeerData.name}'s Blockchain
                                    </h2>
                                    <span className='text-sm text-slate-300'>
                                        {selectedPeerData.blockchain.length} block{selectedPeerData.blockchain.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Connections Section */}
                        <div className={`p-4 sm:p-6 lg:p-8 ${selectedPeerData.color} bg-opacity-20 rounded-lg`}>
                            <h3 className='text-lg sm:text-xl lg:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
                                <Cable className='w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7' />
                                Connections
                            </h3>

                            {selectedPeerData.connections.length === 0 ? (
                                <div className="text-center py-6 sm:py-8">
                                    <div className="text-white text-base sm:text-lg">No connections</div>
                                    <div className="text-sm text-slate-300 mt-2">This peer is isolated from the network</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                                    {selectedPeerData.connections.map((connection) => {
                                        const connectedPeer = getPeerFromID(connection);
                                        if (!connectedPeer) return null;
                                        
                                        const isOnline = connectedPeer.connected;
                                        const hasLongerChain = connectedPeer?.blockchain.length > (selectedPeerData?.blockchain.length || 0);
                                        const hasSameChain = connectedPeer?.blockchain.length === selectedPeerData?.blockchain.length;
                                        
                                        return (
                                            <div 
                                                key={connection}
                                                className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                                    isOnline ? 'border-green-200 hover:border-green-300 hover:shadow-lg' : 'border-red-200 opacity-60'
                                                } ${
                                                    hasLongerChain ? 'bg-yellow-50 border-yellow-300' : 'bg-slate-800/80 backdrop-blur-sm border-slate-600/30'
                                                } hover:scale-105 group`}
                                                onClick={() => setSelectedPeer(connection)}
                                            >
                                                {/* Status Indicators */}
                                                <div className={`absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md ${
                                                    isOnline ? 'bg-green-500' : 'bg-red-500'
                                                }`}>
                                                    {isOnline ? 
                                                        <Wifi className='w-2 h-2 sm:w-3 sm:h-3 text-white' /> : 
                                                        <WifiOff className='w-2 h-2 sm:w-3 sm:h-3 text-white'/>
                                                    }
                                                </div>

                                                {hasLongerChain && (
                                                    <div className="absolute -top-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                                        <span className="text-white text-xs font-bold">!</span>
                                                    </div>
                                                )}

                                                {/* Peer Avatar */}
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 ${connectedPeer.color} rounded-full flex items-center justify-center shadow-lg mx-auto mb-2 sm:mb-3`}>
                                                    <Server className='text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6' />
                                                </div>

                                                {/* Peer Info */}
                                                <div className="text-center">
                                                    <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-400 mb-1 truncate">
                                                        {connectedPeer.name}
                                                    </div>
                                                    
                                                    {/* Blockchain Status */}
                                                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 flex-wrap">
                                                        <Database className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                        <span className={`text-xs sm:text-sm font-medium ${hasLongerChain ? 'text-orange-300' : 'text-white'}`}>
                                                            {connectedPeer.blockchain.length} blocks
                                                        </span>
                                                    </div>

                                                    {/* Status Badges */}
                                                    <div className="flex flex-wrap gap-1 justify-center mb-2">
                                                        {hasLongerChain && (
                                                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                                                Longer!
                                                            </span>
                                                        )}
                                                        {hasSameChain && (
                                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                                Synced
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Connection Count */}
                                                    <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-2">
                                                        <Link2 className="w-3 h-3" />
                                                        <span>{connectedPeer.connections.length} conn</span>
                                                    </div>

                                                    {/* Disconnect Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            disconnectFromPeer(e, connection);
                                                        }}
                                                        className="w-full px-2 py-1 text-xs rounded-lg font-medium transition-colors bg-red-100 text-red-800 hover:bg-red-200 flex items-center justify-center gap-1"
                                                    >
                                                        <Unplug className="w-3 h-3" />
                                                        Disconnect
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Blockchain Section */}
                        <div className="space-y-4 sm:space-y-6">
                            <h3 className='text-lg sm:text-xl lg:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3'>
                                <Blocks className='w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7' />
                                Blockchain
                            </h3>

                            {/* Mining Controls */}
                            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                                <div className='flex-1'>
                                    <input
                                        type="text"
                                        placeholder='Block Data...'
                                        value={newBlockData}
                                        onChange={(e) => setNewBlockData(e.target.value)}
                                        className='w-full px-3 py-2 sm:py-3 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                    />
                                </div>
                                <div className='flex gap-2 sm:gap-3'>
                                    <button
                                        onClick={mineNewBlock}
                                        disabled={!selectedPeerData.connected || !newBlockData.trim()}
                                        className='flex-1 sm:flex-none bg-gradient-to-r from-cyan-400 to-sky-600 text-white font-bold px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:from-cyan-500 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm transition-all duration-200'
                                    >
                                        <Pickaxe className='w-3 h-3 sm:w-4 sm:h-4' />
                                        <span className='hidden sm:inline'>Mine Block</span>
                                        <span className='sm:hidden'>Mine</span>
                                    </button>
                                    <button
                                        onClick={() => syncPeerWithNetwork(selectedPeerData?.id ?? '')}
                                        className='flex-1 sm:flex-none bg-gradient-to-r from-cyan-400 to-sky-600 text-white font-bold px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:from-cyan-500 hover:to-sky-700 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm transition-all duration-200'
                                    >
                                        <RefreshCcw className='w-3 h-3 sm:w-4 sm:h-4' />
                                        <span className='hidden sm:inline'>Sync</span>
                                        <span className='sm:hidden'>Sync</span>
                                    </button>
                                </div>
                            </div>

                            {/* Blockchain Visualization */}
                            <div className='space-y-4 sm:space-y-6'>
                                {!selectedPeerData.blockchain || selectedPeerData.blockchain.length === 0 ? (
                                    <div className='text-center py-8 sm:py-12 text-white'>
                                        <Database size={32} className="mx-auto mb-4 opacity-50 sm:w-12 sm:h-12" />
                                        <p className="text-sm sm:text-base">No blocks in blockchain</p>
                                    </div>
                                ) : (
                                    <div className='space-y-6 sm:space-y-10'>
                                        {/* Chain Overview - Horizontal scroll on mobile */}
                                        <div className='overflow-x-auto pb-2'>
                                            <div className='flex items-center gap-2 sm:gap-3 min-w-max'>
                                                {selectedPeerData.blockchain.map((block, idx) => (
                                                    <React.Fragment key={block.index}>
                                                        <div className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 lg:w-24 lg:h-20 ${selectedPeerData?.color} bg-opacity-70 border-2 border-current rounded-lg flex flex-col items-center justify-center text-xs sm:text-sm`}>
                                                            <div className="font-bold">#{block.index}</div>
                                                            <div className="text-xs opacity-75 truncate w-full text-center px-1">
                                                                {typeof block.data === 'object' ? JSON.stringify(block.data).slice(0, 10) : String(block.data).slice(0, 10)}
                                                            </div>
                                                        </div>
                                                        {selectedPeerData && idx < selectedPeerData.blockchain.length - 1 && (
                                                            <div className="text-white flex-shrink-0">
                                                                <Link2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Detailed Block List */}
                                        <div className='space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto'>
                                            {selectedPeerData.blockchain.slice().reverse().map((block) => (
                                                <div key={block.index} className={`${selectedPeerData?.color} bg-opacity-5 border border-gray-500 border-opacity-20 rounded-lg p-3 sm:p-4`}>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                                        <div>
                                                            <div className="font-semibold text-white text-sm sm:text-base">Block #{block.index}</div>
                                                            <div className="text-gray-400 text-xs sm:text-sm break-all">{block.data}</div>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-white text-sm sm:text-base">Hash</div>
                                                            <div className="text-gray-400 font-mono text-xs break-all">{block.hash.substring(0, 20)}...</div>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-white text-sm sm:text-base">Previous Hash</div>
                                                            <div className="text-gray-400 font-mono text-xs break-all">{block.previousHash.substring(0, 20)}...</div>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-white text-sm sm:text-base">Timestamp</div>
                                                            <div className="text-gray-400 text-xs">{new Date(block.timestamp).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Floating Activity Button */}
                <button
                    onClick={() => setShowActivityLog(!showActivityLog)}
                    title='Network Activity'
                    className='fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-3 sm:p-4 w-12 h-12 sm:w-15 sm:h-15 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-40'
                >
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6"/>
                    {networkActivity.length > 0 && (
                        <div className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold'>
                            {networkActivity.length > 99 ? '99+' : networkActivity.length}
                        </div>
                    )}
                </button>
                
                {/* Activity Log Modal */}
                {showActivityLog && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4'>
                        <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] flex flex-col'>
                            {/* Header */}
                            <div className='flex items-center justify-between p-3 sm:p-4 border-b'>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Activity className="text-orange-600 w-4 h-4 sm:w-5 sm:h-5" />
                                    Network Activity
                                </h3>
                                <button
                                    onClick={() => setShowActivityLog(false)}
                                    className="text-gray-500 hover:text-gray-700 p-1 touch-manipulation"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            {/* Activity Messages */}
                            <div className='flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4'>
                                {networkActivity.length === 0 ? (
                                    <div className='text-center text-gray-500 py-8'>
                                        <MessageCircle size={32} className="mx-auto mb-4 opacity-50 sm:w-12 sm:h-12" />
                                        <p className="text-sm sm:text-base">No network activity yet...</p>
                                        <p className="text-xs sm:text-sm mt-2">Events will appear here</p>
                                    </div>
                                ) : (
                                    networkActivity.map((activity, index) => (
                                        <div key={index} className='flex gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm text-gray-800 break-words">{activity.split(': ')[1]}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.split(': ')[0]}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 sm:p-4 border-t bg-gray-50">
                                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                                    <span>{networkActivity.length} events</span>
                                    <button
                                        onClick={() => setNetworkActivity([])}
                                        className="text-red-600 hover:text-red-700 font-medium touch-manipulation"
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
export type {Peer}