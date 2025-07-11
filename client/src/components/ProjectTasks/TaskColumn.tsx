import { Droppable, Draggable } from "@hello-pangea/dnd";
import { BadgeCheck, User2 } from "lucide-react";
import type { ITask } from "../../types";

interface Props {
    status: string;
    tasks: ITask[];
}

const statusStyles = {
    "done": {
        bg: "bg-green-50 border-green-300",
        text: "text-green-600",
        label: "Done",
    },
    "in-progress": {
        bg: "bg-sky-50 border-sky-300",
        text: "text-blue-600",
        label: "In Progress",
    },
    "testing": {
        bg: "bg-yellow-50 border-yellow-300",
        text: "text-yellow-600",
        label: "Testing",
    },
    "todo": {
        bg: "bg-gray-50 border-gray-300",
        text: "text-gray-600",
        label: "Not Started",
    },
};

export default function TaskColumn({ status, tasks }: Props) {
    return (
        <Droppable droppableId={status}>
            {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 p-3 rounded min-h-[200px]"
                >
                    <h2 className="text-sm font-semibold capitalize mb-1">
                        {status.replace("-", " ")}
                    </h2>

                    {tasks.map((task, index) => {
                        const style = statusStyles[task.status] || statusStyles["todo"];

                        return (
                            <Draggable draggableId={task._id} index={index} key={task._id}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`p-4 mb-3 rounded border transition-all ${style.bg}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-sm font-semibold text-gray-800">{task.title}</h3>
                                            <span className={`${style.text} text-xs font-medium flex items-center gap-1`}>
                                                <BadgeCheck className="h-3 w-3" />
                                                {style.label}
                                            </span>
                                        </div>

                                        {task.description && (
                                            <p
                                                className="text-xs text-gray-600 mb-2"
                                                title={task.description}
                                            >
                                                {task.description.length > 30
                                                    ? task.description.slice(0, 30) + "..."
                                                    : task.description}
                                            </p>
                                        )}
                                        {task.assignee && (
                                            <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold mt-1">
                                                <User2 className="h-4 w-4" />
                                                Assigned to:<span className="text-sky-500">{task.assignee.name}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        );
                    })}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}
