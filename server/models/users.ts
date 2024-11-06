import mongoose, { Document, Schema } from 'mongoose';

interface IUser {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	passwordHash: string;
	todos: mongoose.Types.ObjectId[];
}

// Schema definition for the User model
const userSchema: Schema = new Schema<IUser>({
	// Unique identifier for the user
	email: {
		type: String,
		required: true,
		unique: true,
	},
	first_name: String,
	last_name: String,
	// Hashed password for security
	passwordHash: String,
	todos: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Todo',
		},
	],
});

// Custom email validation function using regex
const emailValidator = (email: string) => {
	// Validates email format: username@domain.tld
	return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

// Apply the email validator to the email field in the schema
userSchema.path('email').validate(emailValidator, 'Invalid email format');

// Custom transformation for the Project document when converting to JSON
// Removes MongoDB-specific fields and converts _id to id
userSchema.set('toJSON', {
	transform: (_document: Document, returnedObject: Record<string, unknown>) => {
		// Convert _id field into an 'id' field for consistency and a more readable output in the response
		returnedObject.id = returnedObject._id?.toString() ?? '';
		// Remove MongoDB-specific fields and sensitive data
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash; // Remove password hash for security
	},
});

// Define the User model using the schema
const User = mongoose.model<IUser>('User', userSchema);

export default User;
