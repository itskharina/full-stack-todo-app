import bcrypt from 'bcrypt';
import { describe, it, beforeEach, expect, vi, afterAll } from 'vitest';
import User from '../models/users.js';
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import Todo from '../models/todo.js';

const api = request(app);

describe('GET /users', () => {
	it('users are returned as json', async () => {
		const response = await api.get('/users');
		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toMatch(/application\/json/);
	});

	it('should return an error message when getting users fails', async () => {
		vi.spyOn(User, 'find').mockImplementationOnce(() => {
			throw new Error('Database error');
		});

		const response = await api.get('/users');
		expect(response.status).toBe(500);
		expect(response.body).toEqual({ error: 'Error getting users' });

		vi.restoreAllMocks();
	});
});

describe('POST /users', () => {
	beforeEach(async () => {
		await User.deleteMany({});
		await Todo.deleteMany({});

		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({ username: 'root', passwordHash });

		// await new Promise((resolve) => setTimeout(resolve, 2000));

		await user.save();
	});

	it('creation succeeds with a fresh username', async () => {
		const usersAtStart = await User.find({}).then((users) =>
			users.map((user) => user.toJSON())
		);

		console.log('start', usersAtStart);

		const newUser = {
			username: 'itsanna',
			name: 'Testing User Creation',
			password: 'testing',
		};

		await api
			.post('/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await User.find({}).then((users) =>
			users.map((user) => user.toJSON())
		);

		expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		expect(usernames).toContain(newUser.username);
	});

	it('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await User.find({}).then((users) =>
			users.map((user) => user.toJSON())
		);

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		};

		const response = await api
			.post('/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'Expected "username" to be unique' });

		const usersAtEnd = await User.find({}).then((users) =>
			users.map((user) => user.toJSON())
		);

		expect(usersAtEnd.length).toEqual(usersAtStart.length);
	});

	describe('DELETE /users', () => {
		it('delete request works', async () => {
			interface UserResponse {
				id: string;
				username: string;
				name: string;
				todos: string[];
			}

			const newUser = {
				username: 'itsanna1',
				name: 'Testing User Delete',
				password: 'testing',
			};

			const deleteResponse = await api.post('/users').send(newUser).expect(201);

			const deleteUserId = (deleteResponse.body as UserResponse).id.toString();

			const response = await api.delete(`/todos/${deleteUserId}`);
			expect(response.status).toBe(204);
			expect(response.body).toEqual({});
		});
	});
});

afterAll(async () => {
	await User.deleteMany({});
	await mongoose.connection.close();
	console.log('Server closed');
});
