import mongoose, { Document, Schema } from 'mongoose';

interface ITodo extends Document {
	todo: string;
	important?: boolean;
	// user: mongoose.Types.ObjectId | null;
}

const todoSchema: Schema = new Schema<ITodo>({
	todo: {
		type: String,
		required: true,
	},
	important: Boolean,
	// user: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'User',
	// },
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
