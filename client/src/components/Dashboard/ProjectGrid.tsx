import ProjectCard from "./ProjectCard";

interface Project {
    _id: string;
    name: string;
    description: string;
}

interface Props {
    projects: Project[];
}

export default function ProjectGrid({ projects }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
                <ProjectCard key={project._id} {...project} />
            ))}
        </div>
    );
}
