import tokenService from '../services/token.js';

interface ITodo {
	id: string;
	title: string;
	todo: string;
	dueDate?: string;
	priority: string;
	project: string | null;
}

// Define the base URL for the project-related API endpoints.
const baseUrl = 'http://localhost:3001/todos';

// Helper function to get headers for authorization and content type
const getAuthHeaders = () => ({
	// Ensure JSON format for request body
	'Content-type': 'application/json; charset=UTF-8',
	// Retrieve and add the token from tokenService if available
	Authorization: tokenService.getToken() || '',
});

// Fetch all todos from the API
const getTodos = async () => {
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

// Create a new todo
const createTodo = async (newObject: ITodo) => {
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
		console.error('Error creating todo:', error);
		throw error;
	}
};

// Update an existing todo
const updateTodo = async (newObject: ITodo) => {
	try {
		const url = `${baseUrl}/${newObject.id}`;

		const response = await fetch(url, {
			method: 'PUT',

			body: JSON.stringify(newObject),
			headers: getAuthHeaders(),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error updating todo:', error);
		throw error;
	}
};

// Delete a todo item by its ID
const deleteTodo = (id: string) => {
	const request = fetch(`${baseUrl}/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});

	return request;
};

export default { getTodos, createTodo, deleteTodo, updateTodo };
