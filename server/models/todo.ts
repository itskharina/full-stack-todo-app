import mongoose, { Document, Schema } from 'mongoose';

interface ITodo {
	title: string;
	todo: string;
	dueDate?: Date;
	priority: string;
	project: mongoose.Types.ObjectId | null;
	user: mongoose.Types.ObjectId;
}

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
		enum: ['none', 'high', 'medium', 'low'],
		required: true,
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
		required: false,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

todoSchema.set('toJSON', {
	transform: (_document: Document, returnedObject: Record<string, unknown>) => {
		returnedObject.id = returnedObject._id?.toString() ?? '';
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Todo = mongoose.model<ITodo>('Todo', todoSchema);
export default Todo;
