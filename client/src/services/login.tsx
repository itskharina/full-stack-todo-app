import tokenService from '../services/token.js';

interface IUser {
	email: string;
	password: string;
}

const baseUrl = 'http://localhost:3001/login';

const loginUser = async (newObject: IUser) => {
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
		const data = await response.json();
		tokenService.setToken(data.token);
		return data;
	} catch (error) {
		console.error('Error logging in:', error);
		throw error;
	}
};

export default { loginUser };
