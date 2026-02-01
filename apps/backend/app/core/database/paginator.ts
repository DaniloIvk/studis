import request from '../context/request';

type PrismaDelegate = {
  readonly count: (args?: object) => Promise<any>;
  readonly findMany: (args?: object) => Promise<any>;
};

type PaginatorProps = {
  readonly model: PrismaDelegate;
  readonly perPage?: number;
  readonly page?: number | undefined;
};

export type Paginator = {
  pagination: {
    total: number;
    perPage: number;
    pageCount: number;
    currentPage: number;
  };
  data: object[];
};

async function paginate({
  model,
  perPage = 10,
  page,
}: PaginatorProps): Promise<Paginator> {
  page = page || Number(request()?.query['page']) || 1;
  const currentPage = Math.max(Math.min(page, Number.MAX_VALUE), 1);
  const skip = (currentPage - 1) * perPage;
  const take = perPage;

  const total = await model.count();
  const data = await model.findMany({ skip, take });

  const pageCount = Math.ceil(total / perPage);

  return {
    pagination: {
      total,
      perPage,
      pageCount,
      currentPage,
    },
    data: data,
  };
}

export default paginate;
