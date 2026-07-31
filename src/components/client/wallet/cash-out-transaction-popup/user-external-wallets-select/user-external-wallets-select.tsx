import React from 'react';

import { AsyncSelectField, SelectField } from '@fields';

import { useUserExternalWalletsSelect } from './use-user-external-wallets-select';
import { UserExternalWalletsSelectProps } from './user-external-wallets-select.types';

export const UserExternalWalletsSelect = ({ input, meta, accountId, ...rest }: UserExternalWalletsSelectProps) => {
    const { selectReady, errored, key, onChangeHandler, defaultSelectedOption, loadOptions } = useUserExternalWalletsSelect({
        input,
        meta,
        accountId,
    });

    // TODO crutch to remove blinking until the value for AsyncSelectField is loaded
    if (!selectReady) {
        return <SelectField meta={meta} input={input} placeholder='' {...rest} />;
    }

    return (
        <>
            {selectReady && (
                <AsyncSelectField
                    {...rest}
                    key={key}
                    onChange={onChangeHandler}
                    defaultOptions={true}
                    defaultValue={defaultSelectedOption}
                    loadOptions={loadOptions}
                    isSearchable={true}
                    isMulti={false}
                    isClearable={true}
                    cacheOptions={true}
                    closeMenuOnSelect={true}
                    onBlur={event => input.onBlur(event)}
                    errored={errored}
                    errorText={meta.error || meta.submitError}
                />
            )}
        </>
    );
};
