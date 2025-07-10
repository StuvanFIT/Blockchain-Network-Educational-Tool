import { Activity, Code, Shield, TrendingUp } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';



export const conceptModules = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "What is Blockchain?",
      description: "Interactive explanation of distributed ledgers and their properties",
      visual: "🔗",
      route: "/concepts/blockchain"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "How are Blockchain and Cryptocurrency related?",
      description: "Deep dive into the relationships between crytocurrency and blockchain.",
      visual: "₿",
      route: "/concepts/Blockchain-and-cryptocurrency"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Ethereum & Smart Contracts",
      description: "Explore programmable money and decentralised applications",
      visual: "⧫",
      route: "/concepts/smart-contracts"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Should You Invest into Cryptocurrency?",
      description: "Be knowledgable about what you are investing into!",
      visual: "⚖️", 
      route: "/concepts/Cryptocurrency-as-an-investment"
    }
  ]



export default function Concepts() {

    const navigate = useNavigate();

    const handleNavigationClick = (route:string) => {
        navigate(route);
    };


    return (

        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white'>
            <section id="concepts" className='relative z-10 px-6 py-20'>
                <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-16'>
                    <h2 className='text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6'>Concepts</h2>
                    <p className='text-xl text-blue-100'>Below are learning pages that educate you the fundamentals and important aspects of the Blockchain.</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {conceptModules.map((concept, index) => (
                    <div key={index} onClick={()=> handleNavigationClick(concept.route)} className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:ring-1 ring-cyan-400/50 hover:shadow-2xl ease-in-out'>

                        <div className='flex items-center gap-4  mb-6'>
                        <div className='w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center'> {concept.icon} </div>
                        <h3 className='font-semibold'> {concept.title} </h3>
                        </div>

                        <div className='text-gray-400 text-smleading-relaxed'>
                        {concept.description}

                        </div>

                    </div>
                    ))}
                </div>
                </div>
            </section>
        </div>



    )


}