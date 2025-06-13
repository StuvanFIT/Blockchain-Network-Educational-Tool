import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';

import { BrowserRouter } from 'react-router-dom';


const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(container).render (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);



