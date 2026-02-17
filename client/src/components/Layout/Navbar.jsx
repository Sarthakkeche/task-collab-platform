/* eslint-disable no-unused-vars */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userInitial = user?.username
        ? user.username.charAt(0).toUpperCase()
        : 'U';

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-800">
            
            {/* Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

                {/* Flex Wrapper (Allows Wrapping) */}
                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg">
                            <Layout size={18} className="text-white" />
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-white">
                            TaskFlow
                        </span>
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center gap-3 flex-wrap justify-end w-auto">

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {userInitial}
                        </div>

                        {/* Logout Button */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="
                                flex items-center gap-2
                                bg-red-500/10 hover:bg-red-500/20
                                text-red-500
                                px-3 sm:px-4
                                py-2
                                rounded-lg
                                text-sm font-medium
                                border border-red-500/20
                                transition-all
                                w-full sm:w-auto
                                justify-center
                            "
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </motion.button>

                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
