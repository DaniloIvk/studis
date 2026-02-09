import type { Announcements as AnnouncementsType } from './types.ts';
import type { Code as CodeType } from './types.ts';
import type { Course as CourseType } from './types.ts';
import type { CourseMaterial as CourseMaterialType } from './types.ts';
import type { Enrollments as EnrollmentsType } from './types.ts';
import type { ExamApplication as ExamApplicationType } from './types.ts';
import type { ExamPeriod as ExamPeriodType } from './types.ts';
import type { PersonalAccessToken as PersonalAccessTokenType } from './types.ts';
import type { User as UserType } from './types.ts';
import type { Exam as ExamType } from './types.ts';
import type { Grade as GradeType } from './types.ts';

type ModelType<Model extends { id: any }> = Partial<Omit<Model, 'id'>> & {
  readonly id: string | number;
};

type Announcements = ModelType<AnnouncementsType>;
type Code = ModelType<CodeType>;
type Course = ModelType<CourseType>;
type CourseMaterial = ModelType<CourseMaterialType>;
type Enrollments = ModelType<EnrollmentsType>;
type ExamApplication = ModelType<ExamApplicationType>;
type ExamPeriod = ModelType<ExamPeriodType>;
type PersonalAccessToken = ModelType<PersonalAccessTokenType>;
type User = ModelType<UserType>;
type Exam = ModelType<ExamType>;
type Grade = ModelType<GradeType>

export {
  type Announcements,
  type Code,
  type Course,
  type CourseMaterial,
  type Enrollments,
  type ExamApplication,
  type ExamPeriod,
  type PersonalAccessToken,
  type User,
  type Exam,
  type Grade,
};
