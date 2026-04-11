import { Footer } from '@/components/layouts/footer/footer';
import { Header } from '@/components/layouts/header/header';
import { PropsWithChildren, Suspense } from 'react';

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className='bg-[#121415] min-h-screen'>
            <Suspense>
                <Header />
            </Suspense>
            {children}
            <Footer />
        </div>
    );
}
