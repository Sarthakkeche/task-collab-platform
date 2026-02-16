/* eslint-disable no-unused-vars */
import { createContext, useState, useContext } from 'react';
import instance from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Lazy Initialization: Check localStorage immediately
    // This avoids the "useEffect" synchronous error and sets the user instantly.
    const [user, setUser] = useState(() => {
        try {
            const token = localStorage.getItem('token');
            return token ? { token } : null;
        } catch (error) {
            return null;
        }
    });

    // 2. Loading is false because we checked the token in the lines above
    const [loading, setLoading] = useState(false);

    const register = async (username, email, password) => {
        console.log("testing");
        setLoading(true);
        try {
            const res = await instance.post('/auth/register', { username, email, password });
            console.log(res);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return res.data;
        } catch (error) {
            console.error("Register Error:", error);
            console.log("testing");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await instance.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return res.data;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};