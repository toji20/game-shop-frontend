import './globals.css';
import { Providers } from './provider';
import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/seo.constants';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistInter = Inter({
    variable: '--font-geist-inter',
    subsets: ['latin'],
});

const geistSyne = Geist({
    variable: '--font-geist-Sune',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='ru'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${geistSyne.variable} ${geistInter.variable} antialiased`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
