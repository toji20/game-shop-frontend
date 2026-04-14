'use client';

import { ProfilePageSkeleton } from '@/components/ui/profile-skeleton/profile-page-skeleton';
import dynamic from 'next/dynamic';

const ProfilePage = dynamic(() => import('./profile-page'), {
    ssr: false,
    loading: () => <ProfilePageSkeleton tab='profile' />,
});

export default ProfilePage;
