import React, { useState } from 'react';
import { WalletCards, Plus, RefreshCcw, Copy, EyeOff, EyeClosed, Eye, Check} from 'lucide-react';
import { arrayToHex, sha256 } from '../blockchain/utils';


type WalletStructure = {
    id: number,
    name: string,
    publicKey: string,
    privateKey: string,
    balance: number
};

const Wallet = () => {

    const [wallets, setWallets] = useState<WalletStructure[]>([]);
    const [showPrivateKeys, setShowPrivateKeys] = useState<Record<number, boolean>>({});
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    

    //Step 1: Generate a new private key:
    const generatePrivateKey = () =>{
        const array = new Uint8Array(32);        // Create 32-byte array (256 bits)
        crypto.getRandomValues(array);           // Fill with cryptographically secure random bytes
        return arrayToHex(array);                // Convert to hexadecimal string
    };

    //Step 2: Derive a public key from the private key (i.e. private key --> public key)
    // Simplified deterministic public key derivation from private key
    // In real implementation, this would use elliptic curve multiplication
    const derivePublicKey = async (privateKeyHex:string) => {

        const hash1 = await sha256(privateKeyHex);
        
        //Hash again with a constant to simulate elliptic curve operations
        const hash2 = await sha256(arrayToHex(hash1) + 'GENERATOR_POINT');
        
        //Create a 64-byte public key (uncompressed format simulation)
        const hash3 = await sha256(arrayToHex(hash2) + 'PUBLIC_KEY_DERIVATION');
        
        // Combine hashes to create a deterministic 64-byte public key
        const publicKeyBytes = new Uint8Array(64);
        publicKeyBytes.set(hash2.slice(0, 32), 0);
        publicKeyBytes.set(hash3.slice(0, 32), 32);
        
        return arrayToHex(publicKeyBytes);
    };

    const generateWallet = async () =>{
        try {

            const privateKey = generatePrivateKey();
            const publicKey = await derivePublicKey(privateKey);

            const newWallet: WalletStructure = {
                id: Date.now() + Math.random(),
                name: `Wallet ${wallets.length + 1}`,
                publicKey: '0x' + publicKey,
                privateKey: '0x' + privateKey,
                balance: 0.00,
            };

            setWallets([...wallets, newWallet]);

        } catch (error:any){
            console.error('Error generating wallet', error.message);
        }



    };

    const clearAllWallets = () =>{
        setWallets([]);
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
        <div className='p-8 bg-gray-50 min-h-screen'>
            <div className='max-w-7xl mx-auto space-y-8'>
                <div className='bg-white rounded-2xl p-8 shadow-lg border border-slate-200'>
                    <div className='flex items-center gap-4 mb-4'>
                        <div className='p-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-xl text-white'>
                            <WalletCards className='w-8 h-8' />
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold text-slate-800'>Create Wallet Accounts </h1>
                            <p className='text-slate-500 mt-1'>Create multiple wallet accounts with public & private key pairs!</p>
                        </div>
                    </div>
                    <p className='text-slate-600'> Generate multiple wallet addresses for educational testing. Each wallet contains a public address, 
                        public key, and private key. Use these addresses to understand blockchain transactions!</p>
                </div>  

                {/* Technical Info */}
                {wallets.length > 0 && (
                    <div className='bg-blue-50 rounded-xl p-6 mt-6 border border-blue-200'>
                        <h3 className='font-semibold text-blue-900 mb-3'>🔐 Cryptographic Details:</h3>
                        <div className='grid md:grid-cols-2 gap-4 text-sm text-blue-800'>
                            <div>
                                <h4 className='font-medium mb-2'>Key Generation Process:</h4>
                                <ul className='space-y-1'>
                                    <li>• Private key: 256-bit random number</li>
                                    <li>• Public key: Derived using ECDSA</li>
                                    <li>• Address: Hash of public key (last 20 bytes)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className='font-medium mb-2'>Security Properties:</h4>
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
                        className='bg-gradient-to-r from-fuchsia-600 to-pink-600 px-6 py-4 rounded-lg'>
                            <div className='flex items-center gap-2 text-white font-bold'>
                                <Plus className='w-5 h-5'/>
                                Generate Wallet
                            </div>
                    </button>

                    {wallets.length >0 &&(
                        <button onClick={clearAllWallets} className='bg-gray-500 px-6 py-4 rounded-lg'>
                            <div className='flex items-center gap-2 text-white font-bold'>
                                <RefreshCcw className='w-4 h-5' />
                                Clear All Wallets


                            </div>
                        </button>
                    )}
                </div>

                {/*Generated Wallets */}

                {wallets.length > 0 &&(
                    <div className='space-y-4'>
                        <h2 className='text-2xl font-bold text-slate-800 mb-4'>
                            Generated Wallets ({wallets.length})
                        </h2>

                        {wallets.map((wallet) => (
                            <div key={wallet.id} className='bg-white rounded-xl p-6 shadow-md border border-slate-200'>
                                <div className='flex justify-between items-start mb-4'>
                                    <h3 className='text-xl font-semibold text-slate-800'>{wallet.name}</h3>
                                    <span className='text-sm text-slate-500 bg-slate-100 p-2 rounded-full'>{wallet.balance.toFixed(2)} BTC</span>
                                </div>

                                <div className='space-y-4'>
                                    <div>
                                        <label className='text-sm font-medium text-slate-700 mb-2'>Public Key</label>
                                        <div className='flex items-center gap-2'>
                                            <input 
                                                type='text'
                                                value={wallet.publicKey}
                                                readOnly
                                                className='flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm'
                                            />

                                            <button
                                                onClick={() => copyToClipboard(wallet.publicKey, 'address', wallet.id)}
                                                className='p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'
                                            >
                                                {copiedStates[`${wallet.publicKey}-address`] ? <Check className='w-4 h-4'/> : <Copy className='w-5 h-5' /> }
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className='text-sm font-medium text-slate-700 mb-2'>Private Key</label>
                                        <span className='text-sm font-medium text-red-700 mb-2'> (You should never share this!)</span>
                                        <div className='flex items-center gap-2'>
                                            <input 
                                                type={showPrivateKeys[wallet.id] ? 'text': 'password'}
                                                value={wallet.privateKey}
                                                readOnly
                                                className='flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm'
                                            />

                                            <button
                                                onClick={() => togglePrivateKey(wallet.id)}
                                                className='p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'>
                                                    {showPrivateKeys[wallet.id] ? <EyeOff className='w-5 h-5'/> : <Eye className='w-5 h-5' />}


                                            </button>

                                            <button
                                                onClick={() => copyToClipboard(wallet.privateKey, 'private', wallet.id)}
                                                className='p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'
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