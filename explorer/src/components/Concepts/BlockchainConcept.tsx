import React, { useState, useEffect, useRef } from 'react';

export default function BlockChainConcept() {
    const [activeSection, setActiveSection] = useState('introduction');
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const sections = [
        {id: 'introduction', title: 'Understanding blockchain technology'},
        {id: 'process', title: 'How does blockchain work?' },
        {id: 'key-features', title: 'Key Features of Blockchain?' },
        {id: 'types', title: "What are the types of blockchain networks?"},
        {id: 'pow-pos', title: 'What is proof of work and how is it different from proof of stake?'},
        {id: 'benefits', title: 'How do industries benefit from blockchain?'},
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY || 0; // Get the current vertical scroll position of the window
            const offset = 150; // Buffer for when a section is considered 'in view'

            // Loop through all defined sections
            for (const section of sections) {
                const element = sectionRefs.current[section.id]; // Get the DOM element for this section
                if (element) {
                    const { offsetTop, offsetHeight } = element; // Get the section's position and height
                    // If the current scroll position is within this section (accounting for offset)
                    if (
                        scrollPosition >= offsetTop - offset &&
                        scrollPosition < offsetTop + offsetHeight - offset
                    ) {
                        setActiveSection(section.id); // Highlight this section in your table of contents
                        break; // Stop checking once a match is found
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll); // Attach the scroll listener when the component mounts

        return () => window.removeEventListener('scroll', handleScroll); // Clean up the listener on unmount
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = sectionRefs.current[sectionId]; // Get the DOM element for the section
        if (element) {
            const offsetTop = element.offsetTop - 100; // Scroll to slightly above the section (to account for fixed headers)
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth', // Enable smooth scroll animation
            });
        }
    };



    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white'>
            {/*Table of contents section */}
            <div className='flex items-center justify-center w-full py-20 text-center mx-auto'>
                <h1 className='text-7xl'>What is Blockchain Technology?</h1>
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
                            <h1 className="text-4xl font-bold mb-6 text-indigo-300">Understanding Blockchain Technology</h1>
                            <p className="text-lg leading-relaxed text-slate-200">
                                Blockchain is a revolutionary technology that's transforming how we store, verify, and transfer data. 
                                This comprehensive guide will take you through everything you need to know about blockchain, from basic concepts to advanced applications.
                            </p>
                            <div className="space-y-4 text-slate-200 mt-6">
                                <p>
                                    A blockchain is a distributed ledger technology that maintains a continuously growing list of records, 
                                    called blocks, which are linked and secured using cryptography. Each block contains a cryptographic hash 
                                    of the previous block, a timestamp, and transaction data.
                                </p>
                                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
                                    <p className="font-semibold text-indigo-300">Key Analogy:</p>
                                    <p>Think of blockchain as a digital notebook that's copied across thousands of computers. 
                                    When someone wants to add a new page, all computers must agree it's valid before it's added.</p>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="process" 
                            ref={(el) => { sectionRefs.current['process'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">How Blockchain Works</h2>
                            <p className='mb-9'>The underlying Blockchain mechanisms are complex and difficult to understand for most people. Here, we will give a brief overview in the following steps. Blockchain software mostly automate these steps.</p>

                            <div className="space-y-4 text-slate-200">
                                {/* Step 1: Transaction Initiation */}
                                <div className='space-y-4'> 
                                    <div className='flex items-center gap-4'>
                                        <div className='w-16 h-16 flex items-center justify-center bg-slate-800/50 rounded-full text-cyan-400 font-bold text-xl'>1</div>
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-2">Transaction Initiation</h3>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <p>
                                        A user initiates a transaction, which is broadcast to the network. A blockchain transaction will show the movement of physical and digital assets from one party to another in the blockchain network. Data is recorded in a data block and may include details such as the following:
                                        </p>

                                        <ul className="list-disc ml-6 mt-2 space-y-1 text-white/80">
                                        <li>Who was involved in the transaction?</li>
                                        <li>What assets were exchanged?</li>
                                        <li>When did the transaction occur?</li>
                                        <li>Where was it recorded on the chain?</li>
                                        <li>Why did this transaction occur?</li>
                                        <li>How much of the asset was in the transaction?</li>
                                        </ul>
                                    </div>
                                    </div>

                                    {/* Step 2: Agreed Consensus */}
                                    <div className='space-y-4'> 
                                    <div className='flex items-center gap-4'>
                                        <div className='w-16 h-16 flex items-center justify-center bg-slate-800/50 rounded-full text-cyan-400 font-bold text-xl'>2</div>
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-2">Agreed Consensus</h3>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <p>
                                        In a distributed blockchain network, it is essential that the majority of participating nodes reach a consensus regarding the validity of each recorded transaction. This consensus ensures that all participants maintain a consistent and tamper-resistant copy of the blockchain ledger. The specific method used to achieve this agreement—commonly referred to as a consensus mechanism—can vary depending on the type and design of the blockchain network. For instance, public blockchains like Bitcoin typically use Proof of Work (PoW), while others may rely on Proof of Stake (PoS) or Practical Byzantine Fault Tolerance (PBFT).
                                        </p>
                                        <br />
                                        <p>
                                        These mechanisms define the criteria and processes by which transactions are verified, blocks are added, and disagreements are resolved. Importantly, the rules governing consensus are not arbitrary; they are established during the initial setup and configuration of the blockchain network and are often embedded in the protocol's code. These foundational rules ensure that all nodes follow a uniform procedure when validating transactions, thereby preserving the integrity, security, and trustworthiness of the entire distributed system.
                                        </p>
                                    </div>
                                    </div>

                                    {/* Step 3: Link the Blocks */}
                                    <div className='space-y-4'> 
                                    <div className='flex items-center gap-4'>
                                        <div className='w-16 h-16 flex items-center justify-center bg-slate-800/50 rounded-full text-cyan-400 font-bold text-xl'>3</div>
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-2">Link the Blocks</h3>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <p>
                                        Once a transaction has been verified and added to a block, that block is cryptographically linked to the previous one, forming a chain of blocks—hence the term "blockchain." Each block contains a unique hash of its contents and the hash of the preceding block. This chaining mechanism ensures the immutability of the blockchain: altering any single block would break the chain unless all subsequent hashes are recalculated.
                                        </p>
                                        <br />
                                        <p>
                                        This cryptographic linkage enhances security and makes it extremely difficult for malicious actors to tamper with historical data without detection. It also allows for a transparent and traceable history of all transactions stored within the ledger.
                                        </p>
                                    </div>
                                    </div>

                                    {/* Step 4: Share the Ledger */}
                                    <div className='space-y-4'> 
                                    <div className='flex items-center gap-4'>
                                        <div className='w-16 h-16 flex items-center justify-center bg-slate-800/50 rounded-full text-cyan-400 font-bold text-xl'>4</div>
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-2">Share the Ledger</h3>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <p>
                                        After the new block is linked, the updated blockchain is distributed across the entire network. Every participant (node) updates their copy of the ledger, ensuring that all parties reflect the most recent and agreed-upon state. This distributed synchronization is what gives the blockchain its decentralized and resilient nature.
                                        </p>
                                        <br />
                                        <p>
                                        Because every node maintains a complete copy of the ledger, the system remains operational and trustworthy even if some nodes go offline or become compromised. This redundancy and transparency make blockchain a reliable foundation for secure and decentralized data management.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <section 
                            id="key-features" 
                            ref={(el) => { sectionRefs.current['key-features'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Key Features</h2>
                            <div className="space-y-4 text-slate-200">
                                <div className="space-y-3">
                                    <div className="border-l-4 border-indigo-500 pl-4">
                                        <h3 className="font-semibold text-indigo-300">Decentralisation</h3>
                                        <p>No single point of control; distributed across multiple nodes.</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-4">
                                        <h3 className="font-semibold text-indigo-300">Immutability</h3>
                                        <p>Once data is recorded, it becomes extremely difficult to change.</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-4">
                                        <h3 className="font-semibold text-indigo-300">Transparency</h3>
                                        <p>All transactions are visible to network participants.</p>
                                    </div>
                                    <div className="border-l-4 border-indigo-500 pl-4">
                                        <h3 className="font-semibold text-indigo-300">Security</h3>
                                        <p>Cryptographic hashing and consensus mechanisms ensure security.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="types" 
                            ref={(el) => { sectionRefs.current['types'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Types of Blockchain</h2>
                            <div className="grid md:grid-cols-3 gap-4 text-slate-200">
                                <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-4 rounded-lg border border-green-700/30">
                                    <h3 className="font-semibold text-green-300 mb-2">Public Blockchain</h3>
                                    <p className="text-sm">Open to everyone, fully decentralised. All members are able to read, edit and validate the blockchain.</p>
                                    <p className='text-sm'>Examples: Bitcoin, Ethereum</p>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 p-4 rounded-lg border border-yellow-700/30">
                                    <h3 className="font-semibold text-yellow-300 mb-2">Private Blockchain</h3>
                                    <p className="text-sm">Restricted access, controlled by a single organisation. The authority system determines who is able to become a member and what rights they have in the network.</p>
                                    <p className='text-sm'>Examples: Ripple, a digital currency exchange network for businesses.</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-4 rounded-lg border border-purple-700/30">
                                    <h3 className="font-semibold text-purple-300 mb-2">Hybrid Blockchain</h3>
                                    <p className="text-sm">Combines public and private elements. In this way, businesses can control access to specific data stored on the blockchain whilst keeping other data public.</p>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="pow-pos" 
                            ref={(el) => { sectionRefs.current['pow-pos'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className='text-3xl font-bold mb-4 text-indigo-300'>Proof of Work vs Proof of Stake</h2>
                            <div className='bg-slate-800/50 p-6 rounded-lg'>
                                <p>
                                    There are 2 main ways blockchain nodes in a network can come to a consensus: through private blockchains, where trusted corporations acts as gatekeepers of changes, updates or additions
                                    to the blockchain, or via mass-populated public blockchains.
                                </p>
                                <br/>
                                <p>
                                    Most of the public blockchains arrive at an consensus by a proof-of-work (POW) or proof-of-stake (POS) system.
                                    In a proof-of-work system, the first peer/node that successfully verifies a new data addition or transaction on the blockchain
                                    will receive a specific number of tokens as a reward (coinbase transaction). To complete the verification process, miners must solve
                                    complex cryptographic problems. The first miner who solves the complex puzzle is awarded tokens.
                                </p>
                                
                            </div>
                        </section>

                        <section 
                            id="benefits" 
                            ref={(el) => { sectionRefs.current['benefits'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20 space-y-8"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">How Industries Benefit from Blockchain</h2>

                            <div className='bg-slate-800/50 p-8 rounded-lg space-y-8'>
                                <div className="grid md:grid-cols-2 gap-6 text-slate-200">
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold text-green-300">Benefits</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">✓</span>
                                                <span>Reduced need for intermediaries</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">✓</span>
                                                <span>Enhanced security and transparency</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">✓</span>
                                                <span>Lower transaction costs</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">✓</span>
                                                <span>24/7 availability</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold text-red-300">Challenges</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">×</span>
                                                <span>High energy consumption</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">×</span>
                                                <span>Scalability limitations</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">×</span>
                                                <span>Regulatory uncertainty</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-red-400 mr-2">×</span>
                                                <span>Technical complexity</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <p>
                                    Originally, various of people on blockchains mined as a hobby. But because the blockchain process was seen as potentially lucrative, blockchain mining has been industrialised.
                                    These proof-of-work blockchain mining pools have gathered and attracted attention for the amount of energy they consume.
                                </p>
                                <p>
                                    Blockchains could potentially create new opportunities for businesses. Blockchain technology is being adopted in an innovative manner by various industries.
                                </p>

                                <h3 className='text-2xl text-indigo-300 font-bold mb-4'>Energy Industry</h3>
                                <p>
                                    Energy companies can benefit from blockchain by enabling decentralised energy trading, where consumers can buy and sell excess solar or wind power peer-to-peer without relying on a central utility.
                                    Blockchain provides a transparent and secure way to record energy production and consumption, supporting real-time settlement and smart contracts for automated billing and pricing.
                                </p>
                                <p>
                                    It also enhances grid efficiency by tracking energy flows across distributed networks, reduces administrative overhead, and supports carbon credit trading by offering a verifiable record of emissions and offsets.
                                    By integrating blockchain with IoT devices and smart meters, energy systems can become more adaptive, decentralized, and sustainable.
                                </p>
                        
                                Blockchain-based crowdfunding lets people invest in solar panels for communities that do not have reliable energy access (i.e. rural areas)
                                <ul className='list-disc ml-6 mt-2 space-y-1 text-white'>
                                    <li>So instead of one company paying for everything, many individuals (sponsors) can each contribute a small part to the sum of money.</li>
                                    <li>This funding is tracked and managed using the blockchain, which makes everything transparent, secure, and automated.</li>
                                    <li>In return, sponsors may receive income (like rent or energy usage payments) from the community once the solar panels are up and running</li>
                                    <li>Blockchain also lets sponsors own digital tokens that represent their share of the investment—almost like owning a piece of the solar panel.</li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}