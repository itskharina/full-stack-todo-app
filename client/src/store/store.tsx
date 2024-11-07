import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

// Configure the Redux store and add the todo reducer to it
const store = configureStore({
	reducer: {
		todo: todoReducer, // Register the todo slice reducer under the "todo" key in the state
	},
});

// Type definitions to enable TypeScript integration with Redux
export type RootState = ReturnType<typeof store.getState>; // Define RootState as the type of the entire Redux state tree
export type AppDispatch = typeof store.dispatch; // Define AppDispatch as the type for the dispatch function

export default store;
