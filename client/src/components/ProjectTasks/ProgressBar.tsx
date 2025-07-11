import type { ITask } from "../../types";

interface Props {
    tasks: ITask[];
}

export default function ProgressBar({ tasks }: Props) {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(t => t.status === "done").length;
    const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
    const testingTasks = tasks.filter(t => t.status === "testing").length;

    const weightedProgress =
        completedTasks * 1 + inProgressTasks * 0.5 + testingTasks * 0.75;

    const progress = totalTasks === 0 ? 0 : Math.round((weightedProgress / totalTasks) * 100);

    const getStatusLabel = () => {
        if (progress === 100) return "Completed";
        if (progress === 0) return "Not Started";
        return "In Progress";
    };

    const getBarColor = () => {
        if (progress === 100) return "bg-green-500";
        if (progress >= 50) return "bg-yellow-400";
        return "bg-red-400";
    };

    return (
        <div className="py-1">
            <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold">Project Progress</h2>
                <span className="text-xs font-medium text-gray-600">{getStatusLabel()}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className={`${getBarColor()} h-3 rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="text-[11px] text-gray-500 text-right mt-1">
                ✅ {completedTasks} • 🔄 {inProgressTasks} • 🧪 {testingTasks} • ⏳ {totalTasks - completedTasks - inProgressTasks - testingTasks} • <b>{progress}%</b> done
            </div>
        </div>
    );
}
