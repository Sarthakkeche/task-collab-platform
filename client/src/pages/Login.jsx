/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Sign in to continue to TaskFlow</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20} /> Sign In</>}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400">
                    Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;