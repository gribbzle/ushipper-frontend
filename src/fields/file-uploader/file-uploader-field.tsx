import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Dropzone from 'react-dropzone';
import { FieldRenderProps } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { useHover } from '@/hooks/use-hover';
import { convertBytesToMB } from '@/utils/converter';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { FormHelperText } from '../form-helper-text';

import './file-uploader.scss';
import CheckCircleIcon from '@/assets/icons/check-circle.svg';
import FileIcon from '@/assets/icons/file.svg';
import UploadIcon from '@/assets/icons/upload.svg';
import XSmallIcon from '@/assets/icons/x-small.svg';

const t = translateByNamespace('common:file-uploader');
const cn = classname('file-uploader');

type FileProps = {
    file: File;
    onDelete: (file: File) => void;
};

type FileItemProps = {
    name: string;
    size: number;
    buttonContent: ReactNode;
    disabled?: boolean;
    onHoverCallback?: (isHover: boolean) => void;
    onItemClickCallback?: () => void;
    onDelete: () => void;
};
export const FileItem = ({ name, size, buttonContent, disabled = false, onHoverCallback, onDelete, onItemClickCallback }: FileItemProps) => {
    const [hoverRef, isHover] = useHover<HTMLDivElement>();

    useEffect(() => {
        if (onHoverCallback) {
            onHoverCallback(isHover);
        }
    }, [isHover, onHoverCallback]);

    return (
        <div ref={hoverRef} className={cn('file')} onClick={onItemClickCallback}>
            <FileIcon />
            <span className={cn('label')}>{t('file-label', { name, size: convertBytesToMB(size).toString() })}</span>
            {!disabled && (
                <Button
                    type='button'
                    view='link'
                    onClick={e => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    {buttonContent}
                </Button>
            )}
        </div>
    );
};
const File = ({ file, onDelete }: FileProps) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <FileItem
            name={file.name}
            size={file.size}
            onDelete={() => onDelete(file)}
            buttonContent={isHover ? <XSmallIcon /> : <CheckCircleIcon className={cn('success-icon')} />}
            onHoverCallback={setIsHover}
        />
    );
};

export const FileUploaderField = ({ input, label = t('attachments-label'), isMultiFiles = true, meta }: FieldRenderProps<File | File[] | null | undefined>) => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const errored = useMemo<boolean>(() => error || (meta.error && meta.touched) || meta.submitError, [error, meta.error, meta.touched, meta.submitError]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setError(null);
            if (acceptedFiles.length > 0) {
                const newFiles = isMultiFiles ? acceptedFiles : [acceptedFiles[0]];

                setFiles(isMultiFiles ? [...files, ...newFiles] : newFiles);
            } else {
                setError(t('single-file-upload-error'));
            }
        },
        [files, isMultiFiles],
    );

    useEffect(() => {
        input.onChange(files);
        input.onBlur();
    }, [files, input]);

    const handleRemove = (index: number) => {
        const newFiles = [...files];

        newFiles.splice(index, 1);

        setFiles(newFiles);
    };

    return (
        <Dropzone onDrop={onDrop} maxSize={20971520} multiple={isMultiFiles}>
            {({ getRootProps, getInputProps }) => (
                <section className={cn('container')}>
                    {(isMultiFiles || (!isMultiFiles && !files.length)) && (
                        <>
                            <div
                                {...getRootProps({
                                    onClick: () => {
                                        if (!files.length) {
                                            setError(null);
                                        }
                                    },
                                })}
                                className={cn()}
                            >
                                <input {...getInputProps({ name: 'attachments' })} />
                                <div className={cn('content')}>
                                    <UploadIcon /> {label ?? t('attachments-label')}
                                </div>
                                <span className={cn('hint')}>{t('hint')}</span>
                            </div>
                            {errored && <FormHelperText error={true}>{error || meta.error || meta.submitError}</FormHelperText>}
                        </>
                    )}
                    {files.length > 0 && (
                        <aside>
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
                </section>
            )}
        </Dropzone>
    );
};
