import mongoose, { Document, Schema } from 'mongoose';

interface ITodo {
	title: string;
	todo: string;
	dueDate?: Date;
	priority: string;
	// Optional reference to the project this todo belongs to
	project: mongoose.Types.ObjectId | null;
	// Reference to the user who owns this todo
	user: mongoose.Types.ObjectId;
}

// Schema definition for the Todo model
const todoSchema: Schema = new Schema<ITodo>({
	title: {
		type: String,
		required: true,
	},
	todo: {
		type: String,
		required: true,
	},
	dueDate: {
		type: Date,
		required: false,
	},
	priority: {
		type: String,
		// Must be one of specified enum values
		enum: ['none', 'high', 'medium', 'low'],
		required: true,
	},
	// Optional reference to associated project
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
		required: false,
	},
	// Reference to the user who owns this todo
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

// Custom transformation for the Project document when converting to JSON
// Removes MongoDB-specific fields and converts _id to id
todoSchema.set('toJSON', {
	transform: (_document: Document, returnedObject: Record<string, unknown>) => {
		// Convert _id field into an 'id' field for consistency and a more readable output in the response
		returnedObject.id = returnedObject._id?.toString() ?? '';
		// Remove the _id and __v fields from the returned object
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

// Define the Project model using the schema
const Todo = mongoose.model<ITodo>('Todo', todoSchema);
export default Todo;
