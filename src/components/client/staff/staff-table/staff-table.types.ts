import { TablePaginationProps } from '@/components/common/table/table.types';
import { User } from '@store/client';

import { StaffTableView } from '../staff-filters/staff-filters.types';

export type StaffTableProps = {
    onRowClick: (id: number | string) => void;
    pageName: 'users' | 'administrators' | 'staff';
    view?: StaffTableView;
    fetchedUsers?: User[];
    disabled?: boolean;
};

export type StaffListProps = Pick<StaffTableProps, 'pageName' | 'onRowClick' | 'fetchedUsers' | 'disabled'> & { paginationProps: TablePaginationProps };
export type StaffTreeProps = Omit<StaffListProps, 'paginationProps'>;

export type UseStaffTableProps = Pick<StaffTableProps, 'onRowClick'>;
export type UseStaffListProps = Omit<StaffListProps, 'fetchedUsers' | 'paginationProps'>;
export type UseStaffTreeProps = UseStaffTableProps;
