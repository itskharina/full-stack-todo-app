import mongoose, { Document, Schema } from 'mongoose';

interface IProject extends Document {
	name: string;
	todos: mongoose.Types.ObjectId[];
}

const projectSchema: Schema<IProject> = new Schema({
	name: { type: String, required: true },
	todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }],
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
