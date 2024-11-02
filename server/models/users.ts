import mongoose, { Document, Schema } from 'mongoose';

interface IUser {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	passwordHash: string;
	todos: mongoose.Types.ObjectId[];
}

const userSchema: Schema = new Schema<IUser>({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	first_name: String,
	last_name: String,
	passwordHash: String,
	todos: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Todo',
		},
	],
});

const emailValidator = (email: string) => {
	// Add your custom validation logic here, e.g., using regular expressions
	return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

userSchema.path('email').validate(emailValidator, 'Invalid email format');

userSchema.set('toJSON', {
	transform: (_document: Document, returnedObject: Record<string, unknown>) => {
		returnedObject.id = returnedObject._id?.toString() ?? '';
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	},
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
