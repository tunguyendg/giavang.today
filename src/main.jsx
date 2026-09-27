import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration =
        await navigator.serviceWorker.register(
          '/service-worker.js'
        );

      console.log(
        'Service Worker registered:',
        registration
      );
    } catch (error) {
      console.error(
        'Service Worker registration failed:',
        error
      );
    }
  });
}