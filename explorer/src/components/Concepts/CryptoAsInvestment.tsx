import React, { useState, useEffect, useRef } from 'react';

export default function CryptoAsInvestment() {
    const [activeSection, setActiveSection] = useState('introduction');
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    

    //Financial advice popup
    const [showPopUp, setShowPopUp] = useState(false);


    const sections = [
        {id: 'introduction', title: 'Investment Landscape Overview'},
        {id: 'crypto-basics', title: 'Cryptocurrency as an Investment'},
        {id: 'traditional-investments', title: 'Traditional Investments: Stocks & ETFs'},
        {id: 'risk-comparison', title: 'Risk vs Return Analysis'},
        {id: 'portfolio-considerations', title: 'Portfolio Allocation Strategies'},
        {id: 'decision-framework', title: 'Making Your Investment Decision'},
    ];

    useEffect(() => {
        setShowPopUp(true); //Show the popup as soon as the page loads
    },[])

    const closePopup = () => {
        setShowPopUp(false);
    }

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

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
                .animate-slide-up { animation: slide-up 0.4s ease-out; }
            `}
            </style>
            {/* Modern animated popup */}
            {showPopUp && (
                <div className='fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fade-in'>
                    <div className='bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700/50 text-white space-y-6 max-w-md mx-4 animate-slide-up'>
                        <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4'>
                            <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z' />
                            </svg>
                        </div>
                        
                        <h2 className='text-2xl text-center font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent'>
                            Important Disclaimer
                        </h2>
                        
                        <div className='space-y-4 text-slate-300'>
                            <p className='text-center leading-relaxed'>
                                This is <span className='text-yellow-400 font-semibold'>educational content</span>, not financial advice. 
                                Always consult with a qualified financial advisor before making investment decisions.
                            </p>
                            <p className='text-center leading-relaxed'>
                                We want you to <span className='text-blue-400 font-semibold'>learn and explore</span> without pressure. 
                                Take your time and invest responsibly! 🚀
                            </p>
                        </div>

                        <button
                            onClick={closePopup}
                            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                            Got it, let's learn! ✨
                        </button>
                    </div>
                </div>
            )}




            <div className='flex items-center justify-center w-full py-20 text-center mx-auto'>
                <h1 className='text-7xl'>Crypto vs Traditional Investing</h1>
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

                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto space-y-12">
                        
                        <section 
                            id="introduction" 
                            ref={(el) => { sectionRefs.current['introduction'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h1 className="text-4xl font-bold mb-6 text-indigo-300">Investment Landscape Overview</h1>
                            <p className="text-lg leading-relaxed text-slate-200">
                                The modern investment landscape offers two distinct paths: traditional investments like stocks and ETFs, 
                                and emerging digital assets like cryptocurrencies. Understanding the fundamental differences between these 
                                options is crucial for making informed investment decisions.
                            </p>
                            <div className="space-y-4 text-slate-200 mt-6">
                                <p>
                                    Traditional investments have decades of historical data, regulatory frameworks, and established market behaviors. 
                                    Cryptocurrencies represent a new asset class with revolutionary potential but also unprecedented volatility and uncertainty.
                                </p>
                                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
                                    <p className="font-semibold text-indigo-300">Key Question:</p>
                                    <p>Should you allocate your investment capital to established markets or embrace the digital revolution? 
                                    The answer depends on your risk tolerance, investment timeline, and financial goals.</p>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="crypto-basics" 
                            ref={(el) => { sectionRefs.current['crypto-basics'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Cryptocurrency as an Investment</h2>
                            <p className='mb-9'>Cryptocurrencies like Bitcoin, Ethereum, and others have emerged as a new investment class with unique characteristics that differentiate them from traditional assets.</p>

                            <div className="space-y-6 text-slate-200">
                                <div className="bg-slate-800/50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-xl text-indigo-300 mb-4">What Makes Crypto Different</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <span className="text-cyan-400 mr-3">•</span>
                                            <div>
                                                <strong>Decentralization:</strong> No central authority controls the currency
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-cyan-400 mr-3">•</span>
                                            <div>
                                                <strong>24/7 Trading:</strong> Markets never close, unlike traditional stock exchanges
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-cyan-400 mr-3">•</span>
                                            <div>
                                                <strong>High Volatility:</strong> Prices can swing dramatically in short periods
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-cyan-400 mr-3">•</span>
                                            <div>
                                                <strong>Limited Supply:</strong> Many cryptocurrencies have capped supply (e.g., Bitcoin's 21 million limit)
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-6 rounded-lg border border-green-700/30">
                                        <h3 className="font-semibold text-green-300 mb-4">Crypto Advantages</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li>• Potential for massive returns</li>
                                            <li>• Portfolio diversification</li>
                                            <li>• Hedge against inflation</li>
                                            <li>• Global accessibility</li>
                                            <li>• Innovation exposure</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 p-6 rounded-lg border border-red-700/30">
                                        <h3 className="font-semibold text-red-300 mb-4">Crypto Risks</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li>• Extreme price volatility</li>
                                            <li>• Regulatory uncertainty</li>
                                            <li>• Security risks (hacking)</li>
                                            <li>• Market manipulation</li>
                                            <li>• Technology risks</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="traditional-investments" 
                            ref={(el) => { sectionRefs.current['traditional-investments'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Traditional Investments: Stocks & ETFs</h2>
                            <div className="space-y-6 text-slate-200">
                                <p>
                                    Traditional investments have been the cornerstone of wealth building for generations. They offer 
                                    established frameworks, regulatory protections, and historical performance data.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-4">Individual Stocks</h3>
                                        <p className="mb-4">Represent ownership in specific companies</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-green-400">✓ Dividend potential</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-400">✓ Voting rights</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-400">✓ High growth potential</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-red-400">× Company-specific risk</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-red-400">× Requires research</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-4">ETFs (Exchange-Traded Funds)</h3>
                                        <p className="mb-4">Diversified funds tracking indexes or sectors</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-green-400">✓ Instant diversification</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-400">✓ Low fees</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-400">✓ Professional management</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-red-400">× Market returns only</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-red-400">× Less control</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-900/30 p-6 rounded-lg border border-indigo-700/30">
                                    <h3 className="font-semibold text-indigo-300 mb-3">Historical Performance</h3>
                                    <p>The S&P 500 has averaged approximately 10% annual returns over the past century, 
                                    while individual stocks can vary dramatically. ETFs typically mirror market performance 
                                    with lower volatility than individual stocks.</p>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="risk-comparison" 
                            ref={(el) => { sectionRefs.current['risk-comparison'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Risk vs Return Analysis</h2>
                            <div className="space-y-6 text-slate-200">
                                <div className="bg-slate-800/50 p-6 rounded-lg">
                                    <h3 className="font-semibold text-xl text-indigo-300 mb-4">Volatility Comparison</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-green-900/30 rounded-lg">
                                            <div className="text-2xl font-bold text-green-300">ETFs</div>
                                            <div className="text-sm mt-2">Low to Moderate Risk</div>
                                            <div className="text-xs mt-1">5-15% annual volatility</div>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-900/30 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-300">Individual Stocks</div>
                                            <div className="text-sm mt-2">Moderate to High Risk</div>
                                            <div className="text-xs mt-1">15-30% annual volatility</div>
                                        </div>
                                        <div className="text-center p-4 bg-red-900/30 rounded-lg">
                                            <div className="text-2xl font-bold text-red-300">Cryptocurrency</div>
                                            <div className="text-sm mt-2">Very High Risk</div>
                                            <div className="text-xs mt-1">50-100%+ annual volatility</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-4">Time Horizon Impact</h3>
                                        <div className="space-y-3">
                                            <div className="border-l-4 border-green-500 pl-4">
                                                <h4 className="font-semibold text-green-300">Short-term (1-3 years)</h4>
                                                <p className="text-sm">ETFs generally safer; crypto extremely risky</p>
                                            </div>
                                            <div className="border-l-4 border-yellow-500 pl-4">
                                                <h4 className="font-semibold text-yellow-300">Medium-term (3-10 years)</h4>
                                                <p className="text-sm">Stocks show more stability; crypto still volatile</p>
                                            </div>
                                            <div className="border-l-4 border-blue-500 pl-4">
                                                <h4 className="font-semibold text-blue-300">Long-term (10+ years)</h4>
                                                <p className="text-sm">All assets may provide positive returns</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-lg">
                                        <h3 className="font-semibold text-xl text-indigo-300 mb-4">Return Potential</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span>ETFs (S&P 500)</span>
                                                <span className="text-green-400">~10% annually</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Individual Stocks</span>
                                                <span className="text-yellow-400">-50% to +500%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Bitcoin (historically)</span>
                                                <span className="text-red-400">-80% to +20,000%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="portfolio-considerations" 
                            ref={(el) => { sectionRefs.current['portfolio-considerations'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Portfolio Allocation Strategies</h2>
                            <div className="space-y-6 text-slate-200">
                                <p>
                                    The key to successful investing often lies in diversification and appropriate allocation 
                                    based on your risk tolerance, age, and financial goals.
                                </p>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-green-900/30 p-6 rounded-lg border border-green-700/30">
                                        <h3 className="font-semibold text-green-300 mb-4">Conservative Portfolio</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>ETFs</span>
                                                <span className="text-green-400">70-80%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Individual Stocks</span>
                                                <span className="text-green-400">15-25%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Cryptocurrency</span>
                                                <span className="text-green-400">0-5%</span>
                                            </div>
                                        </div>
                                        <p className="text-sm mt-4 text-slate-300">
                                            Best for: Near retirement, risk-averse investors
                                        </p>
                                    </div>

                                    <div className="bg-yellow-900/30 p-6 rounded-lg border border-yellow-700/30">
                                        <h3 className="font-semibold text-yellow-300 mb-4">Moderate Portfolio</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>ETFs</span>
                                                <span className="text-yellow-400">50-60%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Individual Stocks</span>
                                                <span className="text-yellow-400">30-40%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Cryptocurrency</span>
                                                <span className="text-yellow-400">5-10%</span>
                                            </div>
                                        </div>
                                        <p className="text-sm mt-4 text-slate-300">
                                            Best for: Mid-career professionals, balanced approach
                                        </p>
                                    </div>

                                    <div className="bg-red-900/30 p-6 rounded-lg border border-red-700/30">
                                        <h3 className="font-semibold text-red-300 mb-4">Aggressive Portfolio</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>ETFs</span>
                                                <span className="text-red-400">30-40%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Individual Stocks</span>
                                                <span className="text-red-400">40-50%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Cryptocurrency</span>
                                                <span className="text-red-400">10-20%</span>
                                            </div>
                                        </div>
                                        <p className="text-sm mt-4 text-slate-300">
                                            Best for: Young investors, high risk tolerance
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-indigo-900/30 p-6 rounded-lg border border-indigo-700/30">
                                    <h3 className="font-semibold text-indigo-300 mb-3">Important Considerations</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-indigo-400 mr-2">•</span>
                                            <span>Never invest more than you can afford to lose, especially in crypto</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-indigo-400 mr-2">•</span>
                                            <span>Rebalance your portfolio regularly to maintain target allocations</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-indigo-400 mr-2">•</span>
                                            <span>Consider dollar-cost averaging to reduce timing risk</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-indigo-400 mr-2">•</span>
                                            <span>Keep emergency funds separate from investments</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section 
                            id="decision-framework" 
                            ref={(el) => { sectionRefs.current['decision-framework'] = el as HTMLDivElement | null}}
                            className="scroll-mt-20 space-y-8"
                        >
                            <h2 className="text-3xl font-bold mb-4 text-indigo-300">Making Your Investment Decision</h2>

                            <div className="bg-slate-800/50 p-8 rounded-lg space-y-6">
                                <h3 className="text-2xl font-bold text-indigo-300 mb-4">Self-Assessment Questions</h3>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-yellow-300">Risk Tolerance</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start">
                                                <span className="text-yellow-400 mr-2">?</span>
                                                <span>Can you handle 50%+ portfolio swings?</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-yellow-400 mr-2">?</span>
                                                <span>Do you lose sleep over market volatility?</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-yellow-400 mr-2">?</span>
                                                <span>Are you comfortable with new technology?</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-green-300">Financial Situation</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">?</span>
                                                <span>Do you have 6+ months emergency fund?</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">?</span>
                                                <span>Are you debt-free (except mortgage)?</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-green-400 mr-2">?</span>
                                                <span>How many years until retirement?</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-indigo-900/30 p-6 rounded-lg border border-indigo-700/30">
                                    <h3 className="font-semibold text-indigo-300 mb-4">Investment Decision Matrix</h3>
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                                            <div className="bg-green-800/30 p-3 rounded">
                                                <h4 className="font-semibold text-green-300">Choose ETFs if:</h4>
                                                <ul className="mt-2 space-y-1">
                                                    <li>• You're a beginner</li>
                                                    <li>• You want steady growth</li>
                                                    <li>• You prefer low maintenance</li>
                                                    <li>• You're risk-averse</li>
                                                </ul>
                                            </div>
                                            <div className="bg-yellow-800/30 p-3 rounded">
                                                <h4 className="font-semibold text-yellow-300">Choose Stocks if:</h4>
                                                <ul className="mt-2 space-y-1">
                                                    <li>• You enjoy research</li>
                                                    <li>• You want higher returns</li>
                                                    <li>• You have time to monitor</li>
                                                    <li>• You understand companies</li>
                                                </ul>
                                            </div>
                                            <div className="bg-red-800/30 p-3 rounded">
                                                <h4 className="font-semibold text-red-300">Choose Crypto if:</h4>
                                                <ul className="mt-2 space-y-1">
                                                    <li>• You're tech-savvy</li>
                                                    <li>• You can afford total loss</li>
                                                    <li>• You believe in blockchain</li>
                                                    <li>• You're young with time</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-700/50 p-6 rounded-lg">
                                    <h3 className="text-xl font-bold text-indigo-300 mb-4">Final Recommendation</h3>
                                    <p className="mb-4">
                                        For most investors, a diversified approach works best. Start with a foundation of ETFs for stability, 
                                        add individual stocks for growth potential, and allocate a small percentage to cryptocurrency 
                                        for innovation exposure.
                                    </p>
                                    <p className="text-yellow-300 font-semibold">
                                        Remember: This is educational content, not financial advice. Always consult with a qualified 
                                        financial advisor before making investment decisions.
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