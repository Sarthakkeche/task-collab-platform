import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import axios from '../api/axios';
import io from 'socket.io-client';
import TaskCard from '../components/Board/TaskCard';
import Navbar from '../components/Layout/Navbar';

const socket = io('http://localhost:5000');

const BoardView = () => {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const bRes = await axios.get(`/boards/${id}`);
                setBoard(bRes.data);
                
                // Fetch other data only after board loads
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
                console.warn("Activity log failed to load (ignoring):", err);
                // We don't set activities here, so it stays as [] (empty array)
            }
        };

        fetchBoardData();

        socket.emit('join_board', id);

        socket.on('task_updated', (updatedTask) => {
            setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
            fetchActivities(); 
        });

        socket.on('task_created', (newTask) => {
            setTasks(prev => [...prev, newTask]);
            fetchActivities();
        });

        socket.on('task_deleted', (taskId) => {
            setTasks(prev => prev.filter(t => t._id !== taskId));
            fetchActivities();
        });

        return () => {
            socket.off('task_updated');
            socket.off('task_created');
            socket.off('task_deleted');
        };
    }, [id, search]); 

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { draggableId, destination } = result;

        // Optimistic UI Update
        const updatedTasks = [...tasks];
        const taskIndex = updatedTasks.findIndex(t => t._id === draggableId);
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
            await axios.post('/tasks', { title, listId, boardId: id });
        } catch (err) {
            alert("Failed to add task",err);
        }
    };

    if (!board) return <div className="p-10 flex justify-center text-lg">Loading Board...</div>;

    return (
        <div className="h-screen flex flex-col bg-blue-50">
            <Navbar />
            
            {/* Toolbar */}
            <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">{board.title}</h1>
                <input 
                    placeholder="Search tasks..." 
                    className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Board Columns */}
                <div className="flex-1 overflow-x-auto p-4 flex gap-4">
                    <DragDropContext onDragEnd={onDragEnd}>
                        {board.lists.map(list => (
                            <Droppable key={list._id} droppableId={list._id}>
                                {(provided) => (
                                    <div 
                                        ref={provided.innerRef} 
                                        {...provided.droppableProps}
                                        className="bg-gray-100 p-3 rounded-lg w-80 h-fit shadow-sm border border-gray-200"
                                    >
                                        <div className="flex justify-between mb-3">
                                            <h3 className="font-semibold text-gray-700">{list.title}</h3>
                                            <button onClick={() => handleAddTask(list._id)} className="text-gray-500 hover:text-blue-600 font-bold text-xl">+</button>
                                        </div>
                                        
                                        <div className="max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                                            {tasks.filter(t => t.listId === list._id).map((task, index) => (
                                                <TaskCard key={task._id} task={task} index={index} />
                                            ))}
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </DragDropContext>
                </div>

                {/* Activity Sidebar */}
                <div className="w-72 bg-white border-l p-4 hidden md:block overflow-y-auto shadow-lg z-10">
                    <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Activity Log</h3>
                    <ul className="space-y-4">
                        {activities.map(act => (
                            <li key={act._id} className="text-sm text-gray-600 pb-2 border-b border-gray-100 last:border-0">
                                <span className="font-semibold text-blue-600">{act.userId?.username || 'System'}</span> 
                                <span className="ml-1">{act.details}</span>
                                <div className="text-xs text-gray-400 mt-1">
                                    {new Date(act.createdAt).toLocaleString()}
                                </div>
                            </li>
                        ))}
                        {activities.length === 0 && <p className="text-gray-400 text-sm text-center italic">No recent activity</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BoardView;