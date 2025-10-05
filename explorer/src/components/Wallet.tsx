import React, { useEffect, useState } from 'react';
import {ec as EC} from 'elliptic';
import { WalletCards, Plus, RefreshCcw, Copy, EyeOff, Eye, Check, Lock} from 'lucide-react';

import { useWalletStore } from '../stores/WalletStore';

const ec = new EC('secp256k1');

type WalletStructure = {
    id: number,
    name: string,
    publicKey: string,
    privateKey: string,
    balance: number
};

const Wallet = () => {
    //use the wallest store
    const {
        exampleWallets,
        updateWallets,
        resetWallets,
    } = useWalletStore();


    //const [wallets, setWallets] = useState<WalletStructure[]>([]);
    const [showPrivateKeys, setShowPrivateKeys] = useState<Record<number, boolean>>({});
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    
    const generateWallet = async () =>{
        try {
            const keyPair = ec.genKeyPair();

            const publicKey = keyPair.getPublic('hex');
            const privateKey = keyPair.getPrivate('hex');
            
            console.log("{PUBLIC KEY, PRIVATE KEY")
            console.log(publicKey);
            console.log(privateKey);

            const newWallet: WalletStructure = {
                id: Date.now() + Math.random(),
                name: `Wallet ${exampleWallets.length}`,
                publicKey: publicKey,
                privateKey: privateKey,
                balance: 0.00,
            };

            updateWallets([...exampleWallets, newWallet])


        } catch (error:any){
            console.error('Error generating wallet', error.message);
        }
    };

    //Example Wallets to localStorage
    useEffect(() => {
        localStorage.setItem('exampleWallets', JSON.stringify(exampleWallets));
    }, [exampleWallets]);






    const clearAllWallets = () =>{
        resetWallets();
        setShowPrivateKeys({});
        setCopiedStates({});
    };

    const copyToClipboard = async (text:string, type:string, walletId:number) => {
        try {
            await navigator.clipboard.writeText(text);
            let key = `${walletId}-${type}`;

            if (type === 'address'){
                key = `${text}-${type}`;
            } else if (type === 'private'){
                key = `${walletId}-${type}`;
            } 

            setCopiedStates(prev => ({ ...prev, [key]: true }));
            setTimeout(() => {
                setCopiedStates(prev => ({ ...prev, [key]: false }));
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const togglePrivateKey = (walletId:number) => {
        setShowPrivateKeys((prev) => ({
            ...prev,
            [walletId]: !prev[walletId]
        }));
    };





return (
        <div className='p-8 min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden'>
            <div className='max-w-7xl mx-auto space-y-8'>
                {/* Header section with glassmorphism effect */}
                <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20'>
                    <div className='flex items-center gap-4 mb-4'>
                        <div className='p-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-xl text-white shadow-lg'>
                            <WalletCards className='w-8 h-8' />
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold text-white'>Create Wallet Accounts</h1>
                            <p className='text-slate-300 mt-1'>Create multiple wallet accounts with public & private key pairs!</p>
                        </div>
                    </div>
                    <p className='text-slate-200'>Generate multiple wallet addresses for educational testing. Each wallet contains a public address, 
                        public key, and private key. Use these addresses to understand blockchain transactions!</p>
                </div>  

                {/* Technical Info with complementary dark theme */}
                {exampleWallets.length > 0 && (
                    <div className='bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 mt-6 border border-slate-600/50 shadow-lg'>
                        <h3 className='font-semibold text-slate-100 mb-3'> 
                            <div className='flex items-center gap-2'>
                                <Lock className='w-5 h-5 text-indigo-400'/>
                                Cryptographic Details:
                            </div>
                        </h3>
                        <div className='grid md:grid-cols-2 gap-4 text-sm text-slate-300'>
                            <div>
                                <h4 className='font-medium mb-2 text-slate-200'>Key Generation Process:</h4>
                                <ul className='space-y-1'>
                                    <li>• Private key: 256-bit random number</li>
                                    <li>• Public key: Derived using ECDSA</li>
                                    <li>• Address: Hash of public key (last 20 bytes)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className='font-medium mb-2 text-slate-200'>Security Properties:</h4>
                                <ul className='space-y-1'>
                                    <li>• One-way derivation (private → public → address)</li>
                                    <li>• Computationally infeasible to reverse</li>
                                    <li>• Each private key is cryptographically unique</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className='flex items-center gap-3'>
                    <button
                        onClick={generateWallet}
                        className='bg-gradient-to-r from-fuchsia-600 to-pink-600 px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'>
                            <div className='flex items-center gap-2 text-white font-bold'>
                                <Plus className='w-5 h-5'/>
                                Generate Wallet
                            </div>
                    </button>

                    {exampleWallets.length > 0 && (
                        <button onClick={clearAllWallets} className='bg-slate-700/80 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg hover:bg-slate-600/80 transition-all duration-200 border border-slate-600/50'>
                            <div className='flex items-center gap-2 text-white font-bold'>
                                <RefreshCcw className='w-4 h-5' />
                                Clear All Wallets
                            </div>
                        </button>
                    )}
                </div>

                {/* Generated Wallets with improved card design */}
                {exampleWallets.length > 0 && (
                    <div className='space-y-4'>
                        <h2 className='text-2xl font-bold text-white mb-4'>
                            Generated Wallets ({exampleWallets.length})
                        </h2>

                        {exampleWallets.map((wallet) => (
                            <div key={wallet.id} className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-600/40 hover:bg-slate-800/70 transition-all duration-200'>
                                <div className='flex justify-between items-start mb-4'>
                                    <h3 className='text-xl font-semibold text-white'>
                                        {wallet.name === 'Wallet 0' || wallet.name === 'Wallet 1' ? wallet.name + ' (DEFAULT)': wallet.name}
                                    </h3>
                                    <span className='text-sm text-slate-300 bg-indigo-600/30 px-3 py-1 rounded-full border border-indigo-500/30'>
                                        {wallet.balance.toFixed(2)} BTC
                                    </span>
                                </div>

                                <div className='space-y-4'>
                                    <div>
                                        <label className='text-sm font-medium text-slate-300 mb-2 block'>Public Key</label>
                                        <div className='flex items-center gap-2'>
                                            <input 
                                                type='text'
                                                value={wallet.publicKey}
                                                readOnly
                                                className='flex-1 p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg font-mono text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50'
                                            />

                                            <button
                                                onClick={() => copyToClipboard(wallet.publicKey, 'address', wallet.id)}
                                                className='p-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-lg hover:from-fuchsia-700 hover:to-pink-700 transition-all duration-200 shadow-lg'
                                            >
                                                {copiedStates[`${wallet.publicKey}-address`] ? <Check className='w-4 h-4'/> : <Copy className='w-5 h-5' /> }
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <label className='text-sm font-medium text-slate-300'>Private Key</label>
                                            <span className='text-sm font-medium text-red-400'>(You should never share this!)</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <input 
                                                type={showPrivateKeys[wallet.id] ? 'text': 'password'}
                                                value={wallet.privateKey}
                                                readOnly
                                                className='flex-1 p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg font-mono text-sm text-slate-200 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50'
                                            />

                                            <button
                                                onClick={() => togglePrivateKey(wallet.id)}
                                                className='p-3 bg-slate-600/60 hover:bg-slate-600/80 text-white rounded-lg transition-all duration-200 border border-slate-500/50'>
                                                    {showPrivateKeys[wallet.id] ? <EyeOff className='w-5 h-5'/> : <Eye className='w-5 h-5' />}
                                            </button>

                                            <button
                                                onClick={() => copyToClipboard(wallet.privateKey, 'private', wallet.id)}
                                                className='p-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-lg hover:from-fuchsia-700 hover:to-pink-700 transition-all duration-200 shadow-lg'
                                            >
                                                {copiedStates[`${wallet.id}-private`] ? <Check className='w-4 h-4'/> : <Copy className='w-5 h-5' /> }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export {Wallet}
export type {WalletStructure};