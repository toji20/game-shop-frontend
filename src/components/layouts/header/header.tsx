import { Buttons } from './buttons';
import './header.css';
import { Navigation } from './navigation';
import { SearchBar } from './searchbar';
import Image from 'next/image';

export function Header() {
    return (
        <div className='header'>
            <div className='header-block'>
                <Image
                    src={'/rov-logo.png'}
                    alt='rov'
                    width={160}
                    height={40}
                    priority
                />
                <Navigation />
                <SearchBar />
                <Buttons />
            </div>
        </div>
    );
}
