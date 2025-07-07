import React, { useState } from 'react';
import { Play, ExternalLink, Book, Video, FileText, TrendingUp, Users, Shield } from 'lucide-react';

export default function Resources() {
    const [activeCategory, setActiveCategory] = useState('all');

    const videoResources = [
        {
            title: "Blockchain Technology Explained",
            description: "A comprehensive introduction to blockchain fundamentals and how it works",
            url: "https://www.youtube.com/watch?v=SSo_EIwHSd4",
            duration: "26 min",
            category: "blockchain"
        },
        {
            title: "Bitcoin: The Original Cryptocurrency",
            description: "Understanding Bitcoin's revolutionary impact on digital finance",
            url: "https://www.youtube.com/watch?v=l9jOJk30eQs",
            duration: "18 min",
            category: "bitcoin"
        },
        {
            title: "Ethereum and Smart Contracts",
            description: "How Ethereum enables programmable money and decentralized applications",
            url: "https://www.youtube.com/watch?v=WSN5BaCzsbo",
            duration: "15 min",
            category: "ethereum"
        },
        {
            title: "The Future of DeFi",
            description: "Exploring decentralized finance and its potential to reshape banking",
            url: "https://www.youtube.com/watch?v=k9HYC0EJU6E",
            duration: "22 min",
            category: "defi"
        }
    ];

    const cryptoLinks = [
        {
            name: "Bitcoin (BTC)",
            description: "The original cryptocurrency and digital gold",
            url: "https://www.investopedia.com/terms/b/bitcoin.asp",
            marketCap: "#1",
            icon: "₿"
        },
        {
            name: "Ethereum (ETH)",
            description: "Smart contract platform and decentralized computing",
            url: "https://www.investopedia.com/terms/e/ethereum.asp",
            marketCap: "#2",
            icon: "Ξ"
        },
        {
            name: "Binance Coin (BNB)",
            description: "Native token of the Binance exchange ecosystem",
            url: "https://www.binance.com",
            marketCap: "#3",
            icon: "⬡"
        },
        {
            name: "Solana (SOL)",
            description: "High-performance blockchain for decentralized applications",
            url: "https://www.forbes.com/sites/digital-assets/article/what-is-solana-sol-how-it-works-and-what-to-know/",
            marketCap: "#4",
            icon: "◉"
        },
        {
            name: "Cardano (ADA)",
            description: "Research-driven blockchain platform",
            url: "https://cardano.org",
            marketCap: "#5",
            icon: "₳"
        }
    ];

    const articles = [
        {
            title: "The 2008 Financial Crisis: Seeds of Bitcoin",
            description: "How the global financial meltdown inspired Satoshi Nakamoto's vision",
            url: "https://www.investopedia.com/articles/economics/09/financial-crisis-review.asp",
            category: "crisis",
            readTime: "12 min read"
        },
        {
            title: "Satoshi Nakamoto: The Mysterious Creator",
            description: "Exploring the identity and legacy of Bitcoin's anonymous founder",
            url: "https://www.coindesk.com/who-is-satoshi-nakamoto",
            category: "satoshi",
            readTime: "8 min read"
        },
        {
            title: "Bitcoin Whitepaper: A Peer-to-Peer Electronic Cash System",
            description: "The original document that started the cryptocurrency revolution",
            url: "https://bitcoin.org/bitcoin.pdf",
            category: "whitepaper",
            readTime: "15 min read"
        },
        {
            title: "The Rise and Fall of Mt. Gox",
            description: "Lessons from cryptocurrency's biggest exchange collapse",
            url: "https://www.wired.com/2014/03/what-is-mt-gox/",
            category: "history",
            readTime: "10 min read"
        },
        {
            title: "Central Bank Digital Currencies (CBDCs)",
            description: "How governments are responding to the crypto revolution",
            url: "https://www.bis.org/publ/othp33.htm",
            category: "cbdc",
            readTime: "20 min read"
        },
        {
            title: "Environmental Impact of Cryptocurrency Mining",
            description: "Examining energy consumption and sustainability concerns",
            url: "https://unu.edu/press-release/un-study-reveals-hidden-environmental-impacts-bitcoin-carbon-not-only-harmful-product",
            category: "environment",
            readTime: "14 min read"
        }
    ];

    const categories = [
        { id: 'all', label: 'All Resources', icon: Book },
        { id: 'blockchain', label: 'Blockchain', icon: Shield },
        { id: 'bitcoin', label: 'Bitcoin', icon: TrendingUp },
        { id: 'ethereum', label: 'Ethereum', icon: Users },
        { id: 'defi', label: 'DeFi', icon: FileText }
    ];

    const filteredVideos = activeCategory === 'all' 
        ? videoResources 
        : videoResources.filter(video => video.category === activeCategory);

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white'>
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 blur-3xl"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                            Blockchain Resources
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Explore the revolutionary world of blockchain technology, cryptocurrencies, and decentralized finance
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                                    activeCategory === category.id
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                            >
                                <Icon size={18} />
                                {category.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Video Resources */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="flex items-center gap-3 mb-8">
                    <Video className="text-blue-400" size={28} />
                    <h2 className="text-3xl font-bold">Video Resources</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVideos.map((video, index) => (
                        <div key={index} className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                            <div className="aspect-video bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center">
                                <Play className="text-white/80 group-hover:text-white transition-colors" size={48} />
                            </div>
                            <div className="p-6">
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                                    {video.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {video.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{video.duration}</span>
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Watch <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cryptocurrency Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="flex items-center gap-3 mb-8">
                    <TrendingUp className="text-green-400" size={28} />
                    <h2 className="text-3xl font-bold">Top Cryptocurrencies</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cryptoLinks.map((crypto, index) => (
                        <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-3xl font-bold text-yellow-400">
                                    {crypto.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{crypto.name}</h3>
                                    <span className="text-xs text-gray-500">{crypto.marketCap} Market Cap</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">
                                {crypto.description}
                            </p>
                            <a
                                href={crypto.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Learn More <ExternalLink size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Articles */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="flex items-center gap-3 mb-8">
                    <FileText className="text-purple-400" size={28} />
                    <h2 className="text-3xl font-bold">Essential Articles</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                        <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                            <h3 className="font-semibold text-lg mb-3 group-hover:text-purple-400 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                {article.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{article.readTime}</span>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Read <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                        <p className="text-gray-400 mb-6">
                            The blockchain and cryptocurrency space evolves rapidly. Keep learning and stay informed!
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                                #Blockchain
                            </span>
                            <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                                #Cryptocurrency
                            </span>
                            <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm">
                                #DeFi
                            </span>
                            <span className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                                #Bitcoin
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}