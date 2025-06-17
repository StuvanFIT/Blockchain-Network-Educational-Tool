import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import { Hash, Home, FileText, BarChart3 } from 'lucide-react';

const NavBar = () =>{

    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/explorer', icon: BarChart3, label: 'Block Explorer' },
        { path: '/createTransactions', icon: FileText, label: 'Create Transactions' },
        { path: '/hash', icon: Hash, label: 'Block Mining Simulator' },
    ];

    const isActiveItem = (path:string) => location.pathname ===path;



    return (

        <nav className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
            {/*Navigation Bar Links */}
            <div className='hidden md:flex items-center space-x-1'>
                {navItems.map((item) =>{

                    const Icon = item.icon; //retrieve the icon
                    return (
                        <Link key={item.path} to={item.path} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActiveItem(item.path)
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}>
                            <Icon className="w-4 h-4"/>
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>



    )
}


export default NavBar;