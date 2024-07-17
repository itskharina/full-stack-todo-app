const baseUrl = 'http://localhost:3001/projects';

export interface IProject {
	name: string;
}

const getProjects = async () => {
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

const getProjectById = async (projectId: string) => {
	try {
		const response = await fetch(`${baseUrl}/${projectId}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

const createProject = async (newObject: IProject) => {
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
		console.error('Error creating project:', error);
		throw error;
	}
};

export default {
	getProjects,
	getProjectById,
	createProject,
};
