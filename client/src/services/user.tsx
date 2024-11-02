import tokenService from '../services/token.js';

interface INewUser {
	email: string;
	first_name: string;
	last_name: string;
	password: string;
}

const baseUrl = 'http://localhost:3001/users';

const getAuthHeaders = () => ({
	'Content-type': 'application/json; charset=UTF-8',
	Authorization: tokenService.getToken() || '',
});

const createUser = async (newObject: INewUser) => {
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
		console.error('Error creating user:', error);
		throw error;
	}
};

const deleteUser = (id: string) => {
	const request = fetch(`${baseUrl}/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});

	return request;
};

export default { createUser, deleteUser };
