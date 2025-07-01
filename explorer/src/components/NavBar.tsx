import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { Hash, Home, FileText, BarChart3, Wallet, Network, Zap, Settings } from 'lucide-react';

const NavBar = () =>{

    const location = useLocation();
    const navigate = useNavigate();


    const handleNavigationClick = (route:string) => {
        navigate(route);
    };


    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/explorer', icon: BarChart3, label: 'Block Explorer' },
        { path: '/createTransactions', icon: FileText, label: 'Create Transactions' },
        { path: '/createWallets', icon: Wallet, label: 'Create Wallet Accounts'},
        { path: '/peertopeer', icon: Network, label: 'P2P Network'},
        { path: '/hash', icon: Hash, label: 'Block Mining Simulator' },

    ];

    const isActiveItem = (path:string) => location.pathname ===path;

    const reset = () =>{
        localStorage.clear();
    }



    return (

        <nav className="relative sticky top-0 z-50 flex items-center justify-between p-6 bg-white border-b border-white/10 shadow-2xl">
            {/*Icon */}
            <div onClick={() => handleNavigationClick("/")} className='flex items-center space-x-2 cursor-pointer'>
                <div className=' flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg'>
                    <Zap className='w-6 h-6 text-white drop-shadow-md' />
                </div>
                <span className='text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent '>BlockScopeEdu</span>
            </div>
            {/* Features/Tabs */}
            <div className='hidden md:flex space-x-8 text-2xl'>
                <a href='#' className='hover:text-cyan-500 transition-colors text-indigo-500 font-bold'>Cryptocurrencies</a>
                <a href='#' className='hover:text-cyan-500 transition-colors text-indigo-500 font-bold'>Blockchain</a>
                <a href='#' className='hover:text-cyan-500 transition-colors text-indigo-500 font-bold'>Learning Tools</a>
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