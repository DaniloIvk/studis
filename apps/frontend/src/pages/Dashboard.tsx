import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../core/context/AuthContext';
import DashboardService from '../services/DashboardService';
import type { DashboardStats } from '../services/DashboardService';
import '../config/chartjs';
import BarChart from '../components/charts/BarChart';

function Dashboard() {
	const { user, loading: authLoading } = useAuth();
	const { t } = useTranslation();
	const [data, setData] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading && user) {
			DashboardService.getStats()
				.then((res) => setData(res.data))
				.catch((err) => console.error('Failed to fetch dashboard stats', err))
				.finally(() => setLoading(false));
		}
	}, [authLoading, user]);

	if (authLoading || loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50!">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600! mb-4"></div>
				<div className="text-gray-600! font-medium">
					{t('dashboard_page.loading')}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full p-6 md:p-8 overflow-y-auto bg-gray-50! dark:bg-gray-950! transition-colors duration-300">
			<div className="max-w-6xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-extrabold text-gray-900! dark:text-white! tracking-tight">
						{t('dashboard_page.title')}
					</h1>
					<p className="text-gray-500! dark:text-gray-400! mt-1">
						{t('dashboard_page.subtitle')}
					</p>
				</div>

				{data && <StatCards role={data.role} stats={data.stats} t={t} />}

				{data && data.chart.labels.length > 0 && (
					<div className="bg-white! dark:bg-gray-900! rounded-2xl! shadow-sm! border! border-gray-100! dark:border-gray-800! p-6 mt-6">
						<BarChart
							title={t(`dashboard_page.chart_${data.role.toLowerCase()}`)}
							labels={data.chart.labels}
							data={data.chart.data}
						/>
					</div>
				)}

				<div className="bg-white! dark:bg-gray-900! rounded-2xl! shadow-sm! border! border-gray-100! dark:border-gray-800! overflow-hidden mt-6">
					<div className="p-8">
						<div className="flex items-center mb-4">
							<div className="w-2 h-8 bg-indigo-600! rounded-full! mr-4"></div>
							<h2 className="text-2xl! font-bold text-gray-800! dark:text-white!">
								{t('dashboard_page.welcome')}, {user?.firstName}!
							</h2>
						</div>

						<p className="text-gray-600! dark:text-gray-400! text-lg mb-6">
							{t('dashboard_page.logged_in_as')}:{' '}
							<span className="font-semibold text-indigo-600! dark:text-indigo-400!">
								{user?.firstName} {user?.lastName}
							</span>
							<span className="mx-2 text-gray-300! dark:text-gray-700!">|</span>
							{t('dashboard_page.role')}:{' '}
							<span className="px-3 py-1 bg-gray-100! dark:bg-gray-800! rounded-full! text-sm font-medium">
								{user?.role}
							</span>
						</p>

						<div className="p-5 bg-indigo-50! dark:bg-indigo-900/30! rounded-xl! border! border-indigo-100! dark:border-indigo-900/50!">
							<div className="flex items-start">
								<p className="text-sm text-indigo-900! dark:text-indigo-200! leading-relaxed">
									{t('dashboard_page.tip')}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

interface StatCardsProps {
	role: string;
	stats: Record<string, number>;
	t: (key: string) => string;
}

function StatCards({ role, stats, t }: StatCardsProps) {
	const configs: Record<string, { key: string; color: StatCardProps['color'] }[]> = {
		ADMIN: [
			{ key: 'totalStudents', color: 'blue' },
			{ key: 'totalProfessors', color: 'purple' },
			{ key: 'totalCourses', color: 'green' },
			{ key: 'averageGrade', color: 'yellow' },
			{ key: 'examPassRate', color: 'indigo' },
		],
		PROFESSOR: [
			{ key: 'myCourses', color: 'blue' },
			{ key: 'studentsInMyCourses', color: 'green' },
			{ key: 'averageGrade', color: 'yellow' },
			{ key: 'upcomingExams', color: 'purple' },
		],
		STUDENT: [
			{ key: 'enrolledCourses', color: 'blue' },
			{ key: 'passedExams', color: 'green' },
			{ key: 'averageGrade', color: 'yellow' },
			{ key: 'pendingApplications', color: 'purple' },
		],
	};

	const cards = configs[role] ?? [];
	const gridCols = cards.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4';

	return (
		<div className={`grid grid-cols-2 ${gridCols} gap-6`}>
			{cards.map(({ key, color }) => (
				<StatCard
					key={key}
					title={t(`dashboard_page.${key}`)}
					value={key === 'examPassRate' ? `${stats[key]}%` : stats[key]}
					color={color}
				/>
			))}
		</div>
	);
}

interface StatCardProps {
	title: string;
	value: number | string;
	color: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo';
}

function StatCard({ title, value, color }: StatCardProps) {
	const themes: Record<string, string> = {
		blue: 'from-blue-500! to-blue-600!',
		green: 'from-green-500! to-green-600!',
		purple: 'from-purple-500! to-purple-600!',
		yellow: 'from-yellow-400! to-yellow-500!',
		indigo: 'from-indigo-500! to-indigo-600!',
	};

	return (
		<div className="bg-white! dark:bg-gray-900! rounded-2xl! shadow-lg! p-6! border! border-gray-100! dark:border-gray-800! transition-transform! hover:scale-[1.02]!">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-xs font-bold text-gray-400! dark:text-gray-500! uppercase! tracking-widest! mb-1">
						{title}
					</p>
					<h3 className="text-3xl font-black! text-gray-800! dark:text-white!">
						{value}
					</h3>
				</div>
				<div
					className={`w-14 h-14 bg-gradient-to-br! ${themes[color]} rounded-2xl! flex! items-center! justify-center! shadow-inner!`}
				/>
			</div>
		</div>
	);
}

export default Dashboard;
