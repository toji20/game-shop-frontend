'use client';

import { useUploadFile } from '@/hooks/queries/useFile';
import Image from 'next/image';
import { useRef } from 'react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
    label?: string;
}

export default function ImageUpload({
    value,
    onChange,
    folder,
    label = 'Изображение',
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { uploadFile, isLoadingUpload } = useUploadFile();

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadFile(
            { files: [file], folder },
            {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSuccess: (res: any) => {
                    // fileService.upload returns array of { url: string }
                    const url = Array.isArray(res) ? res[0]?.url : res?.url;
                    if (url) onChange(url);
                },
            },
        );
    };

    return (
        <div className='form-group'>
            <label className='form-label'>{label}</label>
            <div className='img-upload'>
                {value ? (
                    <div className='img-upload__preview'>
                        <img
                            src={value}
                            alt='preview'
                            width={64}
                            height={64}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                        <button
                            type='button'
                            className='img-upload__remove'
                            onClick={() => onChange('')}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <button
                        type='button'
                        className='img-upload__btn'
                        disabled={isLoadingUpload}
                        onClick={() => inputRef.current?.click()}
                    >
                        {isLoadingUpload ? 'Загружаем...' : '+ Загрузить фото'}
                    </button>
                )}
                {value && (
                    <button
                        type='button'
                        className='img-upload__change'
                        disabled={isLoadingUpload}
                        onClick={() => inputRef.current?.click()}
                    >
                        {isLoadingUpload ? 'Загружаем...' : 'Заменить'}
                    </button>
                )}
                <input
                    ref={inputRef}
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={handleFile}
                />
            </div>
        </div>
    );
}
