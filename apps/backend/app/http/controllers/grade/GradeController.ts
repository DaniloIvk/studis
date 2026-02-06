import database from '../../../core/database/database';
import Controller, { ControllerContract } from '../../../core/http/Controller';
import CreateGradeRequest from '../../requests/grade/CreateGradeRequest';
import UpdateGradeRequest from '../../requests/grade/CreateGradeRequest';
import GradeResource from '../../resources/GradeResource';
import { currentUser } from '../../../core/helpers/currentUser';
import { CreateGradeData, UpdateGradeData } from '../../requests/grade/types';


class GradeController extends Controller {
  /**
   * GET /api/grades
   * List grades (students see only their own)
   */
  public async index({ request, response }: ControllerContract) {
    const user = currentUser();

    if (!user) {
      return response.status(401).json({ error: 'Authentication required' });
    }

    // Build where clause based on role
    const where: {
      studentId?: number;
    } = {};
    
    if (user.role === 'STUDENT') {
      where.studentId = user.id;
    }

    const grades = await database.grade.findMany({
      where,
      include: {
        student: true,
        exam: {
          include: {
            course: true
          }
        },
        createdBy: true
      },
      orderBy: { createdAt: 'desc' }
    });

    response.json({ data: GradeResource.collect(grades) });
  }

  /**
   * GET /api/grades/:id
   * Get single grade
   */
  public async show({ request, response }: ControllerContract) {
    const user = currentUser();
    const gradeId = Number(request.params.id);

    if (!user) {
      return response.status(401).json({ error: 'Authentication required' });
    }

    const grade = await database.grade.findUnique({
      where: { id: gradeId },
      include: {
        student: true,
        exam: {
          include: {
            course: true
          }
        },
        createdBy: true
      }
    });

    if (!grade) {
      return response.status(404).json({ error: 'Grade not found' });
    }

    // Students can only see their own grades
    if (user.role === 'STUDENT' && grade.studentId !== user.id) {
      return response.status(403).json({ error: 'Access denied' });
    }

    response.json({ data: GradeResource.make(grade) });
  }

  /**
   * POST /api/grades
   * Create new grade (professors and admins only)
   */
  public async store({ request, response }: ControllerContract) {
    const gradeRequest = await CreateGradeRequest.validate();
    const validated = gradeRequest.validated() as CreateGradeData;

    const grade = await database.grade.create({
      data: {
        studentId: validated.studentId,
        examId: validated.examId,
        value: validated.value,
        createdById: validated.createdById ?? null
      },
      include: {
        student: true,
        exam: {
          include: {
            course: true
          }
        },
        createdBy: true
      }
    });

    response.json({
      message: gradeRequest.t('common:responses.grade.created'),
      data: GradeResource.make(grade)
    });
  }

  /**
   * PATCH /api/grades/:id
   * Update grade
   */
  public async update({ request, response }: ControllerContract) {
    const gradeId = Number(request.params.id);
    const gradeRequest = await UpdateGradeRequest.validate();
    const validated = gradeRequest.validated() as UpdateGradeData;

    const updatedGrade = await database.grade.update({
      where: { id: gradeId },
      data: {
        value: validated.value
      },
      include: {
        student: true,
        exam: {
          include: {
            course: true
          }
        },
        createdBy: true
      }
    });

    response.json({
      message: gradeRequest.t('common:responses.grade.updated'),
      data: GradeResource.make(updatedGrade)
    });
  }

  /**
   * DELETE /api/grades/:id
   * Delete grade
   */
  public async destroy({ request, response }: ControllerContract) {
    const gradeId = Number(request.params.id);

    await database.grade.delete({ 
      where: { id: gradeId } 
    });

    response.json({
      message: request.t('common:responses.grade.deleted')
    });
  }
}

export default GradeController;