import DataPage from './data-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Условия пользования — ZaneShop',
    description: 'Здесь вы можете ознакомиться с правилами',
};

export default function HomePage() {
    return (
        <div className='bg-[#0000007e]'>
            <DataPage />
        </div>
    );
}
