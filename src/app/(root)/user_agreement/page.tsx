import UserAgreementPage from './user-agreement-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Условия пользования — ZaneShop',
    description: 'Здесь вы можете ознакомиться с правилами',
};

export default function HomePage() {
    return (
        <div className='bg-[#0000007e]'>
            <UserAgreementPage />
        </div>
    );
}
