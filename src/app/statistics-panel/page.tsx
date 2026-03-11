import StatisticsPanel from './statistics-panel';
import { NO_INDEX_PAGE } from '@/constants/seo.constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Управление магазином',
    ...NO_INDEX_PAGE,
};

export default function StatisticsPanelPage() {
    return (
        <div className='bg-[#0b0d14]'>
            <StatisticsPanel />
        </div>
    );
}
