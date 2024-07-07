import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Today from './routes/Today';
import Upcoming from './routes/Upcoming';
import Week from './routes/Week';
import App from './App';
import Work from './routes/Work';

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
				path: 'work',
				element: <Work />,
			},
		],
	},
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
