import database from '../../../core/database/database';
import Controller, { ControllerContract } from '../../../core/http/Controller';
import { currentUser } from '../../../core/helpers/currentUser';

async function getActiveExamPeriod() {
	const now = new Date();
	return database.examPeriod.findFirst({
		where: { dateFrom: { lte: now }, dateTo: { gte: now } },
		select: { id: true, name: true, dateFrom: true, dateTo: true },
	});
}

async function adminStats(activeExamPeriod: any) {
	const [
		studentCount,
		professorCount,
		courseCount,
		gradeAgg,
		passedCount,
		totalApplications,
		grades,
	] = await Promise.all([
		database.user.count({ where: { role: 'STUDENT' } }),
		database.user.count({ where: { role: 'PROFESSOR' } }),
		database.course.count(),
		database.grade.aggregate({ _avg: { value: true } }),
		database.examApplication.count({ where: { status: 'PASSED' } }),
		database.examApplication.count({
			where: { status: { in: ['PASSED', 'FAILED'] } },
		}),
		database.grade.findMany({ select: { value: true } }),
	]);

	const passRate =
		totalApplications > 0 ?
			Math.round((passedCount / totalApplications) * 100)
		:	0;

	const distribution = [6, 7, 8, 9, 10].map(
		(grade) => grades.filter((g) => Math.round(g.value) === grade).length,
	);

	return {
		role: 'ADMIN',
		activeExamPeriod,
		stats: {
			totalStudents: studentCount,
			totalProfessors: professorCount,
			totalCourses: courseCount,
			averageGrade:
				gradeAgg._avg.value ? Number(gradeAgg._avg.value.toFixed(2)) : 0,
			examPassRate: passRate,
		},
		chart: { labels: ['6', '7', '8', '9', '10'], data: distribution },
	};
}

async function professorStats(professorId: number, activeExamPeriod: any) {
	const [myCourseCount, studentCount, grades, upcomingExamCount] =
		await Promise.all([
			database.course.count({ where: { professorId } }),
			database.enrollments.count({ where: { course: { professorId } } }),
			database.grade.findMany({
				where: { exam: { course: { professorId } } },
				select: { value: true },
			}),
			database.exam.count({
				where: { course: { professorId }, date: { gt: new Date() } },
			}),
		]);

	const avgGrade =
		grades.length > 0 ?
			Number(
				(grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(
					2,
				),
			)
		:	0;

	const distribution = [6, 7, 8, 9, 10].map(
		(grade) => grades.filter((g) => Math.round(g.value) === grade).length,
	);

	return {
		role: 'PROFESSOR',
		activeExamPeriod,
		stats: {
			myCourses: myCourseCount,
			studentsInMyCourses: studentCount,
			averageGrade: avgGrade,
			upcomingExams: upcomingExamCount,
		},
		chart: { labels: ['6', '7', '8', '9', '10'], data: distribution },
	};
}

async function studentStats(studentId: number, activeExamPeriod: any) {
	const [enrolledCount, passedCount, appliedCount, grades] = await Promise.all([
		database.enrollments.count({ where: { studentId } }),
		database.examApplication.count({ where: { studentId, status: 'PASSED' } }),
		database.examApplication.count({ where: { studentId, status: 'APPLIED' } }),
		database.grade.findMany({
			where: { studentId },
			select: {
				value: true,
				exam: { select: { course: { select: { name: true } } } },
			},
		}),
	]);

	const avgGrade =
		grades.length > 0 ?
			Number(
				(grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(
					2,
				),
			)
		:	0;

	return {
		role: 'STUDENT',
		activeExamPeriod,
		stats: {
			enrolledCourses: enrolledCount,
			passedExams: passedCount,
			averageGrade: avgGrade,
			pendingApplications: appliedCount,
		},
		chart: {
			labels: grades.map((g) => g.exam.course.name),
			data: grades.map((g) => g.value),
		},
	};
}

class DashboardController extends Controller {
	public async index({ response }: ControllerContract) {
		const user = currentUser();

		if (!user) {
			return response.status(401).json({ error: 'Authentication required' });
		}

		const activeExamPeriod = await getActiveExamPeriod();

		switch (user.role) {
			case 'ADMIN':
				return response.json({ data: await adminStats(activeExamPeriod) });
			case 'PROFESSOR':
				return response.json({
					data: await professorStats(user.id, activeExamPeriod),
				});
			case 'STUDENT':
				return response.json({
					data: await studentStats(user.id, activeExamPeriod),
				});
			default:
				return response.status(403).json({ error: 'Unknown role' });
		}
	}
}

export default DashboardController;
