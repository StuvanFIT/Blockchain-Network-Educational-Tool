
import React from 'react';
import { BarChart3, Network, Hash, Link, Code, Activity, Shield, TrendingUp, CirclePlay, Wallet, Play } from 'lucide-react';
import { useNavigate } from 'react-router';


// Dashboard Page
export const Dashboard = () => {

  const navigate = useNavigate();

  const isVisible:boolean = true;


  const handleNavigationClick = (route:string) => {
    navigate(route);
  };


  const interactiveSimulators = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Block Mining Simulator",
      description:"Watch blocks being mined in real-time. Adjust difficulty, see hash calculations, and understand proof-of-work.",
      color: "from-orange-500 to-red-500",
      features: ["Real-Time Hashing", "Difficulty Adjustment", "Nonce Finding"],
      route: "/simulators/hash"
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Node Network Builder",
      description: "Create and manage a peer-to-peer network. See how nodes communicate and reach consensus.",
      color: "from-cyan-500 to-sky-600",
      features: ["P2P networking", "Consensus mechanisms", "Message propagation"],
      route: "/simulators/peertopeer"
    },
    {
      icon: <Hash className="w-8 h-8" />,
      title: "Transaction Creator",
      description: "Build transactions from scratch using wallet accounts. Understand inputs, outputs, digital signatures, and fees.",
      color: "from-green-500 to-emerald-600",
      features: ["UTXO model", "Digital signatures", "Fee calculation"],
      route: "/simulators/createTransactions",
    },
    {
      icon: <Link className="w-8 h-8" />,
      title: "Blockchain Explorer",
      description: "Construct your own blockchain link by link. See how blocks connect and form an immutable chain.",
      color: "from-blue-500 to-indigo-600",
      features: ["Block linking", "Merkle trees", "Chain validation"],
      route: "/simulators/explorer"
    },
      {
      icon: <Wallet className="w-8 h-8" />,
      title: "Create Wallet Accounts",
      description: "Create Wallet Accounts with Public Key and Private Key.",
      color: "from-fuchsia-600 to-pink-500",
      features: ["Public Address", "Private Keys"],
      route: "/simulators/createWallets"
    }
  ]


  const conceptModules = [
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





  return (

    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white overflow-hidden'>

      {/*Hero Section: prominent visual section */}

      <section id='title' className='relative z-10 px-6 py-20'>
        <div className='max-w-6xl mx-auto text-center'>
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Learn{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Blockchain {' '}
              </span>
              By Building It
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
          <p className='text-xl text-blue-100 max-w-3xl mx-auto'>Get hands on experience with blockchain technology through our interactive simulations</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {interactiveSimulators.map((simulator, index) => (

            <div key={index} onClick={() => handleNavigationClick(simulator.route)} className='group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8  transition-all duration-300 cursor-pointer transform hover:scale-105 hover:ring-1 ring-cyan-400/50 hover:shadow-2xl ease-in-out'>
              <div className={`flex items-center justify-center mb-6 w-16 h-16 bg-gradient-to-r ${simulator.color} rounded-xl group-hover:shadow-xl transition-all duration-300`}>
                {simulator.icon}
              </div>

              <h3 className='text-xl font-semibold mb-3 transition-colors'>{simulator.title}</h3>
              <p className='text-gray-300 mb-4 leading-relaxed'>{simulator.description}</p>

              <div className='space-y-2 mb-6'>
                {simulator.features.map((feature, index) =>(
                  <div key={index} className='flex items-center space-x-2 text-sm text-white-400 border border-gray-500 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-400 font-semibold font-mono p-4'>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className='flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity text-white font-semibold'>
                <div>
                  Launch Simulator
                </div>
                <CirclePlay className="w-5 h-5 text-white-400 group-hover:translate-x-1 group-hover:text-cyan-300 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
      </section>


      {/*Concept Modules */}

      <section id="concepts" className='relative z-10 px-6 py-20'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-5xl font-bold mb-4'>Core Concepts</h2>
            <p className='text-xl text-blue-100'>Understand the fundamentals and important aspects of the Blockchain.</p>
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


      <section id="game" className='relative z-10 px-6 py-20 bg-gradient-to-r from-transparent via-white/5 to-transparent'>
        <div className='text-center max-w-2xl mx-auto'>
            <div className='mb-4'>
                <div className="text-8xl mb-4 animate-bounce">⛓️</div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                    Blockchain Adventure
                    </h1>
                    <p className="text-xl text-blue-100 mb-8">
                    Join an epic journey to discover the secrets of blockchain technology!
                    Learn through interactive stories, games, and animated characters.
                    </p>
            </div>

            <button
                onClick={() => navigate("/tutorial/blockchainworld")}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
            >
                <Play className='w-6 h-6' />
                Start Your Adventure
            </button>
        </div>
      </section>

    </div>
  )
};