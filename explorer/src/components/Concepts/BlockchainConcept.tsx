import React, { useState } from 'react';


export default function BlockChainConcept() {

    const [activeSection, setActiveSection] = useState('');

    const sections = [
        {id: 'introduction', title: 'What is blockchain technology?'},
        {id: 'process', title: 'How does blockchain work?' },
        {id: 'pow-pos', title: 'What is proof of work and how is it different from proof of stake?'},
        {id: 'businesses', title: 'How do industries benefit from blockchain?'},
        {id: 'type', title: "What are the types of blockchain networks?"},
        {id: 'database-comparison', title: "What is the difference between a database and a blockchain?"}
    ];



    return (

        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white'>

            {/*Table of contents section */}

            <div className='flex items-center justify-center w-full py-20 text-center mx-auto'>
                <h1 className='text-7xl'>What is Blockchain Technology?</h1>

            </div>

            <div className='flex'>
                <nav className='w-96 p-6 ml-9 sticky top-0 h-screen overflow-y-auto border-r border-indigo-700/30'>
                    
                    <ul className='space-y-2'>
                        {sections.map(section => (
                            <li key={section.id}>
                                <button
                                    className={` text-left w-full font-bold p-3 rounded transition-all ${
                                        activeSection === section.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-300 hover:bg-indigo-800/50'
                                    }
                                    `}
                                
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
                        
                        <section id="intro" className="scroll-mt-20">
                            <h1 className="text-4xl font-bold mb-6 text-indigo-300">Understanding Blockchain Technology</h1>
                            <p className="text-lg leading-relaxed text-slate-200">
                                Blockchain is a revolutionary technology that's transforming how we store, verify, and transfer data. 
                                This comprehensive guide will take you through everything you need to know about blockchain, from basic concepts to advanced applications.
                            </p>
                        </section>

                        <section id="what-is" className="scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">What is Blockchain?</h2>
                            <div className="space-y-4 text-slate-200">
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

                        <section id="how-works" className="scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">How Blockchain Works</h2>
                            <div className="space-y-4 text-slate-200">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-indigo-300 mb-2">1. Transaction Initiation</h3>
                                        <p>A user initiates a transaction, which is broadcast to the network.</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-indigo-300 mb-2">2. Verification</h3>
                                        <p>Network nodes validate the transaction using predetermined rules.</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-indigo-300 mb-2">3. Block Creation</h3>
                                        <p>Verified transactions are bundled into a new block.</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-indigo-300 mb-2">4. Consensus</h3>
                                        <p>The network reaches consensus to add the block to the chain.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="key-features" className="scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Key Features</h2>
                            <div className="space-y-4 text-slate-200">
                                <div className="space-y-3">
                                    <div className="border-l-4 border-indigo-500 pl-4">
                                        <h3 className="font-semibold text-indigo-300">Decentralization</h3>
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

                        <section id="types" className="scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Types of Blockchain</h2>
                            <div className="grid md:grid-cols-3 gap-4 text-slate-200">
                                <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-4 rounded-lg border border-green-700/30">
                                    <h3 className="font-semibold text-green-300 mb-2">Public Blockchain</h3>
                                    <p className="text-sm">Open to everyone, fully decentralized. Examples: Bitcoin, Ethereum.</p>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 p-4 rounded-lg border border-yellow-700/30">
                                    <h3 className="font-semibold text-yellow-300 mb-2">Private Blockchain</h3>
                                    <p className="text-sm">Restricted access, controlled by an organization.</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-4 rounded-lg border border-purple-700/30">
                                    <h3 className="font-semibold text-purple-300 mb-2">Hybrid Blockchain</h3>
                                    <p className="text-sm">Combines public and private elements.</p>
                                </div>
                            </div>
                        </section>

                        <section id="applications" className="scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Real-World Applications</h2>
                            <div className="space-y-4 text-slate-200">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-slate-800/30 p-4 rounded-lg">
                                        <h3 className="font-semibold text-indigo-300 mb-2">Cryptocurrency</h3>
                                        <p>Digital currencies like Bitcoin and Ethereum.</p>
                                    </div>
                                    <div className="bg-slate-800/30 p-4 rounded-lg">
                                        <h3 className="font-semibold text-indigo-300 mb-2">Supply Chain</h3>
                                        <p>Tracking products from origin to consumer.</p>
                                    </div>
                                    <div className="bg-slate-800/30 p-4 rounded-lg">
                                        <h3 className="font-semibold text-indigo-300 mb-2">Healthcare</h3>
                                        <p>Secure patient data management and sharing.</p>
                                    </div>
                                    <div className="bg-slate-800/30 p-4 rounded-lg">
                                        <h3 className="font-semibold text-indigo-300 mb-2">Voting Systems</h3>
                                        <p>Transparent and tamper-proof electoral processes.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="benefits" className="scroll-mt-20">
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Benefits & Challenges</h2>
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
                        </section>

                    </div>
                </main>



            </div>
        </div>
    )
}
