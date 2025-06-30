
import React from 'react';
import { Home, Zap } from 'lucide-react';

// Dashboard Page
export const Dashboard = () => {

  const isVisible:boolean = true;

  return (

    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden'>

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
        <div className='hidden md:flex space-x-8'>
          <a href='#' className='hover:text-cyan-500 transition-colors text-white font-bold'>Cryptocurrencies</a>
          <a href='#' className='hover:text-cyan-500 transition-colors text-white font-bold'>Blockchain</a>
          <a href='#' className='hover:text-cyan-500 transition-colors text-white font-bold'>Learning Tools</a>
        </div>
      
      <button className='bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2 text-white font-bold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105'>
        Get Started
      </button>
      </nav>


      {/*Hero Section: prominent visual section */}

      <section className='relative z-10 px-6 py-20'>
        <div className='max-w-6xl mx-auto text-center'>
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Master{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Cryptocurrency
              </span>
              <br />
              From Zero to Hero
            </h1>

            <p className='text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto'>
              Unlock the world of digital currencies with our interactive, beginner-friendly platform. 
              Learn blockchain, trading, and security through hands-on experiences designed for complete beginners.
            </p>



          </div>
        </div>
      </section>

















    </div>
  )
};