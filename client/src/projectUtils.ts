import { IProject } from './store/todoSlice';

export const projectToNameRepresentation = (project: IProject | null): string => {
	if (!project) return '';
	return project.name;
};
