import Icons from '../common/Icons';
import { type SidebarItem } from '../types/Sidebar';
import Role from '../enums/Role';
import AboutUs from '../pages/AboutUs';
import Courses from '../pages/Course';
import CourseMaterial from '../pages/CourseMaterial';
import Users from '../pages/Users';
import ExamPeriods from '../pages/ExamPeriods';
import Announcement from '../pages/Announcement';
import MyProfile from '../pages/MyProfile';
import Exams from '../pages/Exams';
import Grades from '../pages/Grades';
import Dashboard from '../pages/Dashboard';

const SidebarRoutes: SidebarItem[] = [
	{
		path: 'dashboard',
		label: 'dashboard',
		icon: Icons.Dashboard,
		role: Role.cases, // Available to all roles
		component: Dashboard,
	},
	{
		path: 'my-profile',
		label: 'my_profile',
		icon: Icons.PersonBook,
		role: Role.cases, // Available to all roles
		component: MyProfile,
	},
	{
		path: 'users',
		label: 'users',
		icon: Icons.PersonBook,
		role: Role.ADMIN, // Only admin
		component: Users,
	},
	{
		path: 'courses',
		label: 'courses',
		icon: Icons.Book,
		role: Role.cases, // Available to all
		component: Courses,
	},
	{
		path: 'exams',
		label: 'exams',
		icon: Icons.Assignment,
		role: Role.cases, // Available to all
		component: Exams,
	},
	{
		path: 'exam-periods',
		label: 'exam_periods',
		icon: Icons.Calendar,
		role: Role.cases,
		component: ExamPeriods,
	},
	{
		path: 'grades',
		label: 'grades',
		icon: Icons.Grading,
		role: Role.cases, // Available to all
		component: Grades,
	},
	{
		path: 'materials',
		label: 'materials',
		icon: Icons.Dictionary,
		role: Role.cases,
		component: CourseMaterial,
	},
	{
		path: 'announcement',
		label: 'announcement',
		icon: Icons.Notifications,
		role: Role.cases,
		component: Announcement,
	},
	{
		path: 'about',
		label: 'about_us',
		icon: Icons.Info,
		role: Role.cases,
		component: AboutUs,
	},
];

export default SidebarRoutes;