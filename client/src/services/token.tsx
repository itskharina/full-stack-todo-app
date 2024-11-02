let token: string | null = null;

const setToken = (newToken: string) => {
	token = `Bearer ${newToken}`;
};

const getToken = () => token;

export default { setToken, getToken };
