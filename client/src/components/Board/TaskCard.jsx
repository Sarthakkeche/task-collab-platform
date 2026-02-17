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
                    style={{
                        ...provided.draggableProps.style,
                    }}
                    className="mb-3 outline-none"
                >
                    <div 
                        className={`
                            bg-slate-700/60 p-3 rounded-xl border border-slate-600/50 shadow-sm relative transition-all duration-200
                            group hover:bg-slate-700/80 hover:shadow-lg
                            ${snapshot.isDragging 
                                ? 'shadow-2xl ring-2 ring-blue-500/50 bg-slate-700 cursor-grabbing z-50' 
                                : 'cursor-grab'}
                        `}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-200 font-medium text-sm leading-tight">
                                {task.title}
                            </span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {/* Description */}
                        {task.description && (
                            <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600/30">
                            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-slate-700">
                                <User size={12} />
                            </div>

                            <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md">
                                <Calendar size={10} />
                                <span>
                                    {format(new Date(task.createdAt), 'MMM d')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
