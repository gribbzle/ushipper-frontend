// @ts-nocheck

import React, { useRef, useState } from 'react';
import { useCallback } from 'react';

import { Button } from '@components';
import { classname, translateByNamespace } from '@utils';

import DefaultAvatarIcon from './default-avatar.svg';

import './image-file-input.scss';

const cn = classname('image-file-input');
const t = translateByNamespace('common:file-uploader');

export const ImageFileInput = props => {
    const { label, input, meta, help, fileEntity, disabled } = props;
    const { value, onChange, onBlur, name } = input;
    const { touched, error, submitError } = meta;

    const [previewBase64, setPreviewBase64] = useState(null);

    const onChangeFileInput = useCallback(
        file => {
            if (!file) {
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                onChange(file);
                onBlur();

                setPreviewBase64(reader.result);
            };
            reader.readAsDataURL(file);
        },
        [onBlur, onChange],
    );

    const inputRef = useRef();

    const onDeleteFile = useCallback(
        event => {
            event.preventDefault();
            setPreviewBase64(null);
            inputRef.current.value = '';
            onChange(null);
            onBlur();
        },
        [onBlur, onChange],
    );

    const onUploadClickHandler = useCallback(() => {
        inputRef.current.click();
    }, []);

    const isErrorVisible = touched && !!error;
    const helpText = (touched && (error || submitError)) || help;

    return (
        <div className={cn()}>
            {label && (
                <label className={cn('label')} htmlFor={name}>
                    {label}
                </label>
            )}
            <div>
                {(value && typeof value === 'string') || previewBase64 || value?.url ? (
                    <img src={(typeof value === 'string' && value) || previewBase64 || value?.url} alt='upload-image' />
                ) : (
                    <DefaultAvatarIcon />
                )}
                {!disabled && (
                    <>
                        <Button type='button' view='primary' size='small' plain={true} onClick={onUploadClickHandler}>
                            {value ? 'Change' : 'Upload'} {fileEntity || t('avatar')}
                        </Button>
                        {value && (
                            <Button type='button' size='small' onClick={onDeleteFile}>
                                Delete
                            </Button>
                        )}
                    </>
                )}
                <input name={name} ref={inputRef} onChange={event => onChangeFileInput(event.target.files[0])} id={name} type='file' accept='image/*' />
            </div>
            {helpText && <div className={cn('help', { warning: isErrorVisible })}>{helpText}</div>}
        </div>
    );
};
