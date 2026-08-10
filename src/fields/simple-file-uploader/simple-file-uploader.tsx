import React, { useCallback, useEffect, useState } from 'react';
import has from 'has-values';
import { useDropzone } from 'react-dropzone';
import { FieldRenderProps } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { IconButton } from '@/components/common/icon-button/icon-button';
import { ZoneButton } from '@/components/common/zone-button/zone-button';
import { useHover } from '@/hooks/use-hover';
import { Attachment } from '@/shared';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './simple-file-uploader.scss';
import TrashIcon from '@/assets/icons/trash-can.svg';
import UploadIcon from '@/assets/icons/upload.svg';

const cn = classname('simple-file-uploader');
const t = translateByNamespace('common:simple-file-uploader');

type FileProps = {
    file: File | Attachment;
    onDelete: () => () => void;
};

const File = ({ file, onDelete }: FileProps) => {
    const [hoverRef, isHover] = useHover<HTMLDivElement>();

    return (
        <div ref={hoverRef} className={cn('file')}>
            <span>{file.name}</span>
            {isHover && <IconButton size='mini' Icon={TrashIcon} onClick={onDelete()} />}
        </div>
    );
};

type SimpleFileUploaderProps = {
    view: 'button' | 'dropzone';
} & FieldRenderProps<Attachment>;

export const SimpleFileUploader = ({ view = 'button', input }: SimpleFileUploaderProps) => {
    const [file, setFile] = useState<File | Attachment | null>(has(input.value) ? input.value : null);

    useEffect(() => {
        input.onChange(file);
    }, [file, input]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            setFile(file);
        });
    }, []);

    const handleRemove = () => () => {
        setFile(null);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, maxSize: 20971520 });

    return (
        <>
            <div {...getRootProps()} className={cn('', { 'has-file': file !== null })}>
                <input {...getInputProps()} />
                {file === null && view === 'button' && (
                    <Button view='primary' size='medium'>
                        <UploadIcon /> {t('btn-label')}
                    </Button>
                )}
                {file === null && view === 'dropzone' && <ZoneButton onClick={() => null} label={t('label')} Icon={UploadIcon} hint={t('hint')} />}
            </div>
            {file && <File file={file} onDelete={handleRemove} />}
        </>
    );
};
