
import React from 'react';
import { Home, Zap, BarChart3, Network, Hash, Link, ChevronRight } from 'lucide-react';

// Dashboard Page
export const Dashboard = () => {

  const isVisible:boolean = true;



  const interactiveSimulators = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Block Mining Simulator",
      description:"Watch blocks being mined in real-time. Adjust difficulty, see hash calculations, and understand proof-of-work.",
      color: "from-orange-500 to-red-500",
      features: ["Real-Time Hashing", "Difficulty Adjustment", "Nonce Finding"]
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Node Network Builder",
      description: "Create and manage a peer-to-peer network. See how nodes communicate and reach consensus.",
      color: "from-cyan-500 to-sky-600",
      features: ["P2P networking", "Consensus mechanisms", "Message propagation"]
    },
    {
      icon: <Hash className="w-8 h-8" />,
      title: "Transaction Creator",
      description: "Build transactions from scratch using wallet accounts. Understand inputs, outputs, digital signatures, and fees.",
      color: "from-green-500 to-emerald-600",
      features: ["UTXO model", "Digital signatures", "Fee calculation"]
    },
    {
      icon: <Link className="w-8 h-8" />,
      title: "Blockchain Explorer",
      description: "Construct your own blockchain link by link. See how blocks connect and form an immutable chain.",
      difficulty: "Intermediate",
      color: "from-blue-500 to-indigo-600",
      features: ["Block linking", "Merkle trees", "Chain validation"]
    }

  ]

  return (

    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white overflow-hidden'>

      {/*Navigation Bar: relative enables any dropdown menus */}
      <nav className='relative z-10 flex items-center justify-between p-6 backdrop-blur-sm bg-white/5 border-b border-white/10'>

      {/*Icon */}
        <div className='flex items-center space-x-2'>
          <div className=' flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg'>
            <Zap className='w-6 h-6 text-white' />
          </div>
          <span className='text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent '>BlockScopeEdu</span>
        </div>
      {/* Features/Tabs */}
        <div className='hidden md:flex space-x-8 text-xl'>
          <a href='#' className='hover:text-cyan-500 transition-colors text-white font-bold'>Cryptocurrencies</a>
          <a href='#' className='hover:text-cyan-500 transition-colors text-white font-bold'>Blockchain</a>
          <a href='#' className='hover:text-cyan-500 transition-colors text-white font-bold'>Learning Tools</a>
        </div>
      
      <button className='bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2 text-white text-xl font-bold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105'>
        Start Exploring
      </button>
      </nav>


      {/*Hero Section: prominent visual section */}

      <section id='title' className='relative z-10 px-6 py-20'>
        <div className='max-w-6xl mx-auto text-center'>
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Learn Blockchain by {' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Building it
              </span>
              <br />

            </h1>

            <p className='text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto'>
              Understand Bitcoin, Ethereum, Cryptocurrencies and blockchain technology through hands-on simulations. Mine blocks, create transactions, build networks, and see how it all works under the hood.
            </p>
          </div>
        </div>
      </section>

      <section id='simulators' className='relative z-10 px-6 py-20 bg-gradient-to-r from-transparent via-white/5 to-transparent'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-5xl font-bold mb-4'>Interactive Simulators</h2>
          <p className='text-gray-300 text-lg max-w-3xl mx-auto'>Get hands on experience with blockchain technology through our interactive simulations</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {interactiveSimulators.map((simulator, index) => (

            <div key={index} className='group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8  hover:border-purple-400/30 transition-all duration-300 cursor-pointer hover:transform hover:scale-110"'>
              <div className={`flex items-center justify-center mb-6 w-16 h-16 bg-gradient-to-r ${simulator.color} rounded-xl group-hover:shadow-lg transition-all duration-300`}>
                {simulator.icon}
              </div>

              <h3 className='text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors'>{simulator.title}</h3>
              <p className='text-gray-300 mb-4'>{simulator.description}</p>

              <div className='space-y-2 mb-6'>
                {simulator.features.map((feature, index) =>(
                  <div key={index} className='flex items-center space-x-2 text-sm text-white-400 border border-gray-500 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-400 font-semibold p-4'>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className='flex items-center justify-between'>
                <button className='text-cyan-400 font-semibold gover: text-cyan-300 transition-colors'>
                  Launch Simulator
                </button>
                <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>



            </div>


          ))}



        </div>


      </div>




      </section>

















    </div>
  )
};