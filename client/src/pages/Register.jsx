/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const { register, loading } = useAuth(); // Assuming loading state is available
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-slate-400">Join TaskFlow and start collaborating</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                        <input 
                            name="username"
                            placeholder="Username" 
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                        <input 
                            name="email"
                            type="email"
                            placeholder="Email Address" 
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                        <input 
                            name="password"
                            type="password"
                            placeholder="Password" 
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                            onChange={handleChange} 
                        />
                    </div>

                    <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold py-3 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2">
                        <UserPlus size={20} /> Sign Up
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400">
                    Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;