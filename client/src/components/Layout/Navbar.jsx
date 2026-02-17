/* eslint-disable no-unused-vars */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Layout, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get user initial for the avatar (Defaults to 'U' if loading)
    const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800 shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                
                {/* 1. Logo Section */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                        <Layout size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-all">
                        TaskFlow
                    </span>
                </Link>

                {/* 2. Right Side Actions */}
                <div className="flex items-center gap-6">
                    
                    {/* Notification Bell (Visual only) */}
                    <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800/50">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0f172a] animate-pulse"></span>
                    </button>

                    {/* Divider */}
                    <div className="h-6 w-px bg-slate-800" />

                    {/* User Profile Pill */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
                            
                            {/* Avatar Circle */}
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner ring-2 ring-[#0f172a]">
                                {userInitial}
                            </div>
                            
                            {/* Name & Status */}
                            <div className="hidden md:flex flex-col pr-2">
                                <span className="text-xs text-slate-400 leading-none mb-1">Welcome back,</span>
                                <span className="text-sm font-semibold text-white leading-none">{user?.username || 'User'}</span>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout} 
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/20 transition-all"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;