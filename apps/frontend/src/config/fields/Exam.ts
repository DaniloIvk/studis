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
    header: 'Exam Period',
    accessor: (item) => item.examPeriod?.name || 'N/A'
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
    name: 'search',
    label: 'models.title',
    type: 'text' as const,
    className: 'col-span-12 sm:col-span-6',
  },
  {
    name: 'description',
    label: 'models.description',
    type: 'text' as const,
    className: 'col-span-12 sm:col-span-6',
  },
];