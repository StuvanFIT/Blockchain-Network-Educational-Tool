import React, { useState, useEffect, useRef } from 'react';

export default function CryptoCurrencyInvestment() {
    const [activeSection, setActiveSection] = useState('introduction');
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const sections = [
        {id: 'introduction', title: 'Understanding the relationship'},
        {id: 'what-is-crypto', title: 'What is cryptocurrency?' },
        {id: 'how-crypto-uses-blockchain', title: 'How cryptocurrency uses blockchain' },
        {id: 'key-differences', title: "Key differences and similarities"},
        {id: 'types-of-crypto', title: 'Types of cryptocurrencies'},
        {id: 'beyond-crypto', title: 'Blockchain beyond cryptocurrency'},
        {id: 'future-outlook', title: 'Future outlook and challenges'},
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY || 0;
            const offset = 150;

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
            {/*Table of contents section */}
            <div className='flex items-center justify-center w-full py-20 text-center mx-auto'>
                <h1 className='text-7xl'>Cryptocurrency & Blockchain</h1>
            </div>

            <div className='flex'>
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

                {/*Content */}
                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto space-y-12">
                        
                        <section 
                            id="introduction" 
                            ref={(el) => { sectionRefs.current['introduction'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h1 className="text-4xl font-bold mb-6 text-indigo-300">Understanding the Relationship</h1>
                            <p className="text-lg leading-relaxed text-slate-200">
                                Cryptocurrency and blockchain are closely related technologies, but they serve different purposes. 
                                While blockchain is the underlying technology, cryptocurrency is one of its most prominent applications.
                            </p>
                            <div className="space-y-4 text-slate-200 mt-6">
                                <p>
                                    Cryptocurrency relies on blockchain technology to function as a decentralized digital currency system. 
                                    However, blockchain's potential extends far beyond cryptocurrency, encompassing supply chain management, 
                                    healthcare records, voting systems, and many other applications.
                                </p>
                                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
                                    <p className="font-semibold text-indigo-300">Key Relationship:</p>
                                    <p>Think of blockchain as the highway system, and cryptocurrency as one type of vehicle that travels on it. 
                                    The highway enables the vehicle to function, but many other types of vehicles can also use the same infrastructure.</p>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="what-is-crypto" 
                            ref={(el) => { sectionRefs.current['what-is-crypto'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">What is Cryptocurrency?</h2>
                            <div className="space-y-4 text-slate-200">
                                <p>
                                    Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates independently 
                                    of traditional banking systems. Unlike traditional currencies issued by governments, cryptocurrencies are typically 
                                    decentralized and managed by blockchain networks.
                                </p>

                                <div className="bg-slate-800/50 p-6 rounded-lg space-y-4">
                                    <h3 className="font-semibold text-xl text-indigo-300">Core Characteristics</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="border-l-4 border-cyan-500 pl-4">
                                                <h4 className="font-semibold text-cyan-300">Digital Nature</h4>
                                                <p className="text-sm">Exists only in electronic form, no physical coins or bills</p>
                                            </div>
                                            <div className="border-l-4 border-cyan-500 pl-4">
                                                <h4 className="font-semibold text-cyan-300">Cryptographic Security</h4>
                                                <p className="text-sm">Uses advanced encryption to secure transactions</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="border-l-4 border-cyan-500 pl-4">
                                                <h4 className="font-semibold text-cyan-300">Decentralization</h4>
                                                <p className="text-sm">No central authority controls the currency</p>
                                            </div>
                                            <div className="border-l-4 border-cyan-500 pl-4">
                                                <h4 className="font-semibold text-cyan-300">Peer-to-Peer</h4>
                                                <p className="text-sm">Direct transactions between users without intermediaries</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
                                    <p className="font-semibold text-indigo-300">Historical Context:</p>
                                    <p>Bitcoin, created in 2009, was the first successful cryptocurrency and demonstrated how blockchain 
                                    technology could enable digital money without requiring trust in a central authority.</p>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="how-crypto-uses-blockchain" 
                            ref={(el) => { sectionRefs.current['how-crypto-uses-blockchain'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">How Cryptocurrency Uses Blockchain</h2>
                            <p className='mb-9'>Cryptocurrency systems leverage blockchain technology to create a secure, transparent, and decentralized monetary system. Here's how they work together:</p>

                            <div className="space-y-4 text-slate-200">
                                {/* Step 1: Transaction Recording */}
                                <div className='space-y-4'> 
                                    <div className='flex items-center gap-4'>
                                        <div className='w-16 h-16 flex items-center justify-center bg-slate-800/50 rounded-full text-cyan-400 font-bold text-xl'>1</div>
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-2">Transaction Recording</h3>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <p>
                                            When someone sends cryptocurrency to another person, the transaction is recorded on the blockchain. 
                                            Each transaction includes the sender's address, recipient's address, amount transferred, and a timestamp.
                                        </p>

                                        <ul className="list-disc ml-6 mt-2 space-y-1 text-white/80">
                                            <li>Digital wallets generate unique addresses for sending and receiving</li>
                                            <li>Private keys provide ownership proof and signing authority</li>
                                            <li>Public keys allow others to verify transactions</li>
                                            <li>Transaction fees incentivize network validators</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Step 2: Verification and Mining */}
                                <div className='space-y-4'> 
                                    <div className='flex items-center gap-4'>
                                        <div className='w-16 h-16 flex items-center justify-center bg-slate-800/50 rounded-full text-cyan-400 font-bold text-xl'>2</div>
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-2">Verification and Mining</h3>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <p>
                                            Network participants (miners or validators) verify transactions by checking that the sender has sufficient 
                                            funds and that the transaction is legitimate. In Proof of Work systems, miners compete to solve complex 
                                            mathematical puzzles to add new blocks to the chain.
                                        </p>
                                        <br />
                                        <p>
                                            Successful miners or validators receive cryptocurrency rewards for their work, creating economic incentives 
                                            to maintain network security and process transactions efficiently.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3: Immutable Ledger */}
                                <div className='space-y-4'> 
                                    <div className='flex items-center gap-4'>
                                        <div className='w-16 h-16 flex items-center justify-center bg-slate-800/50 rounded-full text-cyan-400 font-bold text-xl'>3</div>
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-2">Immutable Ledger</h3>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <p>
                                            Once verified, transactions are permanently recorded in blocks and linked to previous blocks through 
                                            cryptographic hashes. This creates an immutable history of all cryptocurrency transactions, preventing 
                                            double-spending and fraud.
                                        </p>
                                        <br />
                                        <p>
                                            The blockchain serves as a public ledger that anyone can audit, ensuring transparency while maintaining 
                                            user privacy through pseudonymous addresses rather than real names.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4: Decentralized Consensus */}
                                <div className='space-y-4'> 
                                    <div className='flex items-center gap-4'>
                                        <div className='w-16 h-16 flex items-center justify-center bg-slate-800/50 rounded-full text-cyan-400 font-bold text-xl'>4</div>
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-2">Decentralized Consensus</h3>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <p>
                                            The blockchain network reaches consensus on the current state of all account balances without requiring 
                                            a central authority. This eliminates the need for banks or governments to validate transactions, 
                                            creating a truly peer-to-peer monetary system.
                                        </p>
                                        <br />
                                        <p>
                                            Network participants maintain synchronized copies of the blockchain, ensuring the system remains 
                                            operational even if some nodes fail or are compromised.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <section 
                            id="key-differences" 
                            ref={(el) => { sectionRefs.current['key-differences'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Key Differences and Similarities</h2>
                            <div className="space-y-6 text-slate-200">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 rounded-lg border border-blue-700/30">
                                        <h3 className="font-semibold text-blue-300 mb-4 text-xl">Blockchain Technology</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li>• Underlying infrastructure and protocol</li>
                                            <li>• Distributed ledger technology</li>
                                            <li>• Can support multiple applications</li>
                                            <li>• Focuses on data integrity and consensus</li>
                                            <li>• Platform for various use cases</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 p-6 rounded-lg border border-orange-700/30">
                                        <h3 className="font-semibold text-orange-300 mb-4 text-xl">Cryptocurrency</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li>• Application built on blockchain</li>
                                            <li>• Digital currency and payment system</li>
                                            <li>• Specific use case of blockchain</li>
                                            <li>• Focuses on value transfer and storage</li>
                                            <li>• One of many blockchain applications</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-indigo-300 mb-4 text-xl">Shared Characteristics</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="border-l-4 border-green-500 pl-4">
                                                <h4 className="font-semibold text-green-300">Decentralization</h4>
                                                <p className="text-sm">Both operate without central authorities</p>
                                            </div>
                                            <div className="border-l-4 border-green-500 pl-4">
                                                <h4 className="font-semibold text-green-300">Transparency</h4>
                                                <p className="text-sm">All transactions are publicly verifiable</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="border-l-4 border-green-500 pl-4">
                                                <h4 className="font-semibold text-green-300">Immutability</h4>
                                                <p className="text-sm">Records cannot be easily altered or deleted</p>
                                            </div>
                                            <div className="border-l-4 border-green-500 pl-4">
                                                <h4 className="font-semibold text-green-300">Security</h4>
                                                <p className="text-sm">Cryptographic protection against tampering</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="types-of-crypto" 
                            ref={(el) => { sectionRefs.current['types-of-crypto'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Types of Cryptocurrencies</h2>
                            <div className="space-y-6 text-slate-200">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 p-4 rounded-lg border border-yellow-700/30">
                                        <h3 className="font-semibold text-yellow-300 mb-2">Bitcoin (BTC)</h3>
                                        <p className="text-sm mb-2">The first and most well-known cryptocurrency, designed as digital gold and store of value.</p>
                                        <p className="text-xs text-yellow-200">Uses: Peer-to-peer payments, store of value, digital gold</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-4 rounded-lg border border-purple-700/30">
                                        <h3 className="font-semibold text-purple-300 mb-2">Ethereum (ETH)</h3>
                                        <p className="text-sm mb-2">Platform for smart contracts and decentralized applications, with its own currency.</p>
                                        <p className="text-xs text-purple-200">Uses: Smart contracts, DeFi, NFTs, dApps</p>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-indigo-300 mb-4 text-xl">Cryptocurrency Categories</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-cyan-300">Payment Coins</h4>
                                            <p className="text-sm">Designed for transactions and payments</p>
                                            <p className="text-xs text-slate-400">Examples: Bitcoin, Litecoin, Dogecoin</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-cyan-300">Utility Tokens</h4>
                                            <p className="text-sm">Provide access to specific services or platforms</p>
                                            <p className="text-xs text-slate-400">Examples: Ethereum, Chainlink, Polygon</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-cyan-300">Stablecoins</h4>
                                            <p className="text-sm">Pegged to stable assets like fiat currencies</p>
                                            <p className="text-xs text-slate-400">Examples: USDT, USDC, DAI</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="beyond-crypto" 
                            ref={(el) => { sectionRefs.current['beyond-crypto'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className='text-3xl font-bold mb-4 text-indigo-300'>Blockchain Beyond Cryptocurrency</h2>
                            <div className='bg-slate-800/50 p-6 rounded-lg space-y-6'>
                                <p>
                                    While cryptocurrency was blockchain's first major application, the technology has evolved to support 
                                    numerous other use cases that don't involve digital currency. These applications leverage blockchain's 
                                    core benefits of decentralization, transparency, and immutability for various industries.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold text-green-300">Non-Cryptocurrency Applications</h3>
                                        <div className="space-y-3">
                                            <div className="border-l-4 border-green-500 pl-4">
                                                <h4 className="font-semibold text-green-300">Supply Chain Management</h4>
                                                <p className="text-sm">Track products from origin to consumer, ensuring authenticity and preventing fraud</p>
                                            </div>
                                            <div className="border-l-4 border-green-500 pl-4">
                                                <h4 className="font-semibold text-green-300">Healthcare Records</h4>
                                                <p className="text-sm">Secure, shareable patient data while maintaining privacy</p>
                                            </div>
                                            <div className="border-l-4 border-green-500 pl-4">
                                                <h4 className="font-semibold text-green-300">Voting Systems</h4>
                                                <p className="text-sm">Transparent, tamper-proof election processes</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold text-blue-300">Emerging Use Cases</h3>
                                        <div className="space-y-3">
                                            <div className="border-l-4 border-blue-500 pl-4">
                                                <h4 className="font-semibold text-blue-300">Digital Identity</h4>
                                                <p className="text-sm">Self-sovereign identity management without central authorities</p>
                                            </div>
                                            <div className="border-l-4 border-blue-500 pl-4">
                                                <h4 className="font-semibold text-blue-300">Real Estate</h4>
                                                <p className="text-sm">Property records, ownership transfers, and fractional ownership</p>
                                            </div>
                                            <div className="border-l-4 border-blue-500 pl-4">
                                                <h4 className="font-semibold text-blue-300">Intellectual Property</h4>
                                                <p className="text-sm">Copyright protection and patent registration</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="future-outlook" 
                            ref={(el) => { sectionRefs.current['future-outlook'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20 space-y-8"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Future Outlook and Challenges</h2>

                            <div className='bg-slate-800/50 p-8 rounded-lg space-y-8'>
                                <div className="grid md:grid-cols-2 gap-6 text-slate-200">
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold text-green-300">Opportunities</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">✓</span>
                                                <span>Central Bank Digital Currencies (CBDCs)</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">✓</span>
                                                <span>DeFi (Decentralized Finance) expansion</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">✓</span>
                                                <span>NFTs and digital asset ownership</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">✓</span>
                                                <span>Cross-border payment solutions</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold text-red-300">Challenges</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">×</span>
                                                <span>Regulatory uncertainty and compliance</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">×</span>
                                                <span>Environmental concerns (energy usage)</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">×</span>
                                                <span>Scalability and transaction speed</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">×</span>
                                                <span>User adoption and education barriers</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className='text-2xl text-indigo-300 font-bold'>The Evolution Continues</h3>
                                    <p>
                                        The relationship between cryptocurrency and blockchain continues to evolve as both technologies mature. 
                                        While cryptocurrencies drove blockchain's initial adoption, we're now seeing blockchain applications 
                                        that operate independently of digital currencies.
                                    </p>
                                    <p>
                                        Future developments may include more energy-efficient consensus mechanisms, improved scalability solutions, 
                                        and better integration with traditional financial systems. The key will be balancing innovation with 
                                        regulation to ensure these technologies benefit society while maintaining security and stability.
                                    </p>
                                </div>

                                <div className="bg-indigo-900/30 p-6 rounded-lg border border-indigo-700/30">
                                    <h4 className="font-semibold text-indigo-300 mb-2">Key Takeaway</h4>
                                    <p>
                                        Cryptocurrency and blockchain are interdependent yet distinct. Cryptocurrency depends on blockchain 
                                        for its existence, while blockchain technology has applications far beyond digital currency. 
                                        Understanding this relationship is crucial for anyone looking to engage with either technology.
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