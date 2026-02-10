import type { TableColumn } from '../../types/Table';

export const tableColumns: TableColumn[] = [
  {
    header: 'Student',
    accessor: (item) => 
      item.student 
        ? `${item.student.firstName} ${item.student.lastName}` 
        : 'N/A',
  },
  {
    header: 'Exam',
    accessor: (item) => item.exam?.title || 'N/A',
  },
  {
    header: 'Course',
    accessor: (item) => item.exam?.course?.name || 'N/A',
  },
  {
    header: 'Grade',
    accessor: (item) => {
      const value = item.value;
      const colorClass = 
        value >= 9 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
        value >= 7 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
        value >= 6 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      
      // return `<span class="px-2 py-1 rounded ${colorClass}">${value}</span>`;
      return value;
    },
  },
  {
    header: 'Date',
    accessor: (item) => new Date(item.createdAt).toLocaleDateString(),
  },
];

// For students: hide student column
export const tableColumnsStudent: TableColumn[] = [
  {
    header: 'Exam',
    accessor: (item) => item.exam?.title || 'N/A',
  },
  {
    header: 'Course',
    accessor: (item) => item.exam?.course?.name || 'N/A',
  },
  {
    header: 'Grade',
    accessor: (item) => {
      const value = item.value;
      const colorClass = 
        value >= 9 ? 'bg-green-100 text-green-800' :
        value >= 7 ? 'bg-blue-100 text-blue-800' :
        value >= 6 ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800';
      
      //return `<span class="px-2 py-1 rounded ${colorClass}">${value}</span>`;
      return value;
    },
  },
  {
    header: 'Date',
    accessor: (item) => new Date(item.createdAt).toLocaleDateString(),
  },
];

export const searchFields = [
  {
    name: 'student.firstName',
    label: 'Student Name',
    type: 'text' as const,
  },
  {
    name: 'exam.title',
    label: 'Exam',
    type: 'text' as const,
  },
];