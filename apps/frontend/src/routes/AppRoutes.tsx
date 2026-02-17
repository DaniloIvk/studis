import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import AboutUs from '../pages/AboutUs';
import AuthGuard from './AuthGuard';
import PageSkeleton from '../components/PageSkeleton';
import SidebarRoutes from '../config/SidebarRoutes';
import { isSidebarButton } from '../types/Sidebar';
import Dashboard from '../pages/Dashboard';
import Homepage from '../pages/Homepage';

function AppRoutes() {
	const sidebarRoutes = SidebarRoutes.filter((route) => isSidebarButton(route));

	return (
		<Routes>
			<Route element={<AuthGuard isPublic={true} />}>
				<Route
					path='/'
					element={<Homepage />}
				/>
				<Route
					path='/login'
					element={<Login />}
				/>
				<Route
					path='/about'
					element={<AboutUs />}
				/>
			</Route>

			<Route element={<AuthGuard />}>
				<Route element={<PageSkeleton />}>
					{sidebarRoutes.map((route) => (
						<Route
							path={route.path}
							element={route.component()}
						/>
					))}
					<Route
						path='*'
						element={<Dashboard />}
					/>
				</Route>
			</Route>

			<Route
				path='*'
				element={<NotFound />}
			/>
		</Routes>
	);
}

export default AppRoutes;
