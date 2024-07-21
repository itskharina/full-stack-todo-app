interface ITodo {
	title: string;
	todo: string;
	dueDate?: string;
	priority: string;
	project: string | null;
}

const baseUrl = 'http://localhost:3001/todos';

const getTodos = async () => {
	try {
		const response = await fetch(baseUrl);
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
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
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

// const deleteTodo = (id) => {
// 	const request = fetch(`${baseUrl}/${id}`, {
// 		method: 'DELETE',
// 	});

// 	return request;
// };

export default { getTodos, createTodo };
