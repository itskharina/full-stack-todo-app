import mongoose, { Document, Schema } from 'mongoose';

interface IUser {
	id: string;
	username: string;
	name: string;
	passwordHash: string;
	todos: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	name: String,
	passwordHash: String,
	todos: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Todo',
		},
	],
});

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
