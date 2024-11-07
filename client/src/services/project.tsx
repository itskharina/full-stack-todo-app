const baseUrl = 'http://localhost:3001/projects';
import { IProject } from '../store/todoSlice';
import tokenService from '../services/token.js';

// Helper function to get headers for authorization and content type
const getAuthHeaders = () => ({
	// Ensure JSON format for request body
	'Content-type': 'application/json; charset=UTF-8',
	// Retrieve and add the token from tokenService if available
	Authorization: tokenService.getToken() || '',
});

// Fetches all projects from the server
const getProjects = async () => {
	try {
		// Send a POST request with data to the server
		const response = await fetch(baseUrl, {
			headers: getAuthHeaders(), // Add headers with content type and authorization token
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		// Parses and returns the JSON data
		return await response.json();
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

// Fetches a single project by its name
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

// Fetches a single project by its ID
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

// Creates a new project by sending a POST request with the project data.
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

// Deletes a project by its ID
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
