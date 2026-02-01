import express from 'express';
import appConfig from '../config/app';
import AnnouncementController from '../app/http/controllers/announcement/shared/AnnouncementController';
import CourseMaterialController from '../app/http/controllers/courseMaterial/shared/CourseMaterialController';
import CourseController from '../app/http/controllers/course/shared/CourseController';
import ExamApplicationController from '../app/http/controllers/examApplication/shared/ExamApplicationController';
import ExamPeriodController from '../app/http/controllers/examPeriod/shared/ExamPeriodController';
import UserController from '../app/http/controllers/user/admin/UserController';
import Router from '../app/core/routing/Router';
import database from '../app/core/database/database';
import multer from 'multer';
import multerConfig from '../config/multer';

const apiRouter = new Router();

apiRouter.get('/', (_: express.Request, response: express.Response) => {
	response.json({ message: appConfig.appName });
});

apiRouter.apiResource('/announcements', AnnouncementController, {
	resolveIdAs: database.announcements,
});

apiRouter
	.middleware(multer(multerConfig).any())
	.apiResource('/course-materials', CourseMaterialController, {
		resolveIdAs: database.courseMaterial,
	});

apiRouter.get('/courses/all', [CourseController, 'getAll']);
apiRouter.apiResource('/courses', CourseController, {
	resolveIdAs: database.course,
});

apiRouter.apiResource('/exam-applications', ExamApplicationController, {
	resolveIdAs: database.examApplication,
});

apiRouter.apiResource('/exam-periods', ExamPeriodController, {
	resolveIdAs: database.examPeriod,
});

apiRouter.get('/users/all', [UserController, 'getAll']);
apiRouter.apiResource('/users', UserController, { resolveIdAs: database.user });

export default apiRouter.getRouter();
