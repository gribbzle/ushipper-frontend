import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { SavedLoadboardSearch } from '@/api/loadboard';
import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Popup } from '@/components/common/popup/popup';
import Select from '@/components/common/select-new/select';
import { SelectOption } from '@/shared';
import { FormControl, InputLabel } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import { createLoadboardSearch, updateLoadboardSearch } from '@store/client/loadboard/actions';
import { loadboardListSelector } from '@store/client/loadboard/selectors';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './loadboard-save-search-popup.scss';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

enum SaveOptionsEnum {
    CREATE,
    UPDATE,
}

const cn = classname('loadboard-save-search-popup');
const t = translateByNamespace('client:loadboard-filters');

export const LoadboardSaveSearchPopup = (props: Props) => {
    const { isOpen, onClose } = props;
    const { filters } = useAppSelector(loadboardListSelector);
    const [saveOption, setSaveOption] = useState<SaveOptionsEnum | null>(SaveOptionsEnum.CREATE);
    const [searchName, setSearchName] = useState<string>('');
    const [selectedSearch, setSelectedSearch] = useState<SavedLoadboardSearch | null>(null);
    const [saving, setSaving] = useState(false);
    const savedSearches = useAppSelector(state => state.client.loadboard.savedSearches.searches);
    const dispatch = useAppDispatch();

    const options = useMemo<SelectOption<SaveOptionsEnum>[]>(() => {
        return [
            {
                value: SaveOptionsEnum.CREATE,
                label: t('save-new-search'),
            },
            {
                value: SaveOptionsEnum.UPDATE,
                label: t('save-over-existing-search'),
            },
        ];
    }, []);

    const savedSearchesOptions = useMemo(() => {
        return savedSearches.map(search => ({
            label: search.name,
            value: search,
        }));
    }, [savedSearches]);

    const save = useCallback(async () => {
        try {
            setSaving(true);
            if (saveOption === SaveOptionsEnum.CREATE) {
                await dispatch(
                    createLoadboardSearch({
                        name: searchName,
                        filters,
                    }),
                ).unwrap();
            }
            if (saveOption === SaveOptionsEnum.UPDATE && selectedSearch) {
                await dispatch(
                    updateLoadboardSearch({
                        id: selectedSearch.publicId,
                        name: selectedSearch.name,
                        filters,
                    }),
                ).unwrap();
            }
        } finally {
            setSaving(false);
            onClose();
        }
    }, [saveOption, selectedSearch, dispatch, searchName, filters, onClose]);

    const popupActions = useMemo(() => {
        const savedDisabled = saveOption === SaveOptionsEnum.CREATE ? (searchName?.length || 0) < 3 : !selectedSearch?.publicId;

        return (
            <>
                <Button size='small' view='primary' onClick={save} disabled={saving || savedDisabled}>
                    {t('save')}
                </Button>
                <Button size='small' onClick={onClose}>
                    {t('cancel')}
                </Button>
            </>
        );
    }, [saveOption, searchName, selectedSearch, save, saving, onClose]);

    useEffect(() => {
        if (!isOpen) {
            setSaving(false);
            setSearchName('');
            setSelectedSearch(null);
        }
    }, [isOpen]);

    return (
        <Popup
            isOpen={isOpen}
            onClose={onClose}
            title={t('save-search')}
            description={
                <div className={cn()}>
                    <FormControl>
                        <InputLabel>{t('save-search-option')}</InputLabel>
                        <Select<SaveOptionsEnum, false> value={saveOption} options={options} onChange={v => setSaveOption(v)} isClearable={false} />
                    </FormControl>
                    {saveOption === SaveOptionsEnum.CREATE && (
                        <FormControl>
                            <InputLabel>{t('name-for-search')}</InputLabel>
                            <Input value={searchName} onChange={e => setSearchName(e.target.value)} placeholder={t('please-input-something')} />
                        </FormControl>
                    )}
                    {saveOption === SaveOptionsEnum.UPDATE && (
                        <FormControl>
                            <InputLabel>{t('save-existing-search')}</InputLabel>
                            <Select<SavedLoadboardSearch, false>
                                value={selectedSearch}
                                options={savedSearchesOptions}
                                onChange={v => setSelectedSearch(v)}
                                isClearable={false}
                            />
                        </FormControl>
                    )}
                </div>
            }
            actions={popupActions}
        />
    );
};
