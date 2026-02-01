import { Prisma } from '../../../../../database/prisma/client';
import { QueryBuilder } from '../../../../core/database/builder/QueryBuilder';
import database from '../../../../core/database/database';
import Controller, {
  ControllerContract,
} from '../../../../core/http/Controller';
import ExamPeriodRequest from '../../../requests/examPeriod/shared/ExamPeriodRequest';
import ExamPeriodResource from '../../../resources/ExamPeriodResource';

class ExamPeriodController extends Controller {
  public async index({ request, response }: ControllerContract) {
    const { pagination, data } = await new QueryBuilder<
      Prisma.ExamPeriodGetPayload<true>,
      Prisma.ExamPeriodWhereInput
    >(database.examPeriod, request)
      .search(['name'])
      .filterFromRequest('dateFrom', undefined, '>=')
      .filterDateRangeFromRequest('dateFrom', 'dateTo')
      .sortFromRequest(['id', 'name', 'dateFrom', 'dateTo'])
      .paginate();

    response.json({
      pagination,
      data: ExamPeriodResource.collect(data),
    });
  }

  public async show({ response, examPeriod }: ControllerContract) {
    response.json({
      data: ExamPeriodResource.make(examPeriod),
    });
  }

  public async store({ response }: ControllerContract) {
    const request = await ExamPeriodRequest.validate();
    const examPeriod = await database.examPeriod.create({
      data: request.validated(),
    });

    response.json({
      message: request.t('common:responses.exam_period.created'),
      data: ExamPeriodResource.make(examPeriod),
    });
  }

  public async update({ response, examPeriod }: ControllerContract) {
    const request = await ExamPeriodRequest.validate();

    examPeriod = await database.examPeriod.update({
      where: {
        id: examPeriod.id,
      },
      data: request.validated(),
    });

    response.json({
      message: request.t('common:responses.exam_period.updated'),
      data: ExamPeriodResource.make(examPeriod),
    });
  }

  public async destroy({ request, response, examPeriod }: ControllerContract) {
    await database.examPeriod.delete({
      where: {
        id: examPeriod.id,
      },
    });

    response.json({
      message: request.t('common:responses.exam_period.deleted'),
    });
  }
}

export default ExamPeriodController;
