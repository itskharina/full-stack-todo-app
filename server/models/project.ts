import mongoose, { Document, Schema } from 'mongoose';

interface IProject {
	// Reference to the user who owns this project
	user: mongoose.Types.ObjectId;
	name: string;
	// Array of references to associated Todo documents
	todos: mongoose.Types.ObjectId[];
}

// Schema definition for the Project model
const projectSchema: Schema = new Schema<IProject>({
	name: { type: String, required: true },
	// The 'todos' field stores an array of ObjectIds that refer to the Todo model
	todos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Todo',
		},
	],
	// The 'user' field references the User who created/owns the project
	user: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
});

// Custom transformation for the Project document when converting to JSON
// Removes MongoDB-specific fields and converts _id to id
projectSchema.set('toJSON', {
	// Record<string, unknown> creates an object type with keys that are strings and unknown type values
	transform: (_document: Document, returnedObject: Record<string, unknown>) => {
		// Convert _id field into an 'id' field for consistency and a more readable output in the response
		returnedObject.id = returnedObject._id?.toString() ?? '';
		// Remove the _id and __v fields from the returned object
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

// Define the Project model using the schema
const Project = mongoose.model<IProject>('Project', projectSchema);
export default Project;
