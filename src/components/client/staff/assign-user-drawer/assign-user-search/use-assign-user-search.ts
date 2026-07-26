import { useCallback } from 'react';

import { AssignUserSearchProps, AssignUserSearchState } from './assign-user-search.types';

export const useAssignUserSearch = ({ onChange }: AssignUserSearchProps) => {
    const onChangeHandler = useCallback(
        ({ name }: AssignUserSearchState) => {
            onChange(name);
        },
        [onChange],
    );

    return {
        onChangeHandler,
    };
};
