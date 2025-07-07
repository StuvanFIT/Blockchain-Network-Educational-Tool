import React from 'react';
import {Routes, Route} from 'react-router';

//Import layouts
import Layout from './layouts/Layout';
import BlockExplorer from './components/BlockExplorer';
import {Dashboard} from './components/Dashboard';
import {HashDemo} from './components/HashDemo';
import {Transactions} from './components/Transactions';
import NotFound from './components/NotFound';
import { Wallet } from './components/Wallet';
import { PeerToPeerNetwork } from './components/PeerToPeerNetwork';
import { BlockchainWorld } from './components/BlockchainWorld';
import BlockChainConcept from './components/Concepts/BlockchainConcept';
import BlockchainAndCrypto from './components/Concepts/BlockchainAndCrypto';
import CryptoAsInvestment from './components/Concepts/CryptoAsInvestment';
import ScrollToTop from './utils/ScrollTop';
import SmartContracts from './components/Concepts/SmartContracts';


function App() {

    return (
        <div className='App'>
            <ScrollToTop />
            <Routes>
                {/* Layout route with nested routes */}
                <Route path="/" element={<Layout/>}>
                    {/* Index route (default page) */}
                    <Route index element={<Dashboard/>}/>

                    {/*Other pages */}
                    <Route path="/simulators/explorer" element={<BlockExplorer/>}/>
                    <Route path="/simulators/createTransactions" element={<Transactions/>}/>
                    <Route path="/simulators/createWallets" element={<Wallet/>}/>
                    <Route path="/simulators/hash" element={<HashDemo/>}/>
                    <Route path="/simulators/peertopeer" element={<PeerToPeerNetwork/>}/>
                    <Route path="/tutorial/blockchainworld" element={<BlockchainWorld/>}/>
                    <Route path="/concepts/blockchain" element={<BlockChainConcept/>}/>
                    <Route path="/concepts/smart-contracts" element={<SmartContracts/>}/>
                    <Route path="/concepts/Cryptocurrency-as-an-investment" element={<CryptoAsInvestment/>}/>
                    <Route path="/concepts/Blockchain-and-cryptocurrency" element={<BlockchainAndCrypto/>}/>
                </Route>
                
                {/*Not found page */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>

    )
}

export default App;