import { fileService } from '@/services/file.service';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useUploadFile() {
    const { mutate: uploadFile, isPending: isLoadingUpload } = useMutation({
        mutationKey: ['upload file'],
        mutationFn: ({ files, folder }: { files: File[]; folder?: string }) =>
            fileService.upload(files, folder),
        onSuccess() {
            toast.success('Файл загружен');
        },
        onError() {
            toast.error('Ошибка при загрузке файла');
        },
    });

    return useMemo(
        () => ({ uploadFile, isLoadingUpload }),
        [uploadFile, isLoadingUpload],
    );
}
