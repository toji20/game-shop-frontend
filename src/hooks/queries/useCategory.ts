import { DASHBOARD_URL } from '@/config/url.config';
import { categoryService } from '@/services/category.service';
import { ICategoryCreate, ICategoryUpdate } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useCategories() {
    const { data: categories, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAll(),
    });

    return useMemo(
        () => ({ categories, isLoadingCategories }),
        [categories, isLoadingCategories],
    );
}

export function useCategory(id: string) {
    const { data: category, isLoading: isLoadingCategory } = useQuery({
        queryKey: ['category', id],
        queryFn: () => categoryService.getById(id),
        enabled: !!id,
    });

    return useMemo(
        () => ({ category, isLoadingCategory }),
        [category, isLoadingCategory],
    );
}

export function useCreateCategory() {
    const { push } = useRouter();
    const queryClient = useQueryClient();

    const { mutate: createCategory, isPending: isLoadingCreate } = useMutation({
        mutationKey: ['create category'],
        mutationFn: (dto: ICategoryCreate) => categoryService.create(dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Категория создана');
            push(DASHBOARD_URL.categories());
        },
        onError() {
            toast.error('Ошибка при создании категории');
        },
    });

    return useMemo(
        () => ({ createCategory, isLoadingCreate }),
        [createCategory, isLoadingCreate],
    );
}

export function useUpdateCategory(id: string) {
    const queryClient = useQueryClient();

    const { mutate: updateCategory, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update category', id],
        mutationFn: (dto: ICategoryUpdate) => categoryService.update(id, dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['category', id] });
            toast.success('Категория обновлена');
        },
        onError() {
            toast.error('Ошибка при обновлении категории');
        },
    });

    return useMemo(
        () => ({ updateCategory, isLoadingUpdate }),
        [updateCategory, isLoadingUpdate],
    );
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    const { mutate: deleteCategory, isPending: isLoadingDelete } = useMutation({
        mutationKey: ['delete category'],
        mutationFn: (id: string) => categoryService.delete(id),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Категория удалена');
        },
        onError() {
            toast.error('Ошибка при удалении категории');
        },
    });

    return useMemo(
        () => ({ deleteCategory, isLoadingDelete }),
        [deleteCategory, isLoadingDelete],
    );
}
