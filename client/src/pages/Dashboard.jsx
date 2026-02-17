/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Layout, Search, ArrowRight, Loader2 } from 'lucide-react';
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
                const boardData = Array.isArray(res.data)
                    ? res.data
                    : (res.data.boards || []);
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
            alert('Failed to create board');
        }
    };

    const filteredBoards = boards.filter(b =>
        b.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
            <Navbar />

            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-72 sm:w-96 h-72 sm:h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">

                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-3">
                            <Layout className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                            Workspaces
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm sm:text-base">
                            Manage your projects and tasks effectively.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search boards..."
                            className="w-full bg-slate-800/60 border border-slate-700 rounded-full py-2.5 pl-10 pr-6 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Create Board */}
                <div className="bg-slate-800/50 backdrop-blur-lg p-3 rounded-2xl border border-slate-700/50 shadow-xl mb-10">
                    <form
                        onSubmit={createBoard}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <input
                            className="flex-1 bg-transparent text-white px-4 py-2 placeholder:text-slate-500 focus:outline-none"
                            placeholder="Create a new board..."
                            value={newBoardTitle}
                            onChange={(e) => setNewBoardTitle(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <Plus size={18} /> Create
                        </button>
                    </form>
                </div>

                {/* Boards Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        <AnimatePresence>
                            {filteredBoards.map((board) => (
                                <motion.div
                                    key={board._id}
                                    whileHover={{ y: -5 }}
                                    layout
                                >
                                    <Link to={`/board/${board._id}`} className="block h-full">
                                        <div className="group h-full bg-slate-800/60 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/50 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-blue-900/20">

                                            <div className="flex flex-col h-full justify-between">
                                                <div>
                                                    <h2 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                                                        {board.title}
                                                    </h2>
                                                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-wider">
                                                        Workspace
                                                    </p>
                                                </div>

                                                <div className="mt-6 flex justify-between items-center text-slate-400">
                                                    <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-md border border-slate-600/50">
                                                        {new Date(board.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <ArrowRight
                                                        size={18}
                                                        className="opacity-0 group-hover:opacity-100 transition-all"
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
