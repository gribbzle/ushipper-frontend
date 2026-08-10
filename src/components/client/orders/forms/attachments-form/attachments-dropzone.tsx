import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Transition } from 'react-transition-group';

import { Button } from '@/components/common/button/button';
import { ZoneButton } from '@/components/common/zone-button/zone-button';
import { useDownloadAttachment } from '@/hooks/useDownload';
import { Attachment } from '@/shared';
import {FileItem} from '@/fields/file-uploader';
import {FormHelperText} from '@/fields/form-helper-text';
import { useAppDispatch } from '@store';
import { viewersActions } from '@store/common/viewers';
import { classname } from '@utils/classname';
import { isFileImage, isFilePdf } from '@utils/files';
import { translateByNamespace } from '@utils/i18n';

import { AttachmentDropzoneProps } from './attachments-form.types';

import './attachments-form.scss';
import ArrowDownIcon from '@/assets/icons/arrow-down.svg';
import BinIcon from '@/assets/icons/bin-icon.svg';
import UploadIcon from '@/assets/icons/upload.svg';

const fuT = translateByNamespace('common:file-uploader');
const lT = translateByNamespace('client:loadboard-filters');
const fuCn = classname('file-uploader');
const attachmentCn = classname('attachments-form');

export const AttachmentsDropzone = ({
    onDrop,
    onDeleteFile,
    label,
    files,
    otherFiles,
    isMultiFiles = true,
    type,
    disabled = false,
}: AttachmentDropzoneProps) => {
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const dispatch = useAppDispatch();

    const { downloadAttachment } = useDownloadAttachment();

    const handleFileItemClick = useCallback(
        (file: Attachment) => {
            const { url, name } = file;
            const isPdf = isFilePdf(url);
            const isImage = isFileImage(url);

            if (isPdf || isImage) {
                const popupPayload = {
                    isOpened: true,
                    url,
                    fileName: name,
                };

                dispatch(isFilePdf(url) ? viewersActions.setPDFViewerPopup(popupPayload) : viewersActions.setImageViewerPopup(popupPayload));
            } else {
                downloadAttachment(file);
            }
        },
        [downloadAttachment, dispatch],
    );

    return (
        <Dropzone
            multiple={isMultiFiles}
            onDrop={(acceptedFiles: File[]) => {
                if (acceptedFiles.length === 0 && !isMultiFiles) {
                    setError(fuT('single-file-upload-error'));
                } else {
                    setError(null);
                }
                onDrop?.(acceptedFiles, type);
            }}
            maxSize={20971520}
        >
            {({ getRootProps, getInputProps }) => (
                <section className={fuCn('container')}>
                    {!disabled && (isMultiFiles || (!isMultiFiles && !files.length)) && (
                        <>
                            <div
                                className={fuCn()}
                                {...getRootProps({
                                    onClick: () => {
                                        if (!files.length) {
                                            setError(null);
                                        }
                                    },
                                })}
                            >
                                <div className={fuCn('content')}>
                                    <input {...getInputProps()} />
                                    <UploadIcon /> {label}
                                </div>
                                <span className={fuCn('hint')}>{fuT('hint')}</span>
                            </div>
                            {error && <FormHelperText error={true}>{error}</FormHelperText>}
                        </>
                    )}
                    {disabled && !files.length && <ZoneButton label={fuT('empty-label')} onClick={() => undefined} disabled={disabled} />}
                    <div className={fuCn('container')}>
                        {!!files.length && (
                            <aside>
                                {files.map(file => (
                                    <FileItem
                                        onItemClickCallback={() => handleFileItemClick(file)}
                                        key={file.publicId}
                                        size={file.size}
                                        name={file.name}
                                        onDelete={() => onDeleteFile(file)}
                                        buttonContent={<BinIcon className={attachmentCn('bin-icon')} />}
                                        disabled={disabled}
                                    />
                                ))}
                                {otherFiles && (
                                    <Transition in={showAll} timeout={500}>
                                        {state => (
                                            <div className={attachmentCn('transition', { state })}>
                                                {otherFiles.map(attachment => (
                                                    <FileItem
                                                        key={attachment.publicId}
                                                        size={attachment.size}
                                                        name={attachment.name}
                                                        onDelete={() => onDeleteFile(attachment)}
                                                        onItemClickCallback={() => handleFileItemClick(attachment)}
                                                        buttonContent={<BinIcon className={attachmentCn('bin-icon')} />}
                                                        disabled={disabled}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </Transition>
                                )}
                            </aside>
                        )}
                        {!!otherFiles?.length && (
                            <Button className={fuCn('show-more-btn')} active={true} view='link' onClick={() => setShowAll(!showAll)}>
                                <ArrowDownIcon
                                    className={fuCn('arrow-icon', {
                                        rotate: showAll,
                                    })}
                                />{' '}
                                {showAll ? lT('show-less') : lT('show-more')}
                            </Button>
                        )}
                    </div>
                </section>
            )}
        </Dropzone>
    );
};
