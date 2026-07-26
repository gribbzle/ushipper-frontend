import React from 'react';
import ReactPaginate from 'react-paginate';

import { classname } from '@utils';

import ArrowIcon from './arrow.svg';

import './paginate.scss';

type Props = {
    page: number;
    lastPage: number;
    onChange: (page: number) => void;
};

const cn = classname('paginate');

export const Paginate = (props: Props) => {
    const { page, lastPage, onChange } = props;

    return (
        <ReactPaginate
            className={cn()}
            previousLabel={<ArrowIcon />}
            nextLabel={<ArrowIcon />}
            marginPagesDisplayed={1}
            forcePage={page - 1}
            pageCount={lastPage}
            onPageChange={({ selected }) => onChange(selected + 1)}
        />
    );
};
