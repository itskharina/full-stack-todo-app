import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IProject {
	id: string;
	name: string;
	todos: string[];
}

export interface ITodo {
	title: string;
	todo: string;
	dueDate?: string;
	priority: string;
	project: string | null;
}

const initialState: ITodo[] = [];

const todoSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {
		setTodos(_state, action: PayloadAction<ITodo[]>) {
			return action.payload;
		},
	},
});
export const { setTodos } = todoSlice.actions;
export default todoSlice.reducer;
