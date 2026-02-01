import { Prisma } from '../../../../../database/prisma/client';
import { QueryBuilder } from '../../../../core/database/builder/QueryBuilder';
import database from '../../../../core/database/database';
import Controller, {
  ControllerContract,
} from '../../../../core/http/Controller';
import ExamApplicationRequest from '../../../requests/examApplication/shared/ExamApplicationRequest';
import ExamApplicationResource from '../../../resources/ExamApplicationResource';

class ExamApplicationController extends Controller {
  public async index({ request, response }: ControllerContract) {
    const { pagination, data } = await new QueryBuilder<
      Prisma.ExamApplicationGetPayload<true>,
      Prisma.ExamApplicationWhereInput
    >(database.examApplication, request)
      .filterFromRequest('status')
      .filterFromRequest('grade')
      .filterDateRangeFromRequest('gradedAt', 'gradedAt')
      .sortFromRequest(['id', 'status', 'grade', 'gradedAt'])
      .paginate();

    response.json({
      pagination,
      data: ExamApplicationResource.collect(data),
    });
  }

  public async show({ response, examApplication }: ControllerContract) {
    response.json({
      data: ExamApplicationResource.make(examApplication),
    });
  }

  public async store({ response }: ControllerContract) {
    const request = await ExamApplicationRequest.validate();
    const examApplication = await database.examApplication.create({
      data: request.validated(),
    });

    response.json({
      message: request.t('common:responses.exam_application.created'),
      data: ExamApplicationResource.make(examApplication),
    });
  }

  public async update({ response, examApplication }: ControllerContract) {
    const request = await ExamApplicationRequest.validate();

    examApplication = await database.examApplication.update({
      where: {
        id: examApplication.id,
      },
      data: request.validated(),
    });

    response.json({
      message: request.t('common:responses.exam_application.updated'),
      data: ExamApplicationResource.make(examApplication),
    });
  }

  public async destroy({
    request,
    response,
    examApplication,
  }: ControllerContract) {
    await database.examApplication.delete({
      where: {
        id: examApplication.id,
      },
    });

    response.json({
      message: request.t('common:responses.exam_application.deleted'),
    });
  }
}

export default ExamApplicationController;
