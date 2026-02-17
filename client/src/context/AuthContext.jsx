/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Check if user is logged in on Page Load
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Set default header for all axios requests
                axios.defaults.headers.common['x-auth-token'] = token;
                
                // FETCH USER FROM DATABASE
                const res = await axios.get('/auth/user');
                setUser(res.data);
            } catch (err) {
                console.error("Failed to load user", err);
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['x-auth-token'];
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // 2. Login Function
    const login = async (email, password) => {
        const res = await axios.post('/auth/login', { email, password });
        
        // Save token
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        
        // Fetch user immediately after login
        const userRes = await axios.get('/auth/user');
        setUser(userRes.data);
    };

    // 3. Register Function
    const register = async (username, email, password) => {
        const res = await axios.post('/auth/register', { username, email, password });
        
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;

        const userRes = await axios.get('/auth/user');
        setUser(userRes.data);
    };

    // 4. Logout Function
    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};