import { Droppable, Draggable } from "@hello-pangea/dnd";
import { BadgeCheck, User2 } from "lucide-react";
import type { Task } from "../../pages/ProjectTasks";


interface Props {
    status: string;
    tasks: Task[];
    members: { _id: string; name: string }[];
}

export default function TaskColumn({ status, tasks, members }: Props) {
    return (
        <Droppable droppableId={status}>
            {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 p-3 rounded min-h-[200px]"
                >
                    <h2 className="text-xl font-semibold capitalize mb-2">{status.replace("-", " ")}</h2>
                    {tasks.map((task, index) => (
                        <Draggable draggableId={task._id} index={index} key={task._id}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="p-4 mb-3 bg-white rounded-xs border border-gray-300 shadow-xs hover:shadow-sm transition-all"
                                >
                                    {/* Title */}
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-sm font-semibold text-gray-800">{task.title}</h3>
                                        {task.status === "done" && (
                                            <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                                                <BadgeCheck className="h-3 w-3" />
                                                Done
                                            </span>
                                        )}

                                        {task.status === "in-progress" && (
                                            <span className="text-blue-600 text-xs font-medium flex items-center gap-1">
                                                <BadgeCheck className="h-3 w-3" />
                                                In Progress
                                            </span>
                                        )}

                                        {task.status === "todo" && (
                                            <span className="text-yellow-600 text-xs font-medium flex items-center gap-1">
                                                <BadgeCheck className="h-3 w-3" />
                                                Not Stared
                                            </span>
                                        )}

                                    </div>

                                    {/* Description */}
                                    {task.description && (
                                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                                    )}

                                    {/* Assignee */}
                                    {task.assignee && (
                                        <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium mt-1">
                                            <User2 className="h-4 w-4" />
                                            Assigned to: {task.assignee.name}
                                        </div>
                                    )}

                                    {/* Optional: Show all members (visible at bottom) */}
                                    <div className="mt-3 flex flex-wrap items-center gap-1">
                                        {members?.map((m: any) => (
                                            <span
                                                key={m._id}
                                                className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium"
                                            >
                                                {m.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}
