import OrderStatusPage from './order-page';
import { NO_INDEX_PAGE } from '@/constants/seo.constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Страница товара',
    ...NO_INDEX_PAGE,
};

export default function GamePageHome() {
    return <OrderStatusPage />;
}
