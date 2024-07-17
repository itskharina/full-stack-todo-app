import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Today from './routes/Today';
import Upcoming from './routes/Upcoming';
import Week from './routes/Week';
import App from './App';
import Project from './routes/Project';
import { Provider } from 'react-redux';
import store from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SidebarProvider } from './components/Sidebar/SidebarProvider';

const router = createBrowserRouter([
	{
		element: <App />,
		children: [
			{
				path: '/',
				element: <Upcoming />,
			},
			{
				path: 'today',
				element: <Today />,
			},
			{
				path: 'week',
				element: <Week />,
			},
			{
				path: 'projects/:projectName',
				element: <Project />,
			},
		],
	},
]);

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<SidebarProvider>
			<RouterProvider router={router} />
		</SidebarProvider>
	</Provider>
);
