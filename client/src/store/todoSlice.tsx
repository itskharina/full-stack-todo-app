import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IProject {
	id: string;
	name: string;
	todos: string[];
}

export interface ITodo {
	id: string;
	title: string;
	todo: string;
	dueDate?: string;
	priority: string;
	project: string | IProject | null;
}

const initialState: ITodo[] = [];

const todoSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {
		setTodos(_state, action: PayloadAction<ITodo[]>) {
			return action.payload;
		},
		clearTodos: () => {
			return initialState;
		},
	},
});
export const { setTodos, clearTodos } = todoSlice.actions;
export default todoSlice.reducer;
