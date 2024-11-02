import mongoose, { Document, Schema } from 'mongoose';

interface IProject {
	user: mongoose.Types.ObjectId;
	name: string;
	todos: mongoose.Types.ObjectId[];
}

const projectSchema: Schema = new Schema<IProject>({
	name: { type: String, required: true },
	todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }],
	user: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
});

projectSchema.set('toJSON', {
	transform: (_document: Document, returnedObject: Record<string, unknown>) => {
		returnedObject.id = returnedObject._id?.toString() ?? '';
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Project = mongoose.model<IProject>('Project', projectSchema);
export default Project;
