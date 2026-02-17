import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import axios from '../api/axios';
import { Search, Plus } from 'lucide-react';
import TaskCard from '../components/Board/TaskCard';
import Navbar from '../components/Layout/Navbar';
import { useSocket } from '../context/SocketContext';

const BoardView = () => {
    const { id } = useParams();
    const { socket } = useSocket();
    const [board, setBoard] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const bRes = await axios.get(`/boards/${id}`);
                setBoard(bRes.data);
                fetchTasks();
                fetchActivities();
            } catch (err) {
                console.error("Error loading board:", err);
            }
        };

        const fetchTasks = async () => {
            try {
                const tRes = await axios.get(`/tasks/${id}?search=${search}`);
                setTasks(tRes.data);
            } catch (err) {
                console.error("Error loading tasks:", err);
            }
        };

        const fetchActivities = async () => {
            try {
                const aRes = await axios.get(`/activity/${id}`);
                setActivities(aRes.data);
            } catch (err) {
                console.warn("Activity log failed:", err);
            }
        };

        fetchBoardData();

        if (!socket) return;

        socket.emit('join_board', id);

        const handleTaskUpdate = (updatedTask) => {
             setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
             fetchActivities();
        };

        const handleTaskCreate = (newTask) => {
             setTasks(prev => [...prev, newTask]);
             fetchActivities();
        };

        const handleTaskDelete = (taskId) => {
             setTasks(prev => prev.filter(t => t._id !== taskId));
             fetchActivities();
        };

        socket.on('task_updated', handleTaskUpdate);
        socket.on('task_created', handleTaskCreate);
        socket.on('task_deleted', handleTaskDelete);

        return () => {
            socket.off('task_updated', handleTaskUpdate);
            socket.off('task_created', handleTaskCreate);
            socket.off('task_deleted', handleTaskDelete);
        };
    }, [id, search, socket]);

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { draggableId, destination } = result;
        const updatedTasks = [...tasks];
        const taskIndex = updatedTasks.findIndex(t => t._id === draggableId);
        
        if (taskIndex === -1) return;

        updatedTasks[taskIndex].listId = destination.droppableId;
        setTasks(updatedTasks);

        try {
            await axios.put(`/tasks/${draggableId}`, {
                listId: destination.droppableId,
                boardId: id
            });
        } catch (err) {
            console.error("Failed to move task:", err);
        }
    };

    const handleAddTask = async (listId) => {
        const title = prompt("Task Title:");
        if (!title) return;

        try {
            await axios.post('/tasks', {
                title,
                listId,
                boardId: id
            });
        } catch (err) {
            alert("Failed to add task",err);
        }
    };

    if (!board) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
                Loading board...
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
            <Navbar />

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm shrink-0">
                <h1 className="text-xl font-semibold tracking-tight text-white">
                    {board.title}
                </h1>

                <div className="relative group">
                    <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all w-64 text-slate-200 placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Board Section - CHANGED: No scroll, fits container */}
                <div className="flex-1 p-6 overflow-hidden h-full">
                    <DragDropContext onDragEnd={onDragEnd}>
                        {/* CHANGED: Grid layout instead of Flex to force equal widths */}
                        <div className="grid grid-cols-3 gap-6 h-full w-full">
                            {board.lists.map(list => (
                                <Droppable key={list._id} droppableId={list._id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            // CHANGED: Removed fixed widths (w-80), added w-full min-w-0
                                            className={`
                                                bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm w-full min-w-0 flex flex-col max-h-full
                                                transition-colors duration-200
                                                ${snapshot.isDraggingOver ? 'bg-slate-800/80 border-indigo-500/30 ring-1 ring-indigo-500/30' : ''}
                                            `}
                                        >
                                            <div className="flex justify-between items-center mb-4 px-1 shrink-0">
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">
                                                    {list.title}
                                                </h3>
                                                <button
                                                    onClick={() => handleAddTask(list._id)}
                                                    className="text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 p-1 rounded transition-all shrink-0"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>

                                            <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar flex-1 min-h-0">
                                                {tasks
                                                    .filter(t => t.listId === list._id)
                                                    .map((task, index) => (
                                                        <TaskCard
                                                            key={task._id}
                                                            task={task}
                                                            index={index}
                                                        />
                                                    ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                </div>

                {/* Activity Sidebar */}
                <div className="w-80 border-l border-slate-800 bg-slate-950/50 hidden lg:flex flex-col shrink-0">
                    <div className="p-6 border-b border-slate-800/50 shrink-0">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Activity Log
                        </h3>
                    </div>

                    <ul className="flex-1 overflow-y-auto p-6 space-y-6">
                        {activities.map(act => (
                            <li key={act._id} className="relative pl-4 border-l border-slate-800">
                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-950" />
                                <div className="text-sm text-slate-400 break-words">
                                    <span className="text-indigo-400 font-medium">
                                        {act.userId?.username || 'System'}
                                    </span>
                                    <span className="ml-1 text-slate-300">{act.details}</span>
                                </div>
                                <div className="text-xs text-slate-600 mt-1.5">
                                    {new Date(act.createdAt).toLocaleString([], { 
                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                    })}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BoardView;