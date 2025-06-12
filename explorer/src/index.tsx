import React from 'react';
import ReactDOM from 'react-dom/client';
import BlockExplorer from './components/BlockExplorer';
import './styles/tailwind.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BlockExplorer />
  </React.StrictMode>
);


