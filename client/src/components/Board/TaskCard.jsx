import { Draggable } from '@hello-pangea/dnd';
import { Trash2, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const TaskCard = ({ task, index, onDelete }) => {
    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white p-3 mb-2 rounded-lg shadow-sm border border-slate-200 group relative hover:shadow-md transition-all ${snapshot.isDragging ? 'shadow-lg rotate-2 ring-2 ring-blue-400' : ''}`}
                    style={provided.draggableProps.style}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-800 font-medium text-sm leading-tight">{task.title}</span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    {task.description && (
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        {/* Placeholder for Assignee Avatar */}
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 font-bold border-2 border-white" title="Assigned User">
                                <User size={12} />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Calendar size={10} />
                            <span>{format(new Date(task.createdAt), 'MMM d')}</span>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;