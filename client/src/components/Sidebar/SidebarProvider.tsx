import React, { createContext, useContext, useState } from 'react';

// Context provider for managing sidebar state
interface SidebarContextType {
	sidebar: boolean;
	toggleSidebar: () => void;
}

// Create context with default values (holds data you want to share)
const SidebarContext = createContext<SidebarContextType>({
	sidebar: false, // Sidebar is hidden by default
	toggleSidebar: () => {}, // Initially an empty function
});

// Custom hook for accessing sidebar context
// This custom hook, `useSidebar`, allows any component in the tree to easily access the context.
// By using `useContext(SidebarContext)`, we can get both `sidebar` (state) and `toggleSidebar` (function).
// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => useContext(SidebarContext);

// Provider component that wraps the app to provide sidebar state
// `SidebarProvider` will make the sidebar context available to any child components that need it
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
	// State for sidebar visibility
	const [sidebar, setSidebar] = useState(false);

	// Toggle function that updates the sidebar state
	const toggleSidebar = () => setSidebar(!sidebar);

	// The `SidebarContext.Provider` wraps the children components and provides the context value
	// This ensures that all child components have access to the `sidebar` state and `toggleSidebar` function.
	return (
		<SidebarContext.Provider value={{ sidebar, toggleSidebar }}>
			{children}
		</SidebarContext.Provider>
	);
};
