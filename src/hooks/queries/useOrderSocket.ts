import { SERVER_URL } from '@/config/api.config';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export function useOrderSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = io(SERVER_URL, {
            path: '/api/socket.io',
            transports: ['websocket'],
            withCredentials: true,
        });

        socket.on('order:created', () => {
            queryClient.invalidateQueries({ queryKey: ['manual-orders'] });
        });

        socket.on('order:updated', (data: { id: string }) => {
            queryClient.invalidateQueries({ queryKey: ['manual-orders'] });
            queryClient.invalidateQueries({
                queryKey: ['manual-order', data.id],
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [queryClient]);
}
