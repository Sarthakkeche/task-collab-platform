/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

// Custom hook to use the socket easily
export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // 1. Establish the connection to the backend
        const newSocket = io('http://localhost:5000'); // Check your port!
        
        setSocket(newSocket);

        // 2. Cleanup (disconnect) when the app closes
        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};