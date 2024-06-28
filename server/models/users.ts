import mongoose, { Document, Schema } from 'mongoose';

interface IUser {
	id?: string;
	username: string;
	name: string;
	passwordHash: string;
	notes: Array<string>;
}

const userSchema = new Schema<IUser>({
	username: String,
	name: String,
	passwordHash: String,
	notes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Note',
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
