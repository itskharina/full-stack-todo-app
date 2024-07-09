// SidebarContext.js
import React, { createContext, useContext, useState } from 'react';

// Define a type for the context value
interface SidebarContextType {
	sidebar: boolean;
	toggleSidebar: () => void;
}

// Provide a default value for the context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
	const [sidebar, setSidebar] = useState(false);

	const toggleSidebar = () => setSidebar(!sidebar);

	return (
		<SidebarContext.Provider value={{ sidebar, toggleSidebar }}>
			{children}
		</SidebarContext.Provider>
	);
};