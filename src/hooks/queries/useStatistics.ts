import { statisticsService } from '@/services/statistics.service';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useMainStatistics() {
    const { data: statistics, isLoading: isLoadingStatistics } = useQuery({
        queryKey: ['statistics-main'],
        queryFn: () => statisticsService.getMain(),
    });

    return useMemo(
        () => ({ statistics, isLoadingStatistics }),
        [statistics, isLoadingStatistics],
    );
}

export function useDetailedStatistics() {
    const { data: statistics, isLoading: isLoadingStatistics } = useQuery({
        queryKey: ['statistics-detailed'],
        queryFn: () => statisticsService.getDetailed(),
    });

    return useMemo(
        () => ({ statistics, isLoadingStatistics }),
        [statistics, isLoadingStatistics],
    );
}
