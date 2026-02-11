import { CreateExamData, UpdateExamData } from 'app/http/requests/exam/types';
import database from '../../../core/database/database';
import Controller, { ControllerContract } from '../../../core/http/Controller';
import CreateExamRequest from '../../requests/exam/CreateExamRequest';
import UpdateExamRequest from '../../requests/exam/UpdateExamRequest';
import ExamResource from '../../resources/ExamResource';

class ExamController extends Controller {
  /**
   * GET /api/exams
   * List all exams
   */
  public async index({ request, response }: ControllerContract) {
    const exams = await database.exam.findMany({
      include: {
        createdBy: true,
        course: true,
        examPeriod: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    response.json({ data: ExamResource.collect(exams) });
  }

  /**
   * GET /api/exams/:id
   * Get single exam
   */
public async show({ request, response }: ControllerContract) {
  const examId = Number(request.params.id || request.params.exam);
  
  if (!examId || isNaN(examId)) {
    return response.status(400).json({ error: 'Invalid exam ID' });
  }
  
  const exam = await database.exam.findUnique({
    where: { id: examId },
    include: {
      createdBy: true,
      course: true,
      examPeriod: true,
    }
  });

  if (!exam) {
    return response.status(404).json({ error: 'Exam not found' });
  }

  response.json({ data: ExamResource.make(exam) });
}

  /**
   * POST /api/exams
   * Create new exam
   */
public async store({ request, response }: ControllerContract) {
  const examRequest = await CreateExamRequest.validate();
  const validated = examRequest.validated() as CreateExamData;

  const exam = await database.exam.create({
    data: {
      courseId: validated.courseId,
      examPeriodId: validated.examPeriodId,
      title: validated.title,
      description: validated.description ?? '',
      date: validated.date,
      createdById: validated.createdById ?? null
    },
    include: {
      createdBy: true,
      course: true,
      examPeriod: true,
    }
  });

  response.json({
    message: examRequest.t('common:responses.exam.created'),
    data: ExamResource.make(exam)
  });
}

  /**
   * PATCH /api/exams/:id
   * Update exam
   */
  public async update({ request, response }: ControllerContract) {
  const examId = Number(request.params.id || request.params.exam);
  
  if (!examId || isNaN(examId)) {
    return response.status(400).json({ error: 'Invalid exam ID' });
  }

  const examRequest = await UpdateExamRequest.validate();
  const validated = examRequest.validated() as UpdateExamData;

  const updateData: Partial<{
    courseId: number;
    examPeriodId: number;
    title: string;
    description: string;
    date: Date;
  }> = {};
  
  if (validated.courseId !== undefined) updateData.courseId = validated.courseId;
  if (validated.examPeriodId !== undefined) updateData.examPeriodId = validated.examPeriodId;
  if (validated.title !== undefined) updateData.title = validated.title;
  if (validated.description !== undefined) updateData.description = validated.description;
  if (validated.date !== undefined) updateData.date = validated.date;

  const updatedExam = await database.exam.update({
    where: { id: examId },
    data: updateData,
    include: {
      createdBy: true,
      course: true,
      examPeriod: true,
    }
  });

  response.json({
    message: examRequest.t('common:responses.exam.updated'),
    data: ExamResource.make(updatedExam)
  });
}

  /**
   * DELETE /api/exams/:id
   * Delete exam
   */
public async destroy({ request, response }: ControllerContract) {
  const examId = Number(request.params.id || request.params.exam);
  
  if (!examId || isNaN(examId)) {
    return response.status(400).json({ error: 'Invalid exam ID' });
  }

  await database.exam.delete({ 
    where: { id: examId } 
  });

  response.json({
    message: request.t('common:responses.exam.deleted')
  });
}
}

export default ExamController;