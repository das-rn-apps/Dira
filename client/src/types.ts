export interface IUser {
  _id: string;
  name: string;
  email: string;
}
export interface ITask {
  _id: string;
  project_id: string;
  title: string;
  description: string;
  comments: string[]; // Or adjust if you're storing full comment objects
  status: "todo" | "in-progress" | "done" | "testing";
  assignee?: IUser | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMember {
  user: IUser;
  role: string;
}

export interface IProject {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  members: IMember[];
  owner?: IUser;
  tasks?: string[] | ITask[];
}
