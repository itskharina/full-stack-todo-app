import dotenv from 'dotenv';
dotenv.config();

// Set the port using the value from the .env file
const PORT: string = process.env.PORT || '3000';

// Set the MongoDB URI using the value from the .env file
const MONGODB_URI: string =
	process.env.NODE_ENV === 'test'
		? process.env.TEST_MONGODB_URI!
		: process.env.MONGODB_URI!;

export default {
	MONGODB_URI,
	PORT,
};
