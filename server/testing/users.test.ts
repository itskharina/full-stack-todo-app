import bcrypt from 'bcrypt';
import { describe, it, beforeEach, expect } from 'vitest';
import User from '../models/users.js';
import request from 'supertest';
import app from '../server.js';

const api = request(app);

describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({ username: 'root', passwordHash });

		await user.save();
	});

	it('creation succeeds with a fresh username', async () => {
		const usersAtStart = await User.find({}).then((users) =>
			users.map((user) => user.toJSON())
		);

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
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
		expect(response.body).toEqual({ error: 'expected "username" to be unique' });

		const usersAtEnd = await User.find({}).then((users) =>
			users.map((user) => user.toJSON())
		);

		expect(usersAtEnd.length).toEqual(usersAtStart.length);
	});
});
