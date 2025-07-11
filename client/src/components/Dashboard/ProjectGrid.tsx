import type { IProject } from "../../types";
import ProjectCard from "./ProjectCard";

interface Props {
    projects: IProject[];
}

export default function ProjectGrid({ projects }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {projects.map((project) => (
                <ProjectCard key={project._id} {...project} />
            ))}
        </div>

    );
}
