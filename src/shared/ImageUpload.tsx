/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useUploadFile } from '@/hooks/queries/useFile';
import { useRef } from 'react';

// ── Одиночный режим (value: string, onChange: (url: string) => void)
interface SingleProps {
    multiple?: false;
    value: string;
    onChange: (url: string) => void;
    folder?: string;
    label?: string;
}

// ── Множественный режим (value: string[], onChange: (urls: string[]) => void)
interface MultipleProps {
    multiple: true;
    value: string[];
    onChange: (urls: string[]) => void;
    folder?: string;
    label?: string;
    max?: number;
}

type ImageUploadProps = SingleProps | MultipleProps;

export default function ImageUpload(props: ImageUploadProps) {
    const { folder, label = 'Изображение' } = props;
    const inputRef = useRef<HTMLInputElement>(null);
    const { uploadFile, isLoadingUpload } = useUploadFile();

    const isMultiple = props.multiple === true;

    const images: string[] = isMultiple
        ? (props.value as string[])
        : props.value
          ? [props.value as string]
          : [];

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        e.target.value = '';

        uploadFile(
            { files, folder },
            {
                onSuccess: (res: any) => {
                    const urls: string[] = Array.isArray(res)
                        ? res.map((r: any) => r.url).filter(Boolean)
                        : res?.url
                          ? [res.url]
                          : [];

                    if (!urls.length) return;

                    if (isMultiple) {
                        const next = [...(props.value as string[]), ...urls];
                        const max = (props as MultipleProps).max;
                        props.onChange(max ? next.slice(0, max) : next);
                    } else {
                        // одиночный — берём только первый URL
                        props.onChange(urls[0]);
                    }
                },
            },
        );
    };

    const handleRemove = (idx: number) => {
        if (isMultiple) {
            props.onChange(
                (props.value as string[]).filter((_, i) => i !== idx),
            );
        } else {
            props.onChange('');
        }
    };

    const max = isMultiple ? (props as MultipleProps).max : 1;
    const canAdd = max === undefined || images.length < max;

    return (
        <div className='form-group'>
            <label className='form-label'>{label}</label>
            <div className='img-upload'>
                {/* превью */}
                <div className='img-upload__list'>
                    {images.map((url, idx) => (
                        <div key={idx} className='img-upload__preview'>
                            <img
                                src={url}
                                alt={`preview-${idx}`}
                                width={64}
                                height={64}
                                style={{ objectFit: 'cover', borderRadius: 4 }}
                            />
                            <button
                                type='button'
                                className='img-upload__remove'
                                onClick={() => handleRemove(idx)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {/* кнопка добавить/загрузить */}
                {canAdd && (
                    <button
                        type='button'
                        className='img-upload__btn'
                        disabled={isLoadingUpload}
                        onClick={() => inputRef.current?.click()}
                    >
                        {isLoadingUpload
                            ? 'Загружаем...'
                            : images.length > 0 && !isMultiple
                              ? 'Заменить'
                              : '+ Загрузить фото'}
                    </button>
                )}

                <input
                    ref={inputRef}
                    type='file'
                    accept='image/*'
                    multiple={isMultiple}
                    style={{ display: 'none' }}
                    onChange={handleFile}
                />
            </div>
        </div>
    );
}
