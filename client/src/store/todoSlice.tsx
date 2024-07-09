import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ITodo {
	title: string;
	todo: string;
	dueDate?: string;
	priority: string;
}

const initialState: ITodo[] = [
	{
		title: 'Initial Todo',
		todo: 'Welcome!',
		dueDate: '08/08/2002',
		priority: 'low',
	},
];

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
