import type { TableColumn } from '../../types/Table';

export const tableColumns: TableColumn[] = [
  {
    header: 'Title',
    accessor: 'title',
  },
  {
    header: 'Course',
    accessor: (item) => item.course?.name || 'N/A',
  },
  {
    header: 'Date',
    accessor: (item) => new Date(item.createdAt).toLocaleDateString(),
  },
  {
    header: 'Created By',
    accessor: (item) => 
      item.createdBy 
        ? `${item.createdBy.firstName} ${item.createdBy.lastName}` 
        : 'N/A',
  },
];

export const tableColumnsStudent: TableColumn[] = [
  {
    header: 'Title',
    accessor: 'title',
  },
  {
    header: 'Course',
    accessor: (item) => item.course?.name || 'N/A',
  },
  {
    header: 'Date',
    accessor: (item) => new Date(item.date).toLocaleString(),
  },
];

export const searchFields = [
  {
    name: 'title',
    label: 'Title',
    type: 'text' as const,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text' as const,
  },
];