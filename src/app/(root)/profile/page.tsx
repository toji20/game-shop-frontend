import ProfilePage from './profile-page';
import { Suspense } from 'react';

export default function HomePage() {
    return (
        <div className='bg-[#0000007e]'>
            <Suspense>
                <ProfilePage />
            </Suspense>
        </div>
    );
}
