import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Zap, 
    Settings, 
    RotateCcw, 
    ChevronDown,
} from 'lucide-react';

const NavBar = () => {
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleNavigationClick = (route:string) => {
        navigate(route);
    };

    const handleReset = () => {
        localStorage.clear();
        setIsSettingsOpen(false);
        navigate('/', { replace: true });
    };

    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const settingsItems = [
        {
            icon: RotateCcw,
            label: 'Reset Progress',
            action: handleReset,
            color: 'text-gray-500',
            danger: true
        }
    ];

    return (
        <nav className="relative sticky top-0 z-50 h-20 flex items-center justify-between p-2 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 shadow-2xl">
            {/* Icon */}
            <div 
                onClick={() => handleNavigationClick("/")} 
                className='flex items-center space-x-2 cursor-pointer group'
            >
                <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-300'>
                    <Zap className='w-6 h-6 text-white drop-shadow-md' />
                </div>
                <span className='text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'>
                    BlockScopeEdu
                </span>
            </div>

            {/* Features/Tabs */}
            <div className='hidden md:flex space-x-8 text-xl'>
                <a href='#' className='hover:text-cyan-400 transition-colors text-slate-300 font-bold relative group'>
                    Cryptocurrencies
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300'></span>
                </a>
                <a href='#' className='hover:text-cyan-400 transition-colors text-slate-300 font-bold relative group'>
                    Blockchain
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300'></span>
                </a>
                <a href='#' className='hover:text-cyan-400 transition-colors text-slate-300 font-bold relative group'>
                    Learning Tools
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300'></span>
                </a>
            </div>
            
            {/* Settings Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={toggleSettings}
                    className='bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2 text-white text-xl font-bold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2'
                >
                    <Settings className={`w-6 h-6 transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                    Settings
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Enhanced Dropdown */}
                {isSettingsOpen && (
                    <div className='absolute right-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden'>
                        {/* Header */}
                        <div className='px-4 py-3 bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 border-b border-slate-200 dark:border-slate-600'>
                            <h3 className='text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2'>
                                <Settings className='w-5 h-5' />
                                Settings
                            </h3>
                        </div>

                        {/* Settings Items */}
                        <div className='py-2 max-h-96 overflow-y-auto'>
                            {settingsItems.map((item, index) => (
                                <div key={index}>
                                    <div
                                        onClick={item.action}
                                        className={`flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200 ${
                                            item.danger ? 'hover:bg-red-50 dark:hover:bg-red-900/20' : ''
                                        }`}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <item.icon className={`w-5 h-5 ${item.color}`} />
                                            <span className={`font-medium ${
                                                item.danger 
                                                    ? 'text-red-600 dark:text-red-400' 
                                                    : 'text-slate-700 dark:text-slate-300'
                                            }`}>
                                                {item.label}
                                            </span>
                                        </div>
                                    
                                    </div>
                                    
                                    {/* Divider */}
                                    {index < settingsItems.length - 1 && (
                                        <div className='border-b border-slate-100 dark:border-slate-700 mx-4'></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className='px-4 py-3 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600'>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-slate-500 dark:text-slate-400'>
                                    Version 1.0.0
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;