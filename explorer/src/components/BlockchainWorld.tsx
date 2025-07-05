import { Database, ChevronLeft, ChevronRight, Zap, Network, Star, CheckCircle, Calendar} from 'lucide-react';
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Typewriter } from '../utils/Typewriter';


const BlockchainWorld = () => {
    const navigate = useNavigate();
    
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
            id: 'problem',
            title: 'The Trust Problem - Part 1',
            character: '🤖',
            characterName: 'BlockBot',
            story: "For centuries and even today, people have trusted banks. If you needed to keep your money safe, borrow or send it to someone far away, the bank was your go-to." +
            " You didn't question it - they were the gatekeepers of money.\nHowever, there were costs:\n-Banks charged fees for everything\n-They could freeze your account, decline your loan, or even block transactions.\n"
            +"-And worst of all, if the bank made a mistake or collapsed, your money could vanish.\n\n"
            +"But what if I told you there's a way to create trust without needing a central authority?\n\n"
            +"One day, a mysterious figure named Satoshi Nakamoto gave birth to something revolutionary: Bitcoin, and behind it — the power of blockchain.\n"
            +"Satoshi Nakamoto's initial purpose for blockchain was to create a secure, transparent and decentralised public ledger to support Bitcoin which eliminated the need for intermediaries like banks in financial transactions. It gives ordinary people like you a chance to take part in a decentralised financial system!\n"
            +"This was a new world where:\n"
            +"-You could be your own bank\n-Money could move peer-to-peer, without middlemen.\n-No one could change your records, because everything was locked in a global, public ledger.",

            concept: 'Traditional centralised systems have single points of failure and require trust in institutions.',
            interactive: {
                type: 'comparison',
                data: {
                centralised: ['Single point of failure', 'Requires trust in institutions', 'Can be censored or shut down', 'Intermediaries take fees'],
                decentralised: ['No single point of failure', 'Trustless system', 'Censorship resistant', 'Peer-to-peer transactions']
                }
            },
            color: 'from-red-500 to-orange-600'
        },
        {
            id: 'problem',
            title: 'The Trust Problem - Part 2',
            character: '🤖',
            characterName: 'BlockBot',
            story: "But not everyone was pleased...You see, crypto wasn't just a new tool for banks - it was new rival.\n\n"
            +"To them, crypto looked unregulated, dangerous, and sometimes even like dirty money — because it didn’t come from the usual, trusted systems. And in many cases, people weren’t paying taxes like they do on stocks. Crypto gains happened quietly, outside of view\n"
            +"Why are banks against Bitcoin?\n"
            +"One of the biggest reasons banks are against Bitcoin is that it grants individuals exclusive sovereignty over their funds, making it impossible for banks and governments to control individuals' funds and earn from it.\n"
            +"With Bitcoin being blockchain-based and decentralised, they can’t earn from people’s bank deposits, and they lose control of the economic system and people's funds",
            concept: 'Banks started to worry',
            interactive: null,
            color: 'from-red-500 to-orange-600'
        },
        {
            id: 'problem',
            title: 'The Trust Problem - Part 3',
            character: '🤖',
            characterName: 'BlockBot',
            story: "Some believe these two worlds will eventually merge — banks adopting blockchain, and governments regulating crypto. Others believe crypto will remain a rebel system, for those who want freedom and control over their own money.\n"+
            "And you — dear listener — are now stepping into the middle of this revolution.\n"
            +"Welcome to the blockchain journey!\n",

            concept: 'Potential merging between the 2 worlds - coexistence',
            interactive: null,
            color: 'from-red-500 to-orange-600'
        },
        {
            id: 'financial-crisis',
            title: 'Case Study: 2008 Financial Crisis',
            character: '🤖',
            characterName: 'BlockBot',
            story: "If you want to understand some of the inherent problems of the current traditional financial system, the 2008 Financial Crisis is a good case study! I'll note some quick details about the financial crisis down below!",
            concept: null,
            interactive: {
                type: 'financial-crisis',
                data: {
                    timeline: [
                        { 
                            date: "Sep 2008",
                            title: "Lehman Brothers Collapse",
                            description: "The investment bank's bankruptcy exposed the dangerous interconnectedness of global financial institutions."
                            + "When one major player failed, it triggered a domino effect across the entire system, exposing how traditional finance lacked proper risk distribution and transparency mechanisms", 
                            impact: ""
                        },
                        {
                            date: "Oct 2008",
                            title: "Government Bailsout Begin",
                            description: "The U.S. government's $700 billion TARP program and similar bailouts worldwide demonstrated the too big to fail problem. This centralized rescue highlighted how the financial system depended on government intervention rather than market mechanisms, undermining trust in free-market principles.",
                            impact: ""
                        },
                        {
                            date: "Jan 2009",
                            title: "Quantitative Easing Launches",
                            description: "Central banks began printing massive amounts of money to stimulate economies, devaluing currencies and creating concerns about inflation.",
                            impact: ""
                        },
                        {
                            date: "Jan 2009",
                            title: "Bitcoin Genesis Block",
                            description: "Satoshi Nakamoto mined the first Bitcoin block, embedding the headline Chancellor on brink of second bailout for banks. This directly referenced the ongoing financial crisis and positioned Bitcoin as an alternative to the failing traditional system, offering decentralized, transparent, and mathematically-governed money.",
                            impact: ""
                        },
                        
                    ],
                    problems: [
                        { icon: "🏦", title: "Centralisation", description: "Excessive centralisation leading to single points of failure" },
                        { icon: "🏦", title: "Transparency", description: "Lack of transparency in complex financial instruments" },
                        { icon: "🏦", title: "Morals", description: "Moral hazard from government bailouts" },
                        { icon: "🏦", title: "Inflationary monetary policy", description: "Inflationary monetary policy undermining currency stability" },
                    ],
                    bitcoinSolutions: [
                        { icon: "🔗", title: "Decentralisation", description: "Decentralised networks with no single point of failure" },
                        { icon: "🔗", title: "Clear Transparency", description: "Transparent, immutable ledgers for all transactions" },
                        { icon: "🔗", title: "Avoids Manipulation", description: "Algorithmic governance removing human manipulation" },
                        { icon: "🔗", title: "Inflation", description: "Fixed supply currencies protecting against inflation" },
                       
                    ],
                    statistics: [
                        { value: "$700B", label: "TARP Bailout" },
                        { value: "8.8 million", label: "Jobs Lost"},
                        { value: "S&P 500", label:"Declined by 38.5%"}
                        
                    ],
                }
            },
            color: 'from-yellow-500 to-lime-600'
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
                hash: '7cd39e5f2f31932b2e7525c5f3702686028b35b9ada923f7eeaac4d2d272b813',
                changeText: 'Alice sends 5 coins to Bo',
                changeHash: 'a1f6b901a8ab135c19864afdad4352ec697c754f68ba7a57d45e6378ba41c78d'

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
            story: "You've completed your journey through the blockchain universe! You now understand how this revolutionary technology creates trust without intermediaries, secures data with cryptography, and enables a new era of decentralised applications. The future is in your hands!",
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

    const renderInteractiveContent = (interactive:any) => {
        if (!interactive) return null;

        switch (interactive.type) {

            case 'financial-crisis':
                return (
                    <div className="mt-6 space-y-6">
                        {/* Timeline Section */}
                        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                            <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">📉</span>
                                2008 Financial Crisis Timeline
                            </h4>
                            <div className="space-y-4">
                                {interactive.data.timeline.map((event:any, idx:number) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-red-100">
                                        <div className="bg-red-100 rounded-full px-3 py-1 text-sm font-bold text-red-700 flex-shrink-0">
                                            {event.date}
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-semibold text-red-800 mb-1">{event.title}</h5>
                                            <p className="text-red-700 text-sm">{event.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Problems Exposed */}
                        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                            <h4 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">⚠️</span>
                                System Flaws Exposed
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {interactive.data.problems.map((problem:any, idx:number) => (
                                    <div key={idx} className="bg-white p-4 rounded-lg border border-orange-100">
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{problem.icon}</span>
                                            <div>
                                                <h5 className="font-semibold text-orange-800 mb-1">{problem.title}</h5>
                                                <p className="text-orange-700 text-sm">{problem.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bitcoin's Response */}
                        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                            <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">₿</span>
                                Bitcoin's Revolutionary Response
                            </h4>
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-lg border border-green-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold text-green-800">January 3, 2009</span>
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded font-mono text-sm text-gray-700 mb-3">
                                        "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
                                    </div>
                                    <p className="text-green-700 text-sm">
                                        This message, embedded in Bitcoin's Genesis Block, directly referenced the ongoing financial crisis and positioned Bitcoin as an alternative to the failing traditional system.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {interactive.data.bitcoinSolutions.map((solution:any, idx:number) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-green-100">
                                            <div className="flex items-start gap-3">
                                                <span className="text-xl">{solution.icon}</span>
                                                <div>
                                                    <h5 className="font-semibold text-green-800 mb-1">{solution.title}</h5>
                                                    <p className="text-green-700 text-sm">{solution.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Statistics */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                            <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">📊</span>
                                Crisis by the Numbers
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {interactive.data.statistics.map((stat:any, idx:number) => (
                                    <div key={idx} className="bg-white p-4 rounded-lg border border-blue-100 text-center">
                                        <div className="text-3xl font-bold text-blue-800 mb-1">{stat.value}</div>
                                        <div className="text-sm text-blue-600">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'comparison':
                return (
                <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🏛️</span>
                        Centralised Systems
                    </h4>
                    <ul className="space-y-2">
                        {interactive.data.centralised.map((item:any, idx:number) => (
                        <li key={idx} className="text-red-700 text-sm flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {item}
                        </li>
                        ))}
                    </ul>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🌐</span>
                        Decentralised Systems
                    </h4>
                    <ul className="space-y-2">
                        {interactive.data.decentralised.map((item:any, idx:number) => (
                        <li key={idx} className="text-green-700 text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {item}
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>
                );

            case 'block_builder':
                return (
                <div className="mt-6">
                    <h4 className="font-bold text-gray-800 mb-4">Interactive Blockchain</h4>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                    {interactive.data.blocks.map((block:any, idx:number) => (
                        <div className='flex items-center gap-2'>
                            <div key={block.id} className="bg-blue-50 p-4 rounded-xl border border-blue-200 min-w-64">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-blue-800">Block #{block.id}</span>
                                    <span className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">
                                    Hash: {block.hash}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {block.transactions.map((tx:any, txIdx:number) => (
                                    <div key={txIdx} className="text-sm bg-white p-2 rounded border text-gray-700">
                                        {tx}
                                    </div>
                                    ))}
                                </div>
                            </div>
                            {idx < interactive.data.blocks.length - 1 && (
                                <div className="flex justify-center mt-4">
                                    <ChevronRight className="w-6 h-6 text-blue-500" />
                                </div>
                            )}
                        </div>

                    ))}
                    </div>
                </div>
                );

            case 'hash_demo':
                return (
                <div className="mt-6 bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h4 className="font-bold text-purple-800 mb-4">Hash Demonstration</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-2">Example Data 1:</label>
                            <div className="bg-white p-3 rounded border text-gray-800 font-mono text-sm">
                                {interactive.data.originalText}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-2">Example Hash Output 1:</label>
                            <div className="bg-white p-3 rounded border text-purple-800 font-mono text-sm">
                                {interactive.data.hash}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-2">Example Data 2:</label>
                            <div className="bg-white p-3 rounded border text-gray-800 font-mono text-sm">
                                {interactive.data.changeText}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-2">Example Hash Output 2:</label>
                            <div className="bg-white p-3 rounded border text-purple-800 font-mono text-sm">
                                {interactive.data.changeHash}
                            </div>
                        </div>
                        <p className="text-sm text-purple-600 italic">
                            Changing even one character changes the hash completely!
                        </p>
                    </div>
                </div>
                );

            case 'mining_game':
                return (
                <div className="mt-6 bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-4">Mining Simulation</h4>
                    <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded border">
                        <div className="text-sm font-medium text-yellow-700 mb-2">Difficulty Level</div>
                        <div className="text-2xl font-bold text-yellow-800">{interactive.data.difficulty}</div>
                    </div>
                    <div className="bg-white p-4 rounded border">
                        <div className="text-sm font-medium text-yellow-700 mb-2">Block Reward</div>
                        <div className="text-2xl font-bold text-yellow-800">{interactive.data.reward} BTC</div>
                    </div>
                    </div>
                    <div className="mt-4 bg-yellow-100 p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Mining in Progress...</span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{width: '67%'}}></div>
                    </div>
                    </div>
                </div>
                );

            case 'network_visualization':
                return (
                <div className="mt-6 bg-teal-50 p-6 rounded-xl border border-teal-200">
                    <h4 className="font-bold text-teal-800 mb-4">Decentralised Network</h4>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                    {[...Array(12)].map((_, idx) => (
                        <div key={idx} className="bg-teal-100 p-3 rounded-lg text-center">
                        <div className="w-8 h-8 bg-teal-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">
                            {idx + 1}
                        </div>
                        <div className="text-xs text-teal-700">Node {idx + 1}</div>
                        </div>
                    ))}
                    </div>
                    <div className="text-center text-sm text-teal-600">
                    <Network className="w-5 h-5 inline mr-2" />
                    {interactive.data.nodes} nodes with {interactive.data.connections} connections
                    </div>
                </div>
                );

            case 'application_explorer':
                return (
                <div className="mt-6 grid grid-cols-2 gap-4">
                    {interactive.data.applications.map((app:any, idx:number) => (
                    <div key={idx} className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                        <span className="text-2xl">{app.icon}</span>
                        <div>
                            <h5 className="font-bold text-indigo-800">{app.name}</h5>
                            <p className="text-sm text-indigo-600 mt-1">{app.description}</p>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                );

            case 'certificate':
                return (
                <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                    <div className="text-center mb-6">
                        <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h4 className="text-2xl font-bold text-yellow-800 mb-2">Blockchain Master Certificate</h4>
                        <p className="text-yellow-700">You have successfully completed the Blockchain Adventure!</p>
                    </div>
                    <div className="space-y-2">
                        <h5 className="font-bold text-yellow-800">Achievements Unlocked:</h5>
                            {interactive.data.achievements.map((achievement:any, idx:number) => (
                                <div key={idx} className="flex items-center gap-2 text-yellow-700">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{achievement}</span>
                                </div>
                            ))}
                    </div>
                </div>
                );

            default:
                return null;
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
                    {currentStageData.concept && (
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
                    )}

                    {/* Interactive Content */}

                    {renderInteractiveContent(currentStageData.interactive)}

                    
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


                        {currentStage !== stages.length -1 ? (
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
                        ): (

                            <button
                                onClick={() => navigate("/")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold text-white hover:bg-white/20`}
                            >
                                Finish
                                <ChevronRight className="w-5 h-5" />
                            </button>


                        )}


                </div>
                </div>
            </div>
        </div>
    );


}

export {BlockchainWorld}