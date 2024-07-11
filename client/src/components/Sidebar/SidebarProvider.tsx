import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
	sidebar: boolean;
	toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
	sidebar: false,
	toggleSidebar: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
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
