import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export function useOrderSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
            transports: ['websocket'],
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
