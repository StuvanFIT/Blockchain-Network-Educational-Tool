import React, {useCallback, useEffect, useState} from 'react';
import { Transaction } from '../blockchain/transaction';
import { Network, Users, Plus, Link, Server, Wifi, WifiOff, Pickaxe, Database, Link2 } from 'lucide-react';

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
        connections: ['2'],
        color: peerColors[2]
    }
];

const PeerToPeerNetwork = () => {
    //Add activity to network activoty log
    const addActivity = useCallback((message:string) =>{
        setNetworkActivity(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0,9)]);
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




    const [newPeerName, setNewPeerName] = useState('');

    //Mined block
    const [newBlockData, setNewBlockData] = useState('');


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

        setPeers(prev => prev.map(peer => {
            if (peer.id === selectedPeerData?.id){
                const lastBlock = peer.blockchain[peer.blockchain.length -1];
                const newMinedBlock = createBlock(lastBlock, newBlockData, 5, 5);
                addActivity(`${peer.name} mined a new block: "${newBlockData}"`);
                return { ...peer, blockchain: [...peer.blockchain, newMinedBlock] };
            }
            return peer;
        }));

        setNewBlockData('');
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





            </div>
        </div>




    )


}


export {PeerToPeerNetwork}