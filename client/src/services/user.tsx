import tokenService from '../services/token.js';

// Interface defining the structure of a new user object
interface INewUser {
	email: string;
	first_name: string;
	last_name: string;
	password: string;
}

// Base URL for user-related API endpoints
const baseUrl = 'http://localhost:3001/users';

// Helper function to get headers for authorization and content type
const getAuthHeaders = () => ({
	// Ensure JSON format for request body
	'Content-type': 'application/json; charset=UTF-8',
	// Retrieve and add the token from tokenService if available
	Authorization: tokenService.getToken() || '',
});

// Function to create a new user by sending a POST request to the API
const createUser = async (newObject: INewUser) => {
	try {
		// Send a POST request with user data to the server
		const response = await fetch(baseUrl, {
			method: 'POST',
			body: JSON.stringify(newObject),
			headers: getAuthHeaders(), // Add headers with content type and authorization token
		});

		// Check if the response is successful
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	}
};

// Function to delete a user by ID, sending a DELETE request to the API
const deleteUser = (id: string) => {
	const request = fetch(`${baseUrl}/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});

	return request;
};

export default { createUser, deleteUser };
