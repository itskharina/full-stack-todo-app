/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, it, afterAll, beforeEach, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import Todo from '../models/todo.js';

const api = request(app);

describe('GET /todos', () => {
	it('notes are returned as json', async () => {
		const response = await api.get('/todos');
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toMatch(/application\/json/);
	});

	it('should return an error message when getting todos fails', async () => {
		vi.spyOn(Todo, 'find').mockImplementationOnce(() => {
			throw new Error('Database error');
		});

		const response = await api.get('/todos');
		expect(response.status).toBe(500);
		expect(response.body).toEqual({ error: 'Error getting tasks' });

		vi.restoreAllMocks();
	});
});

describe('POST /todos', () => {
	it('post request works', async () => {
		const testTodo = {
			todo: 'Test Todo',
			important: true,
		};

		const response = await api
			.post('/todos')
			.set('Content-Type', 'application/json')
			.send(testTodo);
		expect(response.status).toBe(201);
		expect(response.body.todo).toEqual('Test Todo');
		expect(response.body.important).toEqual(true);
	});

	it('should return 400 when content of todo is missing', async () => {
		const response = await api.post('/todos').send({});
		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'Content missing' });
	});
});

describe('/DELETE todos/id', () => {
	let testTodoId: string;

	beforeEach(async () => {
		// Create a new todo before each test in this suite
		const testTodo = {
			todo: 'Test Todo for Deletion',
			important: true,
		};

		const response = await api
			.post('/todos')
			.set('Content-Type', 'application/json')
			.send(testTodo);

		expect(response.status).toBe(201);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		testTodoId = response.body.id.toString();
	});

	it('delete request works', async () => {
		const response = await api.delete(`/todos/${testTodoId}`);
		expect(response.status).toBe(204);
		expect(response.body).toEqual({});
	});

	it('should return an error message when getting todos fails', async () => {
		const response = await api.delete('/todos/wrong-id');
		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'Malformatted id' });
	});
});

afterAll(async () => {
	await mongoose.connection.close();
	console.log('Server closed');
});
