import OperatorPage from './OperatorPage';
import { NO_INDEX_PAGE } from '@/constants/seo.constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Управление магазином',
    ...NO_INDEX_PAGE,
};

export default function OperatorPanelPage() {
    return (
        <div className=''>
            <OperatorPage />
        </div>
    );
}
