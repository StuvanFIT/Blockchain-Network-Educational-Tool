import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { Hash, Home, FileText, BarChart3, Wallet, Network, Zap, Settings } from 'lucide-react';

const NavBar = () =>{

    const navigate = useNavigate();


    const handleNavigationClick = (route:string) => {
        navigate(route);
    };


    return (

        <nav className="relative sticky top-0 z-50 flex items-center justify-between p-2 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 shadow-2xl">
            {/*Icon */}
            <div onClick={() => handleNavigationClick("/")} className='flex items-center space-x-2 cursor-pointer'>
                <div className=' flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg'>
                    <Zap className='w-6 h-6 text-white drop-shadow-md' />
                </div>
                <span className='text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent '>BlockScopeEdu</span>
            </div>
            {/* Features/Tabs */}
            <div className='hidden md:flex space-x-8 text-xl'>
                <a href='#' className='hover:text-cyan-400 transition-colors text-slate-300 font-bold'>Cryptocurrencies</a>
                <a href='#' className='hover:text-cyan-400 transition-colors text-slate-300 font-bold'>Blockchain</a>
                <a href='#' className='hover:text-cyan-400 transition-colors text-slate-300 font-bold'>Learning Tools</a>
            </div>
            
            <button className='bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2 text-white text-xl font-bold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105'>
                <div className='flex items-center gap-2'>
                    <Settings className='w-6 h-6' />
                    Settings
                </div>
            </button>
        </nav>



    )
}


export default NavBar;