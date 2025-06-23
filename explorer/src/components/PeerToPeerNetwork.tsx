import React, {useCallback, useEffect, useState} from 'react';
import { Block } from '../stores/BlockChainStore';
import { Transaction } from '../blockchain/transaction';
import { Network, Users, Plus, Link, Server, Wifi, WifiOff } from 'lucide-react';


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

const genesisTransaction: Transaction = {
  txIns: [{ signature: '', txOutId: '', txOutIndex: 0 }],
  txOuts: [{
    address: '0488e683f272afc630c0e4798d99526a0d81fc40f42d8f081c72ffd37a43927a0797777b25b2c308223cb73721c6f0330cd5d7e293fe15e37ccac1ff7aad2cbdcf',
    amount: 300
  }],
  id: 'e655f6a5f26dc9b4cac6e46f52336428287759cf81ef5ff10854f69d68f43fa3'
};

const genesisBlock = new Block(
  0,
  '91a73664bc84c0baa1fc75ea6e4aa6d1d20c5df664c724e3159aefc2e1186627',
  'This is the first (genesis) block, there is no previous block.',
  1465154705,
  [genesisTransaction],
  0,
  0
);

const createDemoTransaction = ():Transaction[] =>{
    const transaction: Transaction = new Transaction(
        'e655f6a5f26dc9b4cac6e46f52336428287759cf81ef5ff10854f69d68f43fa3',
        [{ signature: '', txOutId: '', txOutIndex: 0 }],
        [{
            address: '0488e683f272afc630c0e4798d99526a0d81fc40f42d8f081c72ffd37a43927a0797777b25b2c308223cb73721c6f0330cd5d7e293fe15e37ccac1ff7aad2cbdcf',
            amount: 300
        }],
    );
    return [transaction];
}

const createBlock = (prevBlock: Block, data: string): Block => {
  const newBlock: Block = {
    index: prevBlock.index + 1,
    hash: '',
    previousHash: prevBlock.hash,
    timestamp: Date.now(),
    data: createDemoTransaction(),
    difficulty: 5,
    nonce: 5
  };
  newBlock.hash = generateHash(`${newBlock.index}${newBlock.previousHash}${newBlock.timestamp}${newBlock.data}`);
  return newBlock;
};

const peerColors = [
  'bg-blue-500', 'bg-green-600', 'bg-purple-500', 'bg-red-500', 
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

const PeerToPeerNetwork = () => {

    //Peers
    const [peers, setPeers] = useState<Peer[]>([]);
    const [selectedPeer, setSelectedPeer] = useState('');
    const [newPeerName, setNewPeerName] = useState('');


    const [networkActivity, setNetworkActivity] = useState<string[]>([]);

    //Add activity to network activoty log
    const addActivity = useCallback((message:string) =>{
        setNetworkActivity(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0,9)]);
    },[])


    //Initialise peers with default peers
    useEffect(() =>{
        const initialPeers: Peer[] = [
            {
                id: '1',
                name: 'Steven',
                blockchain: [genesisBlock],
                transactionPool: [],
                connected: true,
                connections: ['2'],
                color: peerColors[0]
            },
            {
                id: '2',
                name: 'Jason',
                blockchain: [genesisBlock],
                transactionPool: [],
                connected: true,
                connections: ['1', '3'],
                color: peerColors[1]
            },
            {
                id: '3',
                name: 'Mike',
                blockchain: [genesisBlock],
                transactionPool: [],
                connected: true,
                connections: ['2'],
                color: peerColors[2]
            }
        ]

        setPeers(initialPeers);
        setSelectedPeer('1');
        addActivity("Network intialised with 3 default peers.")
    },[addActivity]);


    const addPeer = () => {

        //If no new peer name was entered:
        if (!newPeerName.trim()){
            return;
        };

        //Create new Peer object
        const newPeer: Peer = {
            id: Date.now().toString(),
            name: newPeerName,
            blockchain: [genesisBlock],
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
                                    {peer.connections.length} connects
                                    </div>
                                </div>
                            </div>


                        ))}

                    </div>




                </div>



            </div>
        </div>




    )


}


export {PeerToPeerNetwork}