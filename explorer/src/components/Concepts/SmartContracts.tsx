import React, { useState, useEffect, useRef } from 'react';

export default function SmartContracts() {
    const [activeSection, setActiveSection] = useState('introduction');
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const sections = [
        {id: 'introduction', title: 'What are Smart Contracts?'},
        {id: 'how-it-works', title: 'How Smart Contracts Work'},
        {id: 'blockchain-relationship', title: 'Smart Contracts & Blockchain'},
        {id: 'key-features', title: 'Key Features & Benefits'},
        {id: 'use-cases', title: 'Real-World Applications'},
        {id: 'challenges', title: 'Challenges & Limitations'},
        {id: 'future', title: 'Future of Smart Contracts'},
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY || 0;
            const offset = 500;

            for (const section of sections) {
                const element = sectionRefs.current[section.id];
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (
                        scrollPosition >= offsetTop - offset &&
                        scrollPosition < offsetTop + offsetHeight - offset
                    ) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = sectionRefs.current[sectionId];
        if (element) {
            const offsetTop = element.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white'>
            {/* Header */}
            <div className='flex items-center justify-center w-full py-20 text-center mx-auto'>
                <h1 className='text-7xl text-white'>
                    Smart Contracts
                </h1>
            </div>

            <div className='flex'>
                {/* Navigation */}
                <nav className='w-96 p-6 ml-9 sticky top-20 h-screen overflow-y-auto border-r border-indigo-700/30'>
                    <ul className='space-y-2'>
                        {sections.map(section => (
                            <li key={section.id}>
                                <button
                                    onClick={() => scrollToSection(section.id)}
                                    className={`text-left w-full font-bold p-3 rounded transition-all ${
                                        activeSection === section.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-slate-300 hover:bg-indigo-800/50'
                                    }`}
                                >
                                    {section.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Content */}
                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto space-y-12">
                        
                        {/* Introduction Section */}
                        <section 
                            id="introduction" 
                            ref={(el) => { sectionRefs.current['introduction'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h1 className="text-4xl font-bold mb-6 text-indigo-300">What are Smart Contracts?</h1>
                            <div className="space-y-6 text-slate-200">
                                <p className="text-lg leading-relaxed">
                                    Smart contracts are self-executing digital agreements where the terms are directly written into code. 
                                    They automatically execute and enforce themselves when predetermined conditions are met, without requiring intermediaries.
                                </p>
                                
                                <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-700/30">
                                    <h3 className="font-semibold text-purple-300 mb-2">Simple Analogy:</h3>
                                    <p>
                                        Think of a smart contract like a vending machine. You put in exact change (meet the conditions), 
                                        select your item (trigger the contract), and the machine automatically gives you the product (executes the agreement). 
                                        No cashier or middleman needed!
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-green-300 mb-2">Traditional Contracts</h4>
                                        <ul className="text-sm space-y-1 text-slate-300">
                                            <li>• Require human interpretation</li>
                                            <li>• Need intermediaries (lawyers, banks)</li>
                                            <li>• Prone to disputes</li>
                                            <li>• Slow execution</li>
                                            <li>• High costs</li>
                                        </ul>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-purple-300 mb-2">Smart Contracts</h4>
                                        <ul className="text-sm space-y-1 text-slate-300">
                                            <li>• Automatic execution</li>
                                            <li>• No intermediaries needed</li>
                                            <li>• Tamper-proof</li>
                                            <li>• Instant settlement</li>
                                            <li>• Lower costs</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* How It Works Section */}
                        <section 
                            id="how-it-works" 
                            ref={(el) => { sectionRefs.current['how-it-works'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-6 text-indigo-300">How Smart Contracts Work</h2>
                            <p className="mb-8 text-slate-200">
                                Smart contracts follow a simple "if-then" logic but can handle complex scenarios. Here's the step-by-step process:
                            </p>

                            <div className="space-y-6">
                                {/* Step 1 */}
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 flex items-center justify-center bg-purple-800/50 rounded-full text-purple-400 font-bold text-xl flex-shrink-0">1</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-indigo-300 mb-2">Contract Creation</h3>
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <p className="text-slate-200">
                                                Developers write the contract code defining the rules, conditions, and actions. 
                                                The contract is then deployed to the blockchain network.
                                            </p>
                                            <div className="mt-3 p-3 bg-slate-900/50 rounded text-sm text-slate-300">
                                                <code>
                                                    if (payment_received == true && delivery_confirmed == true) {
                                                        }

                                                </code>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 flex items-center justify-center bg-purple-800/50 rounded-full text-purple-400 font-bold text-xl flex-shrink-0">2</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-indigo-300 mb-2">Event Trigger</h3>
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <p className="text-slate-200">
                                                External events or data (called "oracles") trigger the contract. This could be a payment, 
                                                a date, temperature reading, or any other predetermined condition.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 flex items-center justify-center bg-purple-800/50 rounded-full text-purple-400 font-bold text-xl flex-shrink-0">3</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-indigo-300 mb-2">Condition Verification</h3>
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <p className="text-slate-200">
                                                The blockchain network verifies that the conditions have been met. 
                                                Multiple nodes check the validity to ensure consensus.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 flex items-center justify-center bg-purple-800/50 rounded-full text-purple-400 font-bold text-xl flex-shrink-0">4</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-indigo-300 mb-2">Automatic Execution</h3>
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <p className="text-slate-200">
                                                Once conditions are verified, the contract automatically executes the agreed-upon actions. 
                                                This could include transferring funds, updating records, or triggering other contracts.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 5 */}
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 flex items-center justify-center bg-purple-800/50 rounded-full text-purple-400 font-bold text-xl flex-shrink-0">5</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-indigo-300 mb-2">Record & Finalize</h3>
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <p className="text-slate-200">
                                                The execution and results are permanently recorded on the blockchain, 
                                                creating an immutable audit trail of the contract's performance.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Blockchain Relationship Section */}
                        <section 
                            id="blockchain-relationship" 
                            ref={(el) => { sectionRefs.current['blockchain-relationship'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-6 text-indigo-300">Smart Contracts & Blockchain</h2>
                            <div className="space-y-6 text-slate-200">
                                <p className="text-lg">
                                    Smart contracts and blockchain technology are intrinsically linked. Blockchain provides the essential infrastructure 
                                    that makes smart contracts possible and trustworthy.
                                </p>

                                <div className="grid md:grid-cols-1 gap-6">
                                    <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-lg border border-purple-700/30">
                                        <h3 className="text-xl font-semibold text-indigo-300 mb-3">Why Blockchain is Essential for Smart Contracts</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <span className="text-indigo-400 font-bold">•</span>
                                                <div>
                                                    <strong className="text-indigo-300">Immutability:</strong> Once deployed, smart contracts cannot be altered, 
                                                    ensuring the terms remain unchanged.
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-indigo-400 font-bold">•</span>
                                                <div>
                                                    <strong className="text-indigo-300">Transparency:</strong> All contract code and execution history 
                                                    are visible on the blockchain.
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-indigo-400 font-bold">•</span>
                                                <div>
                                                    <strong className="text-indigo-300">Decentralization:</strong> No single entity controls the contract; 
                                                    it runs on a distributed network.
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-indigo-400 font-bold">•</span>
                                                <div>
                                                    <strong className="text-indigo-300">Security:</strong> Cryptographic security and consensus mechanisms 
                                                    protect against tampering.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-blue-300 mb-3">Popular Smart Contract Platforms</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-slate-900/50 p-4 rounded">
                                            <h4 className="font-semibold text-blue-300">Ethereum</h4>
                                            <p className="text-sm text-slate-300">Most popular platform, uses Solidity programming language</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded">
                                            <h4 className="font-semibold text-green-300">Binance Smart Chain</h4>
                                            <p className="text-sm text-slate-300">Ethereum-compatible, lower fees</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded">
                                            <h4 className="font-semibold text-purple-300">Polygon</h4>
                                            <p className="text-sm text-slate-300">Layer 2 solution, faster transactions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Key Features Section */}
                        <section 
                            id="key-features" 
                            ref={(el) => { sectionRefs.current['key-features'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-6 text-indigo-300">Key Features & Benefits</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="border-l-4 border-green-500 pl-4">
                                        <h3 className="font-semibold text-green-300">Automation</h3>
                                        <p className="text-slate-200">Eliminates manual processes and human intervention</p>
                                    </div>
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <h3 className="font-semibold text-blue-300">Trustless</h3>
                                        <p className="text-slate-200">Parties don't need to trust each other, only the code</p>
                                    </div>
                                    <div className="border-l-4 border-purple-500 pl-4">
                                        <h3 className="font-semibold text-indigo-300">Cost-Effective</h3>
                                        <p className="text-slate-200">Reduces fees by removing intermediaries</p>
                                    </div>
                                    <div className="border-l-4 border-yellow-500 pl-4">
                                        <h3 className="font-semibold text-yellow-300">Speed</h3>
                                        <p className="text-slate-200">Instant execution when conditions are met</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-red-500 pl-4">
                                        <h3 className="font-semibold text-red-300">Precision</h3>
                                        <p className="text-slate-200">Exact terms with no ambiguity or interpretation</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-4">
                                        <h3 className="font-semibold text-indigo-300">Global Access</h3>
                                        <p className="text-slate-200">Available 24/7 worldwide without geographic restrictions</p>
                                    </div>
                                    <div className="border-l-4 border-pink-500 pl-4">
                                        <h3 className="font-semibold text-pink-300">Programmable</h3>
                                        <p className="text-slate-200">Can handle complex logic and multiple conditions</p>
                                    </div>
                                    <div className="border-l-4 border-cyan-500 pl-4">
                                        <h3 className="font-semibold text-cyan-300">Audit Trail</h3>
                                        <p className="text-slate-200">Complete history of all contract interactions</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Use Cases Section */}
                        <section 
                            id="use-cases" 
                            ref={(el) => { sectionRefs.current['use-cases'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-6 text-purple-300">Real-World Applications</h2>
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 rounded-lg border border-blue-700/30">
                                        <h3 className="text-xl font-semibold text-blue-300 mb-3">Decentralized Finance (DeFi)</h3>
                                        <p className="text-slate-200 mb-3">
                                            Smart contracts power lending, borrowing, and trading without traditional banks.
                                        </p>
                                        <ul className="text-sm text-slate-300 space-y-1">
                                            <li>• Automated lending protocols</li>
                                            <li>• Decentralized exchanges</li>
                                            <li>• Yield farming platforms</li>
                                            <li>• Liquidity pools</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-6 rounded-lg border border-green-700/30">
                                        <h3 className="text-xl font-semibold text-green-300 mb-3">Supply Chain Management</h3>
                                        <p className="text-slate-200 mb-3">
                                            Track products from manufacturing to delivery with automatic payments and quality checks.
                                        </p>
                                        <ul className="text-sm text-slate-300 space-y-1">
                                            <li>• Product authenticity verification</li>
                                            <li>• Automated quality control</li>
                                            <li>• Milestone-based payments</li>
                                            <li>• Transparency for consumers</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-6 rounded-lg border border-purple-700/30">
                                        <h3 className="text-xl font-semibold text-purple-300 mb-3">Insurance</h3>
                                        <p className="text-slate-200 mb-3">
                                            Automatic claim processing based on verifiable data like weather or flight delays.
                                        </p>
                                        <ul className="text-sm text-slate-300 space-y-1">
                                            <li>• Flight delay insurance</li>
                                            <li>• Weather-based crop insurance</li>
                                            <li>• Automated claim payouts</li>
                                            <li>• Reduced fraud and costs</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 p-6 rounded-lg border border-yellow-700/30">
                                        <h3 className="text-xl font-semibold text-yellow-300 mb-3">Real Estate</h3>
                                        <p className="text-slate-200 mb-3">
                                            Automate property transactions, rentals, and fractional ownership.
                                        </p>
                                        <ul className="text-sm text-slate-300 space-y-1">
                                            <li>• Automated escrow services</li>
                                            <li>• Property tokenization</li>
                                            <li>• Rental payment automation</li>
                                            <li>• Fractional property ownership</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-indigo-300 mb-3">Example: Flight Insurance Smart Contract</h3>
                                    <div className="bg-slate-900/50 p-4 rounded text-sm">
                                        <p className="text-slate-200 mb-2">A practical example of how a smart contract works:</p>
                                        <div className="text-slate-300 space-y-1">
                                            <p>1. <strong>Purchase:</strong> Customer buys flight insurance for $50</p>
                                            <p>2. <strong>Condition:</strong> "If flight is delayed by 2+ hours, pay $500"</p>
                                            <p>3. <strong>Data Source:</strong> Contract monitors flight status via airline API</p>
                                            <p>4. <strong>Trigger:</strong> Flight shows 2.5 hour delay</p>
                                            <p>5. <strong>Execution:</strong> Contract automatically sends $500 to customer</p>
                                            <p>6. <strong>Record:</strong> Transaction recorded on blockchain permanently</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Challenges Section */}
                        <section 
                            id="challenges" 
                            ref={(el) => { sectionRefs.current['challenges'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-6 text-indigo-300">Challenges & Limitations</h2>
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-red-900/20 p-6 rounded-lg border border-red-700/30">
                                        <h3 className="text-xl font-semibold text-red-300 mb-3">Technical Challenges</h3>
                                        <ul className="text-slate-200 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-red-400 mt-1">•</span>
                                                <span><strong>Immutability:</strong> Bugs can't be fixed once deployed</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-red-400 mt-1">•</span>
                                                <span><strong>Oracle Problem:</strong> Reliance on external data sources</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-red-400 mt-1">•</span>
                                                <span><strong>Scalability:</strong> Network congestion increases costs</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-red-400 mt-1">•</span>
                                                <span><strong>Gas Fees:</strong> High transaction costs on popular networks</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-orange-900/20 p-6 rounded-lg border border-orange-700/30">
                                        <h3 className="text-xl font-semibold text-orange-300 mb-3">Legal & Regulatory</h3>
                                        <ul className="text-slate-200 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-400 mt-1">•</span>
                                                <span><strong>Legal Recognition:</strong> Not recognized in all jurisdictions</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-400 mt-1">•</span>
                                                <span><strong>Compliance:</strong> Complex regulatory requirements</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-400 mt-1">•</span>
                                                <span><strong>Privacy:</strong> All transactions are public</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-orange-400 mt-1">•</span>
                                                <span><strong>Dispute Resolution:</strong> Limited recourse for problems</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-blue-300 mb-3">Overcoming Challenges</h3>
                                    <div className="text-slate-200 space-y-3">
                                        <p>
                                            <strong>Testing & Auditing:</strong> Extensive testing and professional audits help identify bugs before deployment.
                                        </p>
                                        <p>
                                            <strong>Upgradeability Patterns:</strong> New contract designs allow for controlled upgrades while maintaining security.
                                        </p>
                                        <p>
                                            <strong>Layer 2 Solutions:</strong> Technologies like Polygon and Arbitrum reduce costs and increase speed.
                                        </p>
                                        <p>
                                            <strong>Hybrid Approaches:</strong> Combining traditional legal frameworks with smart contract automation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Future Section */}
                        <section 
                            id="future" 
                            ref={(el) => { sectionRefs.current['future'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-6 text-indigo-300">Future of Smart Contracts</h2>
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-lg border border-purple-700/30">
                                    <h3 className="text-xl font-semibold text-purple-300 mb-4">Emerging Trends</h3>
                                    <div className="grid md:grid-cols-2 gap-4 text-slate-200">
                                        <div>
                                            <h4 className="font-semibold text-pink-300 mb-2">AI Integration</h4>
                                            <p className="text-sm">Smart contracts that adapt and learn from data patterns</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-blue-300 mb-2">IoT Integration</h4>
                                            <p className="text-sm">Contracts triggered by real-world sensor data</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-300 mb-2">Cross-Chain Compatibility</h4>
                                            <p className="text-sm">Contracts that work across multiple blockchain networks</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-yellow-300 mb-2">Enhanced Privacy</h4>
                                            <p className="text-sm">Zero-knowledge proofs for private contract execution</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-indigo-300 mb-4">Industry Adoption Predictions</h3>
                                    <div className="space-y-4 text-slate-200">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-green-400 text-sm">✓</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-300">Near-term (1-3 years)</h4>
                                                <p className="text-sm">Widespread adoption in DeFi, supply chain, and digital identity verification</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-yellow-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-yellow-400 text-sm">○</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-yellow-300">Medium-term (3-7 years)</h4>
                                                <p className="text-sm">Integration with traditional business systems, government services, and healthcare</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-blue-400 text-sm">◎</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-blue-300">Long-term (7+ years)</h4>
                                                <p className="text-sm">Smart contracts become standard for most digital agreements and transactions</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-indigo-300 mb-4">Key Developments to Watch</h3>
                                    <div className="grid md:grid-cols-2 gap-4 text-slate-200">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-cyan-300">Technology Improvements</h4>
                                            <ul className="text-sm space-y-1 text-slate-300">
                                                <li>• Faster transaction processing</li>
                                                <li>• Lower gas fees</li>
                                                <li>• Better debugging tools</li>
                                                <li>• Enhanced security features</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-pink-300">Regulatory Progress</h4>
                                            <ul className="text-sm space-y-1 text-slate-300">
                                                <li>• Clear legal frameworks</li>
                                                <li>• International standards</li>
                                                <li>• Consumer protection laws</li>
                                                <li>• Tax guidance</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-lg border border-purple-500/30">
                                    <h3 className="text-xl font-semibold text-indigo-300 mb-3">The Road Ahead</h3>
                                    <p className="text-slate-200 leading-relaxed">
                                        Smart contracts represent a fundamental shift toward automated, trustless systems that could reshape how we conduct business, 
                                        govern organizations, and interact with digital services. As the technology matures and regulatory frameworks develop, 
                                        we can expect to see smart contracts become as commonplace as traditional contracts are today.
                                    </p>
                                    <p className="text-slate-200 leading-relaxed mt-3">
                                        The future promises more sophisticated contracts capable of handling complex real-world scenarios while maintaining 
                                        the core benefits of automation, transparency, and trust. Success will depend on solving current challenges around 
                                        scalability, user experience, and regulatory compliance.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}