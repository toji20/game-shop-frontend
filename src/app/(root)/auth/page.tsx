import AuthPage from './auth-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Авторизация — ZaneShop',
    description: 'Авторизуйтесь в ZaneShop для более выгодных предложений!',
};

export default function HomePage() {
    return (
        <div>
            <AuthPage />
        </div>
    );
}
