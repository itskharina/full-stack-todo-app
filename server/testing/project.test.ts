import { describe, it, afterAll, expect, vi, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import Project from '../models/project.js';
import User from '../models/users.js';

const api = request(app);
let authToken: string;

beforeAll(async () => {
	await mongoose.connect(process.env.TEST_MONGODB_URI as string);
});

beforeEach(async () => {
	await User.deleteMany({});
	await Project.deleteMany({});

	const newUser = {
		email: `${Date.now() + Math.random()}@gmail.com`,
		first_name: 'hi',
		last_name: 'hello',
		password: 'Testing1',
	};

	await new Promise((resolve) => setTimeout(resolve, 2000));

	const response = await api.post('/users').send(newUser);

	expect(response.status).toBe(201);

	const loginResponse = await api.post('/login').send(newUser);

	authToken = loginResponse.body.token as string;
});

describe('GET /projects', () => {
	it('projects are returned as json', async () => {
		const response = await api
			.get('/projects')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${authToken}`);
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toMatch(/application\/json/);
	});

	it('should return an error message when getting projects fails', async () => {
		vi.spyOn(Project, 'find').mockImplementationOnce(() => {
			throw new Error('Database error');
		});

		const response = await api
			.get('/projects')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${authToken}`);
		expect(response.status).toBe(500);
		expect(response.body).toEqual({ error: 'Error getting projects' });

		vi.restoreAllMocks();
	});
});

describe('POST /projects', () => {
	it('post request works', async () => {
		const testProject = {
			name: 'Testing!',
		};

		const response = await api
			.post('/projects')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${authToken}`)
			.send(testProject);
		expect(response.status).toBe(201);
		expect(response.body.name).toEqual('Testing!');
	});

	it.only('should return 400 when the name of the project is missing', async () => {
		const response = await api
			.post('/projects')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${authToken}`)
			.send({});
		// expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'Name required' });
	});
});

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	console.log('Server closed');
});
