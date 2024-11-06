// This variable will hold the authentication token used in requests.
let token: string | null = null;

// Function to set the token value with a given token string.
// The token is formatted as a "Bearer" token, which is a standard for authorization.
const setToken = (newToken: string) => {
	token = `Bearer ${newToken}`;
};

// Return the token as it is stored, or null if no token is set.
const getToken = () => token;

export default { setToken, getToken };
