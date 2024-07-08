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
			title: 'Testing!',
			todo: 'Test Todo',
			dueDate: '08/08/2024',
			priority: 'high',
		};

		const response = await api
			.post('/todos')
			.set('Content-Type', 'application/json')
			.send(testTodo);
		expect(response.status).toBe(201);
		expect(response.body.title).toEqual('Testing!');
		expect(response.body.todo).toEqual('Test Todo');
		expect(response.body.dueDate).toEqual('08/08/2024');
		expect(response.body.priority).toEqual('high');
	});

	it('should return 400 when content of todo is missing', async () => {
		const response = await api.post('/todos').send({});
		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'Content missing' });
	});

	it('should still do put request even when due date is empty', async () => {
		const testTodo = {
			title: 'Testing!',
			todo: 'Test Todo',
			dueDate: '',
			priority: 'high',
		};

		const response = await api
			.post('/todos')
			.set('Content-Type', 'application/json')
			.send(testTodo);
		expect(response.status).toBe(201);
		expect(response.body.title).toEqual('Testing!');
		expect(response.body.todo).toEqual('Test Todo');
		expect(response.body.dueDate).toEqual('');
		expect(response.body.priority).toEqual('high');
	});
});

describe('/DELETE todos/id', () => {
	let testTodoId: string;

	beforeEach(async () => {
		// Create a new todo before each test in this suite
		const testTodo = {
			title: 'Deleting!',
			todo: 'Test Todo for Deletion',
			dueDate: '20/10/2024',
			priority: 'low',
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

describe('/PUT todos/id', () => {
	let testTodoId: string;

	const updateTodo = {
		title: 'Updating!',
		todo: 'Updated Todo',
		dueDate: '',
		priority: 'none',
	};

	beforeEach(async () => {
		const testTodo = {
			title: 'Updating!',
			todo: 'Test Todo to Update',
			dueDate: '08/08/2024',
			priority: 'medium',
		};

		const response = await api
			.post('/todos')
			.set('Content-Type', 'application/json')
			.send(testTodo);

		expect(response.status).toBe(201);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		testTodoId = response.body.id.toString();
	});

	it('put request works', async () => {
		const response = await api.put(`/todos/${testTodoId}`).send(updateTodo);
		expect(response.status).toBe(200);
		expect(response.body.title).toEqual('Updating!');
		expect(response.body.todo).toEqual('Updated Todo');
		expect(response.body.dueDate).toEqual('');
		expect(response.body.priority).toEqual('none');
	});

	it("error message displays if ID doesn't exist", async () => {
		const response = await api.put('/todos/wrong-id').send(updateTodo);
		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'Malformatted id' });
	});

	it('error message displays if todo content is empty', async () => {
		const emptyTodo = {
			title: 'Empty Content',
			todo: '',
			dueDate: '08/08/2024',
			priority: 'high',
		};

		const response = await api.put(`/todos/${testTodoId}`).send(emptyTodo);
		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'Content cannot be empty' });
	});
});

afterAll(async () => {
	await mongoose.connection.close();
	console.log('Server closed');
});
