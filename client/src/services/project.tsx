const baseUrl = 'http://localhost:3001/projects';
import { IProject } from '../store/todoSlice';
import tokenService from '../services/token.js';

const getAuthHeaders = () => ({
	'Content-type': 'application/json; charset=UTF-8',
	Authorization: tokenService.getToken() || '',
});

const getProjects = async () => {
	try {
		const response = await fetch(baseUrl, {
			headers: getAuthHeaders(),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

const getProjectByName = async (projectName: string) => {
	try {
		const response = await fetch(`${baseUrl}/${projectName}`, {
			headers: getAuthHeaders(),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

const getProjectById = async (projectId: string) => {
	try {
		const response = await fetch(`${baseUrl}/${projectId}`, {
			headers: getAuthHeaders(),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

const createProject = async (newObject: IProject) => {
	try {
		const response = await fetch(baseUrl, {
			method: 'POST',

			body: JSON.stringify(newObject),
			headers: getAuthHeaders(),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error creating project:', error);
		throw error;
	}
};

const deleteProject = (id: string) => {
	const request = fetch(`${baseUrl}/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});

	return request;
};

export default {
	getProjects,
	getProjectByName,
	createProject,
	deleteProject,
	getProjectById,
};
