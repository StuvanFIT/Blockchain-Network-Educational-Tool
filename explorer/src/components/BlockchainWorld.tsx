import { Database, ChevronLeft, ChevronRight} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Typewriter } from '../utils/Typewriter';


const BlockchainWorld = () => {

    const [gameStarted, setGameStarted] = useState(false);
    const [currentStage, setCurrentStage] = useState(0);
    const [isCharacterTalking, setIsCharacterTalking] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    //Game stages
    const stages = [
        {
            id: 'intro',
            title: 'Welcome to Blockchain World!',
            character: '🤖',
            characterName: 'BlockBot',
            story: "Hello, fellow explorer! I'm BlockBot, your guide to the fascinating world of blockchain. Today, we'll embark on an adventure to understand how blockchain technology works. Are you ready to discover the secrets of digital trust?",
            concept: 'Introduction to Blockchain',
            interactive: null,
            color: 'from-blue-500 to-purple-600'
        },
        {
            id:'history',
            title: 'The Evolution of Blockchain',
            character: '🤖',
            characterName: 'BlockBot',
            story: "Blockchain technology began with the introduction of Bitcoin, cryptocurrencyand and blockchain concepts in 2008, developed by an anonymous figure or group" +
            " known as Satoshi Nakamoto."+
            " Nakamoto's design presented the concept of a chain of blocks, making it possible to add blocks without requiring them to be signed by a trusted third party.",
            concept: 'Evolution of Blockchain',
            interactive: null,
            color: 'from-fuchsia-500 to-pink-600'
            
            
        }
        ,
        {
            id: 'problem',
            title: 'The Trust Problem',
            character: '🤖',
            characterName: 'BlockBot',
            story: "For centuries, people have relied on trusted institutions like banks to handle their money. But what if I told you there's a way to create trust without needing a central authority?" + 
            " Satoshi Nakamoto's initial purpose for blockchain was to create a secure, transparent and decentralised public ledger to support Bitcoin which eliminated the need for intermediaries like banks in financial transactions." +
            " It gives ordinary people like you a chance to take part in a decentralised financial system!" +
            " Let's explore the problems with traditional systems...",

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
            character: '🤖',
            characterName: 'BlockBot',
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
            character: '🤖',
            characterName: 'BlockBot',
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
            character: '🤖',
            characterName: 'BlockBot',
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
            character: '🤖',
            characterName: 'BlockBot',
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
            character: '🤖',
            characterName: 'BlockBot',
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
            character: '🤖',
            characterName: 'BlockBot',
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
        setCurrentStage(0);
        startCharacterAnimation();
    };

    const startCharacterAnimation = () => {
            setAnimationKey(prev => prev + 1);
            setInterval(() => {
                setIsCharacterTalking(true);
        },1000)
        
    };

    const nextStage = () => {
        if (currentStage < stages.length - 1) {
            setCurrentStage(currentStage + 1);
            startCharacterAnimation();
        }
    };

    const prevStage = () => {
        if (currentStage > 0) {
            setCurrentStage(currentStage - 1);
            startCharacterAnimation();
        }
    };


    const currentStageData = stages[currentStage];


    // Show game content if game has started
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 ">
                <div className={`bg-gradient-to-r ${currentStageData.color} rounded-2xl shadow-2xl overflow-hidden`}>
                {/* Header */}
                <div className="bg-black/20 p-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">{currentStageData.title}</h2>
                    <div className="text-white/80 text-sm">
                    Stage {currentStage + 1} of {stages.length}
                    </div>
                </div>

                {/* Character Section */}
                <div className="bg-white/95 backdrop-blur-sm p-8">
                    <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0">
                        <div className={`text-6xl ${isCharacterTalking ? 'animate-bounce' : ''}`} key={animationKey}>
                        {currentStageData.character}
                        </div>
                        <div className="text-center mt-2 text-sm font-medium text-gray-600">
                        {currentStageData.characterName}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative">
                        <div className="absolute -left-4 top-6 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white"></div>
                        
                        <Typewriter key={currentStage} text={currentStageData.story} speed={5} />

                        </div>
                    </div>
                    </div>

                    {/* Concept Box */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full p-2">
                        <Database className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                        <h3 className="font-bold text-blue-800 mb-2">Key Concept</h3>
                        <p className="text-blue-700">{currentStageData.concept}</p>
                        </div>
                    </div>
                    </div>

                    {/* Interactive Content */}

                    
                </div>

                {/* Navigation */}
                <div className="bg-black/20 p-6 flex justify-between items-center">
                    <button
                    onClick={prevStage}
                    disabled={currentStage === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        currentStage === 0 
                        ? 'text-white/50 cursor-not-allowed' 
                        : 'text-white hover:bg-white/20'
                    }`}
                    >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                    </button>

                    <div className="text-white/80 text-sm">
                    {currentStage + 1} / {stages.length}
                    </div>

                    <button
                    onClick={nextStage}
                    disabled={currentStage === stages.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        currentStage === stages.length - 1 
                        ? 'text-white/50 cursor-not-allowed' 
                        : 'text-white hover:bg-white/20'
                    }`}
                    >
                    Next
                    <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                </div>
            </div>
        </div>
    );


}

export {BlockchainWorld}