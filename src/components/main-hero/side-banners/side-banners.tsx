/* eslint-disable react-hooks/immutability */
'use client';

import { SideBannerItem } from './side-banner-item';
import './side-banner.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useSideBanner } from '@/hooks/queries/useSideBanner';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useRef, useState } from 'react';

export function SideBanners() {
    const { sideBanners } = useSideBanner();
    const items = sideBanners ?? [];

    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const autoplayRef = useRef<NodeJS.Timeout | null>(null);
    const directionRef = useRef(true);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        skipSnaps: false,
        duration: 25,
        slidesToScroll: 1,
    });

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setActiveIndex(emblaApi.selectedScrollSnap());
        };

        const onPointerDown = () => {
            setIsDragging(true);
            stopAutoplay();
        };

        const onPointerUp = () => {
            setIsDragging(false);
            startAutoplay();
        };

        emblaApi.on('select', onSelect);
        emblaApi.on('pointerDown', onPointerDown);
        emblaApi.on('pointerUp', onPointerUp);

        // важный фикс: дождаться layout
        const timeout = setTimeout(() => {
            emblaApi.reInit();
            emblaApi.scrollTo(0, true);
            onSelect();
            startAutoplay();
        }, 50);

        return () => {
            clearTimeout(timeout);

            emblaApi.off('select', onSelect);
            emblaApi.off('pointerDown', onPointerDown);
            emblaApi.off('pointerUp', onPointerUp);

            stopAutoplay();
        };
    }, [emblaApi]);

    const startAutoplay = () => {
        if (!emblaApi || items.length <= 1) return;

        stopAutoplay();

        autoplayRef.current = setInterval(() => {
            if (!emblaApi) return;

            const selected = emblaApi.selectedScrollSnap();
            const last = items.length - 1;

            if (selected >= last) directionRef.current = false;
            if (selected <= 0) directionRef.current = true;

            directionRef.current
                ? emblaApi.scrollNext()
                : emblaApi.scrollPrev();
        }, 4000);
    };

    const stopAutoplay = () => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
    };

    if (!sideBanners) {
        return (
            <div className='side-banners'>
                <div className='side-banners__viewport'>
                    <Skeleton width={360} height={195} borderRadius={16} />
                </div>
            </div>
        );
    }

    if (!items.length) return null;

    return (
        <div className='side-banners'>
            <div
                className={`side-banners__viewport ${
                    isDragging ? 'is-dragging' : ''
                }`}
                ref={emblaRef}
            >
                <div className='side-banners__container'>
                    {items.map((item, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={index}
                                className={`side-banners__slide ${
                                    isActive
                                        ? 'side-banners__slide--active'
                                        : ''
                                }`}
                                onClick={() => emblaApi?.scrollTo(index)}
                            >
                                <div
                                    className={`side-banners__inner ${
                                        isActive ? 'is-active' : ''
                                    }`}
                                >
                                    <SideBannerItem
                                        item={item}
                                        active={isActive}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {items.length > 1 && (
                <div className='side-banners__dots'>
                    {items.map((_, index) => (
                        <button
                            key={index}
                            className={`side-banners__dot ${
                                index === activeIndex
                                    ? 'side-banners__dot--active'
                                    : ''
                            }`}
                            onClick={() => emblaApi?.scrollTo(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
