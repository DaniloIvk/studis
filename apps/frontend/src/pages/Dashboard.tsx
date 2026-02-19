import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../core/context/AuthContext';
import DashboardService, {
	type DashboardStats,
} from '../services/DashboardService';
import InfoCard from '../components/common/InfoCard';
import BarChart from '../components/charts/BarChart';
import Icons from '../common/Icons';
import type { ThemeColor } from '../types/Common';
import '../config/chartjs';

function Dashboard() {
	const { user, loading: authLoading } = useAuth();
	const { t } = useTranslation();
	const [data, setData] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading && user) {
			DashboardService.getStats()
				.then((res) => setData(res.data))
				.catch((err) => console.error(err))
				.finally(() => setLoading(false));
		}
	}, [authLoading, user]);

	if (authLoading || loading) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen bg-light! dark:bg-dark!'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary! mb-4'></div>
				<div className='text-neutral-dark! font-medium'>
					{t('dashboard_page.loading')}
				</div>
			</div>
		);
	}

	if (!data) return null;

	return (
		<div className='w-full h-full p-6 md:p-8 overflow-y-auto bg-light! dark:bg-dark! transition-colors duration-300'>
			<div className='max-w-6xl mx-auto flex flex-col gap-8'>
				<div
					className='flex items-center gap-4 animate-fade-in-left opacity-0'
					style={{ animationFillMode: 'forwards' }}
				>
					<div className='w-16 h-16 bg-primary/10 text-primary! rounded-full flex items-center justify-center'>
						<Icons.Dashboard className='w-8 h-8' />
					</div>
					<div>
						<h1 className='text-3xl font-extrabold text-dark! dark:text-light! tracking-tight'>
							{t('dashboard_page.title')}
						</h1>
						<p className='text-neutral-dark! mt-1 font-medium'>
							{t('dashboard_page.subtitle')}
						</p>
					</div>
				</div>

				<div
					className='animate-fade-in-up opacity-0'
					style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
				>
					{data.activeExamPeriod ?
						<div className='bg-success/10 border-2 border-success border-b-[6px] rounded-3xl p-6 flex items-center gap-4'>
							<div className='text-success-dark! dark:text-success!'>
								<Icons.Calendar className='w-10 h-10' />
							</div>
							<div>
								<h3 className='text-lg font-bold text-success-dark! dark:text-success!'>
									{t('dashboard_page.active_period')}{' '}
									{data.activeExamPeriod.name}
								</h3>
								<p className='text-sm opacity-80 font-medium text-success-dark! dark:text-success!'>
									{new Date(
										data.activeExamPeriod.dateFrom,
									).toLocaleDateString()}{' '}
									-{' '}
									{new Date(data.activeExamPeriod.dateTo).toLocaleDateString()}
								</p>
							</div>
						</div>
					:	<div className='bg-neutral/10 border-2 border-neutral border-b-[6px] rounded-3xl p-6 flex items-center gap-4'>
							<div className='text-neutral-dark! dark:text-neutral!'>
								<Icons.Info className='w-10 h-10' />
							</div>
							<h3 className='text-lg font-bold opacity-80 text-dark! dark:text-light!'>
								{t('dashboard_page.no_active_period')}
							</h3>
						</div>
					}
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{data.role === 'ADMIN' && (
						<>
							<StatCard
								theme='primary'
								icon={<Icons.PersonBook className='w-12 h-12' />}
								title={t('dashboard_page.admin.totalStudents')}
								value={data.stats.totalStudents}
								delay={0.2}
							/>
							<StatCard
								theme='warn'
								icon={<Icons.Dashboard className='w-12 h-12' />}
								title={t('dashboard_page.admin.totalProfessors')}
								value={data.stats.totalProfessors}
								delay={0.3}
							/>
							<StatCard
								theme='success'
								icon={<Icons.Book className='w-12 h-12' />}
								title={t('dashboard_page.admin.totalCourses')}
								value={data.stats.totalCourses}
								delay={0.4}
							/>
							<StatCard
								theme='primary'
								icon={<Icons.Grading className='w-12 h-12' />}
								title={t('dashboard_page.admin.averageGrade')}
								value={data.stats.averageGrade}
								delay={0.5}
							/>
							<StatCard
								theme='success'
								icon={<Icons.AssignmentTurned className='w-12 h-12' />}
								title={t('dashboard_page.admin.examPassRate')}
								value={`${data.stats.examPassRate}%`}
								delay={0.6}
							/>
						</>
					)}

					{data.role === 'PROFESSOR' && (
						<>
							<StatCard
								theme='primary'
								icon={<Icons.Book className='w-12 h-12' />}
								title={t('dashboard_page.professor.myCourses')}
								value={data.stats.myCourses}
								delay={0.2}
							/>
							<StatCard
								theme='warn'
								icon={<Icons.PersonBook className='w-12 h-12' />}
								title={t('dashboard_page.professor.studentsInMyCourses')}
								value={data.stats.studentsInMyCourses}
								delay={0.3}
							/>
							<StatCard
								theme='success'
								icon={<Icons.Grading className='w-12 h-12' />}
								title={t('dashboard_page.professor.averageGrade')}
								value={data.stats.averageGrade}
								delay={0.4}
							/>
							<StatCard
								theme='error'
								icon={<Icons.AssignmentLate className='w-12 h-12' />}
								title={t('dashboard_page.professor.upcomingExams')}
								value={data.stats.upcomingExams}
								delay={0.5}
							/>
						</>
					)}

					{data.role === 'STUDENT' && (
						<>
							<StatCard
								theme='primary'
								icon={<Icons.Book className='w-12 h-12' />}
								title={t('dashboard_page.student.enrolledCourses')}
								value={data.stats.enrolledCourses}
								delay={0.2}
							/>
							<StatCard
								theme='success'
								icon={<Icons.AssignmentTurned className='w-12 h-12' />}
								title={t('dashboard_page.student.passedExams')}
								value={data.stats.passedExams}
								delay={0.3}
							/>
							<StatCard
								theme='warn'
								icon={<Icons.Grading className='w-12 h-12' />}
								title={t('dashboard_page.student.averageGrade')}
								value={data.stats.averageGrade}
								delay={0.4}
							/>
							<StatCard
								theme='neutral'
								icon={<Icons.Assignment className='w-12 h-12' />}
								title={t('dashboard_page.student.pendingApplications')}
								value={data.stats.pendingApplications}
								delay={0.5}
							/>
						</>
					)}
				</div>

				{data.chart.labels.length > 0 && (
					<div
						className='bg-light! dark:bg-darker! rounded-3xl border-2 border-b-[6px] border-light-gray! dark:border-dark p-6 shadow-sm animate-fade-in-up opacity-0'
						style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
					>
						<BarChart
							title={t(`dashboard_page.chart_${data.role.toLowerCase()}`)}
							labels={data.chart.labels}
							data={data.chart.data}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

function StatCard({
	theme,
	icon,
	title,
	value,
	delay,
}: {
	theme: ThemeColor;
	icon: React.ReactNode;
	title: string;
	value: string | number;
	delay: number;
}) {
	return (
		<div
			className='animate-fade-in-up opacity-0'
			style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
		>
			<InfoCard theme={theme}>
				<div className='mb-4'>{icon}</div>
				<h2 className='text-4xl font-extrabold mb-2'>{value}</h2>
				<p className='text-sm opacity-90 font-medium'>{title}</p>
			</InfoCard>
		</div>
	);
}

export default Dashboard;
