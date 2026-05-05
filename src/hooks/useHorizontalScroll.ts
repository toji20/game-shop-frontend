import { useEffect, useRef, useState } from 'react';

export function useHorizontalScroll() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const startX = useRef(0);
    const startScrollLeft = useRef(0);
    const isMouseDown = useRef(false);
    const hasMoved = useRef(false);

    const updateArrows = () => {
        const el = scrollRef.current;
        if (!el) return;
        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < maxScrollLeft - 4);
    };

    const scrollByAmount = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = Math.max(el.clientWidth * 0.8, 260);
        el.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });
    };

    const resetScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({ left: 0, behavior: 'auto' });
        updateArrows();
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        updateArrows();

        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
            updateArrows();
        };
        const onDragStart = (e: DragEvent) => e.preventDefault();
        const onScroll = () => updateArrows();
        const onResize = () => updateArrows();

        el.addEventListener('wheel', onWheel, { passive: false });
        el.addEventListener('dragstart', onDragStart);
        el.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onResize);

        return () => {
            el.removeEventListener('wheel', onWheel);
            el.removeEventListener('dragstart', onDragStart);
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const el = scrollRef.current;
            if (!isMouseDown.current || !el) return;

            const delta = e.clientX - startX.current;
            if (Math.abs(delta) > 8) {
                hasMoved.current = true;
                if (!isDragging) setIsDragging(true);
            }
            if (!hasMoved.current) return;

            el.scrollLeft = startScrollLeft.current - delta;
            updateArrows();
        };

        const handleMouseUp = () => {
            isMouseDown.current = false;
            if (isDragging) setIsDragging(false);
            window.setTimeout(() => {
                hasMoved.current = false;
            }, 0);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0 || !scrollRef.current) return;
        isMouseDown.current = true;
        hasMoved.current = false;
        startX.current = e.clientX;
        startScrollLeft.current = scrollRef.current.scrollLeft;
    };

    const onClickCapture = (e: React.MouseEvent) => {
        if (hasMoved.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    return {
        scrollRef,
        canScrollLeft,
        canScrollRight,
        isDragging,
        scrollByAmount,
        resetScroll,
        updateArrows,
        onMouseDown,
        onClickCapture,
    };
}
