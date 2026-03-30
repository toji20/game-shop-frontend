import { Button } from '@/components/ui/button';
import { PUBLIC_URL } from '@/config/url.config';
import { LogOut, Ticket } from 'lucide-react';
import Link from 'next/link';

export function Buttons() {
    return (
        <div className='buttons'>
            <Link href={PUBLIC_URL.profile()}>
                <Button className='btn btn-promo'>
                    <Ticket />
                    Промокоды
                </Button>
            </Link>
            <Link href={PUBLIC_URL.auth()}>
                <Button className='btn btn-auth'>
                    <LogOut />
                    Войти
                </Button>
            </Link>
        </div>
    );
}
