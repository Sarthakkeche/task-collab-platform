import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const BoardColumn = ({ list, tasks, onAddTask, onDeleteTask }) => {
    return (
        <div className="bg-slate-100/80 p-4 rounded-xl w-80 min-w-[20rem] flex flex-col max-h-full border border-slate-200 shadow-sm">
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                    {list.title} 
                    <span className="ml-2 bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>
                </h3>
            </div>
            
            {/* Droppable Area */}
            <Droppable droppableId={list._id}>
                {(provided, snapshot) => (
                    <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto pr-1 min-h-[100px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard 
                                key={task._id} 
                                task={task} 
                                index={index} 
                                onDelete={onDeleteTask} 
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            {/* Add Task Button */}
            <button 
                onClick={() => onAddTask(list._id)}
                className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 hover:bg-slate-200/50 py-2 rounded-lg transition-colors w-full"
            >
                <Plus size={16} /> Add Task
            </button>
        </div>
    );
};

export default BoardColumn;