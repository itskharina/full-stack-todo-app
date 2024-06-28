import dotenv from 'dotenv';
dotenv.config();

const PORT: string = process.env.PORT || '3000';

const MONGODB_URI: string =
	process.env.NODE_ENV === 'test'
		? process.env.TEST_MONGODB_URI!
		: process.env.MONGODB_URI!;

export default {
	MONGODB_URI,
	PORT,
};
