import { describe, it, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import Project from '../models/project.js';

const api = request(app);

describe('GET /projects', () => {
	it('projects are returned as json', async () => {
		const response = await api.get('/projects');
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toMatch(/application\/json/);
	});

	it('should return an error message when getting projects fails', async () => {
		vi.spyOn(Project, 'find').mockImplementationOnce(() => {
			throw new Error('Database error');
		});

		const response = await api.get('/projects');
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
			.send(testProject);
		expect(response.status).toBe(201);
		expect(response.body.name).toEqual('Testing!');
	});

	it('should return 400 when the name of the project is missing', async () => {
		const response = await api.post('/projects').send({});
		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'Name required' });
	});
});

afterAll(async () => {
	await mongoose.connection.close();
	console.log('Server closed');
});
