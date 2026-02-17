/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Layout, Search, ArrowRight, Loader2 } from 'lucide-react';

// 1. IMPORT NAVBAR
import Navbar from '../components/Layout/Navbar';

const Dashboard = () => {
    const [boards, setBoards] = useState([]);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const res = await axios.get('/boards');
                const boardData = Array.isArray(res.data) ? res.data : (res.data.boards || []);
                setBoards(boardData);
            } catch (err) {
                console.error("Error fetching boards:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBoards();
    }, []);

    const createBoard = async (e) => {
        e.preventDefault();
        if (!newBoardTitle.trim()) return;
        try {
            const res = await axios.post('/boards', { title: newBoardTitle });
            setBoards([...boards, res.data]);
            setNewBoardTitle('');
        } catch (err) {
            alert('Failed to create board',err);
        }
    };

    const filteredBoards = boards.filter(b => 
        b.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden flex flex-col">
            
            {/* 2. ADD NAVBAR HERE */}
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-12 z-10 w-full flex-1">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-3">
                            <Layout className="w-10 h-10 text-blue-400" />
                            Workspaces
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg">Manage your projects and tasks effectively.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-auto group">
                        <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search boards..." 
                            className="bg-slate-800/50 border border-slate-700 rounded-full py-2.5 pl-10 pr-6 w-full md:w-64 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </motion.div>

                {/* Create Board Input */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/40 backdrop-blur-xl p-1 rounded-2xl border border-slate-700/50 shadow-2xl mb-12 max-w-2xl mx-auto"
                >
                    <form onSubmit={createBoard} className="flex gap-2 p-2">
                        <input 
                            className="flex-1 bg-transparent text-white px-4 text-lg placeholder:text-slate-500 focus:outline-none"
                            placeholder="Create a new board..."
                            value={newBoardTitle}
                            onChange={(e) => setNewBoardTitle(e.target.value)}
                        />
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all"
                        >
                            <Plus size={20} /> Create
                        </motion.button>
                    </form>
                </motion.div>

                {/* Boards Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredBoards.map((board) => (
                                <motion.div
                                    key={board._id}
                                    variants={itemVariants}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    layout
                                >
                                    <Link to={`/board/${board._id}`} className="block h-full">
                                        <div className="group h-full bg-slate-800/50 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-blue-900/20">
                                            
                                            {/* Hover Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            
                                            <div className="relative z-10 flex flex-col h-full justify-between">
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                                                        {board.title}
                                                    </h2>
                                                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-wider font-medium">
                                                        Workspace
                                                    </p>
                                                </div>
                                                
                                                <div className="mt-8 flex justify-between items-center text-slate-400 group-hover:text-slate-200">
                                                    <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-md border border-slate-600/50">
                                                        {new Date(board.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <ArrowRight size={18} className="transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;