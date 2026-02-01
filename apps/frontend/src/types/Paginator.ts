export type Pagination = {
  readonly total: number;
  readonly perPage: number;
  readonly pageCount: number;
  readonly currentPage: number;
};

export type PaginatorData<T extends Record<string, any> = object> = {
  readonly pagination: Pagination;
  readonly data: T[];
};

export type PageNumber = {
  readonly pageNumber: number;
  readonly onClick: (...args: any[]) => any;
};

export type MorePages = {
  readonly fromPage: number;
  readonly toPage: number;
  readonly onClick: (...args: any[]) => any;
};

export type PaginatorConfig = {
  readonly buttonCount: number;
  readonly firstEllipsis: Omit<MorePages, 'onClick'>;
  readonly secondEllipsis: Omit<MorePages, 'onClick'>;
  readonly hasFirstEllipsis: boolean;
  readonly hasSecondEllipsis: boolean;
};
