import tokenService from '../services/token.js';

interface IUser {
	email: string;
	password: string;
}

const baseUrl = 'http://localhost:3001/login';

// Function to log in a user by sending their credentials to the login API
const loginUser = async (newObject: IUser) => {
	try {
		// Send a POST request to the login endpoint with user credentials
		const response = await fetch(baseUrl, {
			method: 'POST',
			body: JSON.stringify(newObject), // Convert the user data to JSON format
			headers: {
				'Content-type': 'application/json; charset=UTF-8', // Set header for JSON format
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		// Parse the JSON response to extract the token and any additional data
		const data = await response.json();

		// Save the token using the token service for future authorized requests
		tokenService.setToken(data.token);
		return data;
	} catch (error) {
		console.error('Error logging in:', error);
		throw error;
	}
};

export default { loginUser };
