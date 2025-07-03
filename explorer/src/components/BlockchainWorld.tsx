import { Play } from 'lucide-react';
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';


const BlockchainWorld = () => {

    const [gameStarted, setGameStarted] = useState(false);


    //Game stages
    const stages = [
        {
        id: 'intro',
        title: 'Welcome to Blockchain World!',
        character: '🤖',
        characterName: 'BlockBot',
        story: "Hello, brave explorer! I'm BlockBot, your guide to the fascinating world of blockchain. Today, we'll embark on an adventure to understand how this revolutionary technology works. Are you ready to discover the secrets of digital trust?",
        concept: 'Introduction to Blockchain',
        interactive: null,
        color: 'from-blue-500 to-purple-600'
        },
        {
        id: 'problem',
        title: 'The Trust Problem',
        character: '🏛️',
        characterName: 'Central Bank',
        story: "For centuries, people have relied on trusted institutions like banks to handle their money. But what if I told you there's a way to create trust without needing a central authority? Let's explore the problems with traditional systems...",
        concept: 'Traditional centralized systems have single points of failure and require trust in institutions.',
        interactive: {
            type: 'comparison',
            data: {
            centralized: ['Single point of failure', 'Requires trust in institutions', 'Can be censored or shut down', 'Intermediaries take fees'],
            decentralized: ['No single point of failure', 'Trustless system', 'Censorship resistant', 'Peer-to-peer transactions']
            }
        },
        color: 'from-red-500 to-orange-600'
        },
        {
        id: 'solution',
        title: 'Enter the Blockchain!',
        character: '⛓️',
        characterName: 'Chain Master',
        story: "Imagine a magical ledger that everyone can see, but no one can cheat! That's blockchain - a distributed ledger that records transactions across many computers. Each 'block' contains transactions, and they're linked together in a 'chain'. Let's see how it works!",
        concept: 'Blockchain is a distributed ledger technology that maintains a continuously growing list of records.',
        interactive: {
            type: 'block_builder',
            data: {
            blocks: [
                { id: 1, transactions: ['Alice → Bob: 5 coins', 'Carol → Dave: 3 coins'], hash: 'a1b2c3' },
                { id: 2, transactions: ['Bob → Eve: 2 coins', 'Frank → Grace: 1 coin'], hash: 'x7y8z9' }
            ]
            }
        },
        color: 'from-green-500 to-blue-600'
        },
        {
        id: 'cryptography',
        title: 'The Magic of Cryptography',
        character: '🔐',
        characterName: 'Crypto Wizard',
        story: "Abracadabra! Well, not quite magic, but cryptography! Each block has a unique fingerprint called a 'hash'. If someone tries to change even one letter in a block, the hash changes completely. This makes tampering virtually impossible!",
        concept: 'Cryptographic hashing ensures data integrity and security in blockchain.',
        interactive: {
            type: 'hash_demo',
            data: {
            originalText: 'Alice sends 5 coins to Bob',
            hash: 'a1b2c3d4e5f6'
            }
        },
        color: 'from-purple-500 to-pink-600'
        },
        {
        id: 'consensus',
        title: 'Agreement in the Network',
        character: '🤝',
        characterName: 'Consensus Keeper',
        story: "How do thousands of computers agree on what's true? Through consensus mechanisms! The most common is Proof of Work, where computers compete to solve puzzles. The winner gets to add the next block and receives a reward!",
        concept: 'Consensus mechanisms ensure all network participants agree on the state of the blockchain.',
        interactive: {
            type: 'mining_game',
            data: {
            difficulty: 3,
            reward: 12.5
            }
        },
        color: 'from-yellow-500 to-orange-600'
        },
        {
        id: 'decentralization',
        title: 'Power to the People!',
        character: '🌐',
        characterName: 'Network Node',
        story: "Instead of one central authority, blockchain distributes power across thousands of nodes worldwide. Each node has a copy of the entire blockchain. This makes the system incredibly resilient and democratic!",
        concept: 'Decentralization eliminates single points of failure and distributes control.',
        interactive: {
            type: 'network_visualization',
            data: {
            nodes: 12,
            connections: 28
            }
        },
        color: 'from-teal-500 to-green-600'
        },
        {
        id: 'applications',
        title: 'Real-World Applications',
        character: '🚀',
        characterName: 'Innovation Explorer',
        story: "Blockchain isn't just for cryptocurrencies! It's revolutionizing supply chains, healthcare, voting systems, and more. From tracking food from farm to table to securing medical records, the possibilities are endless!",
        concept: 'Blockchain has applications far beyond cryptocurrency in many industries.',
        interactive: {
            type: 'application_explorer',
            data: {
            applications: [
                { name: 'Supply Chain', icon: '📦', description: 'Track products from origin to consumer' },
                { name: 'Healthcare', icon: '🏥', description: 'Secure and private medical records' },
                { name: 'Voting', icon: '🗳️', description: 'Transparent and tamper-proof elections' },
                { name: 'Real Estate', icon: '🏠', description: 'Fractional ownership and transparent transactions' }
            ]
            }
        },
        color: 'from-indigo-500 to-purple-600'
        },
        {
        id: 'conclusion',
        title: 'Congratulations, Blockchain Master!',
        character: '🎓',
        characterName: 'Master Blockchain',
        story: "You've completed your journey through the blockchain universe! You now understand how this revolutionary technology creates trust without intermediaries, secures data with cryptography, and enables a new era of decentralized applications. The future is in your hands!",
        concept: 'You are now equipped with fundamental blockchain knowledge!',
        interactive: {
            type: 'certificate',
            data: {
            achievements: ['Understood blockchain basics', 'Learned about cryptography', 'Explored consensus mechanisms', 'Discovered decentralization', 'Explored real-world applications']
            }
        },
        color: 'from-gradient-to-r from-yellow-400 via-red-500 to-pink-500'
        }
    ];

    const startGame = () => {
        setGameStarted(true);
    }


    // Show game content if game has started
    return (
        <div className='min-h-screen bg-slate-900 text-white p-10'>
            <h2 className="text-3xl font-bold mb-4">🚀 Your Blockchain Journey Begins!</h2>
            <p className="text-lg">Here's where your interactive story will unfold...</p>
        </div>
    );


}

export {BlockchainWorld}