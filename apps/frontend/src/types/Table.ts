import type { FunctionComponent, ReactElement, SVGProps } from 'react';
import type { PaginatorData, FormFieldContract, Pagination } from './Common';

export type ActionProps = {
  readonly name?: string;
  readonly icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  readonly action: (...args: any[]) => any;
  readonly iconClassName?: string;
};

export type Action = (item: ItemProps, index: number) => any;

export type ActionContract = {
  readonly name?: string;
  readonly icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  readonly action: Action;
  readonly iconClassName?: string;
};

export type ItemProps = {
  readonly [key: string]: any;
  readonly showEditAction?: boolean;
  readonly showRemoveAction?: boolean;
  readonly actions?: readonly ActionContract[];
};

export type TableColumn<T extends ItemProps = ItemProps> = {
  readonly header: string;
  readonly accessor:
    | string
    | string[]
    | ((item: T, rowNumber: number) => string | ReactElement);
  readonly cardViewOnly?: boolean;
};

export type TableProps = {
  readonly data: readonly ItemProps[] | PaginatorData<any>;
  readonly columns: readonly TableColumn<any>[];
  readonly filters?: readonly FormFieldContract[];
  readonly defaultFilters?: Record<string, number | string>;
  readonly showRowNumbers?: boolean;
  readonly showIdColumn?: boolean;
  readonly showActions?: boolean;
  readonly showPaginator?: boolean;
  readonly syncRowNumbersWithPaginator?: boolean;
  readonly onAdd?: () => any;
  readonly onEditAction?: Action;
  readonly onRemoveAction?: Action;
  readonly actions?: readonly ActionContract[];
};

export type TableConfig = {
  readonly _data: ItemProps[];
  readonly _pagination: Pagination | null;
};
