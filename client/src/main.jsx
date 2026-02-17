import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// 1. IMPORT THE PROVIDERS
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  // 2. REMOVED <StrictMode> so drag-and-drop works perfectly
  
  // 3. WRAP EVERYTHING: Auth first, then Socket
  <AuthProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </AuthProvider>
);