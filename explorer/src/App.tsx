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

function App() {

    return (

        <Routes>
            {/* Layout route with nested routes */}
            <Route path="/" element={<Layout/>}>
                {/* Index route (default page) */}
                <Route index element={<Dashboard/>}/>

                {/*Other pages */}
                <Route path="explorer" element={<BlockExplorer/>}/>
                <Route path="createTransactions" element={<Transactions/>}/>
                <Route path="createWallets" element={<Wallet/>}/>
                <Route path="hash" element={<HashDemo/>}/>
                <Route path="peertopeer" element={<PeerToPeerNetwork/>}/>

                {/*Not found page */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>

    )
}

export default App;