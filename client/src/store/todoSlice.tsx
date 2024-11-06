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

// Define the initial state for the todo slice as an empty array of todos.
const initialState: ITodo[] = [];

const todoSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {
		// Action to set the todo list in the state
		setTodos(_state, action: PayloadAction<ITodo[]>) {
			return action.payload; // Replace the current state with the new list of todos from action payload
		},
		// Action to clear the todo list, resetting to the initial empty state
		clearTodos: () => {
			return initialState; // Reset the state back to the initial empty array
		},
	},
});

// Exporting the actions (setTodos and clearTodos) to be used in the application
export const { setTodos, clearTodos } = todoSlice.actions;
// Exporting the reducer to be added to the store
export default todoSlice.reducer;
