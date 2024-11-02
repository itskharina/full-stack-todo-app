import tokenService from '../services/token.js';

interface ITodo {
	id: string;
	title: string;
	todo: string;
	dueDate?: string;
	priority: string;
	project: string | null;
}

const baseUrl = 'http://localhost:3001/todos';

const getAuthHeaders = () => ({
	'Content-type': 'application/json; charset=UTF-8',
	Authorization: tokenService.getToken() || '',
});

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

const deleteTodo = (id: string) => {
	const request = fetch(`${baseUrl}/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});

	return request;
};

export default { getTodos, createTodo, deleteTodo, updateTodo };
