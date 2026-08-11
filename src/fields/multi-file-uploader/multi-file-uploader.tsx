import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FieldRenderProps } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { IconButton } from '@/components/common/icon-button/icon-button';
import { Attachment } from '@/shared/types';
import { classname } from '@utils/classname';
import { convertBytesToMB } from '@utils/converter';
import { translateByNamespace } from '@utils/i18n';

import './multi-file-uploader.scss';
import TrashIcon from '@/assets/icons/trash-can.svg';
import UploadIcon from '@/assets/icons/upload.svg';

const cn = classname('multi-file-uploader');
const t = translateByNamespace('common:multi-file-uploader');
const tFile = translateByNamespace('common:file-uploader');

type FileProps = {
    file: File;
    onDelete: () => void;
};

export const File = ({ file, onDelete }: FileProps) => (
    <div className={cn('file')}>
        <span className={cn('label')}>{tFile('file-label', { name: file.name, size: convertBytesToMB(file.size).toString() })}</span>
        <IconButton size='medium' onClick={onDelete} Icon={TrashIcon} />
    </div>
);

export const MultiFileUploader = ({
    input,
    callback,
    isMultiFiles = true,
}: FieldRenderProps<Attachment> & { callback: () => void; isMultiFiles?: boolean }) => {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (isMultiFiles) {
                setFiles(currentFiles => [...currentFiles, ...acceptedFiles]);
            } else {
                setFiles(acceptedFiles);
            }
        },
        [isMultiFiles],
    );

    useEffect(() => {
        input.onChange(files);
        callback?.();
    }, [files, input, callback]);

    const handleRemove = useCallback(
        (index: number) => {
            const newFiles = [...files];

            newFiles.splice(index, 1);

            setFiles(newFiles);
        },
        [files],
    );

    const hasUploadBtn = useMemo(() => isMultiFiles || (!isMultiFiles && !files.length), [isMultiFiles, files.length]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: isMultiFiles,
        maxSize: 20971520,
    });

    return (
        <div className={cn()}>
            {files.length > 0 && (
                <aside className={cn()}>
                    {files.map((file, index) => (
                        <File
                            key={index}
                            file={file}
                            onDelete={() => {
                                handleRemove(index);
                            }}
                        />
                    ))}
                </aside>
            )}
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                {hasUploadBtn && (
                    <Button view='primary' plain={true} size='small'>
                        <UploadIcon /> {t('upload-label')}
                    </Button>
                )}
            </div>
        </div>
    );
};
