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
		const user = new User({ email: 'root@gmail.com', passwordHash });

		// await new Promise((resolve) => setTimeout(resolve, 2000));

		await user.save();
	});

	it('creation succeeds with a fresh email', async () => {
		const usersAtStart = await User.find({}).then((users) =>
			users.map((user) => user.toJSON())
		);

		console.log('start', usersAtStart);

		const newUser = {
			email: 'itsanna@gmail.com',
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

		const emails = usersAtEnd.map((u) => u.email);
		expect(emails).toContain(newUser.email);
	});

	it('creation fails with proper statuscode and message if email already taken', async () => {
		const usersAtStart = await User.find({}).then((users) =>
			users.map((user) => user.toJSON())
		);

		const newUser = {
			email: 'root@gmail.com',
			name: 'Superuser',
			password: 'salainen',
		};

		const response = await api
			.post('/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'Expected "email" to be unique' });

		const usersAtEnd = await User.find({}).then((users) =>
			users.map((user) => user.toJSON())
		);

		expect(usersAtEnd.length).toEqual(usersAtStart.length);
	});

	describe('DELETE /users', () => {
		it('delete request works', async () => {
			interface UserResponse {
				id: string;
				email: string;
				name: string;
				todos: string[];
			}

			const newUser = {
				email: 'itsanna1@gmail.com',
				name: 'Testing User Delete',
				password: 'testing',
			};

			const deleteResponse = await api.post('/users').send(newUser).expect(201);

			const deleteUserId = (deleteResponse.body as UserResponse).id.toString();

			const response = await api.delete(`/todos/${deleteUserId}`);
			console.log(response);
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
