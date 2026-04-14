'use client';

import { CatalogItem } from './catalog-item';
import './catalog.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { PUBLIC_URL } from '@/config/url.config';
import { useCategories } from '@/hooks/queries/useCategory';
import { useGamesActive } from '@/hooks/queries/useGame';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface CatalogProps {
    titleOrSort?: boolean;
}

export function Catalog({ titleOrSort = true }: CatalogProps) {
    const { activeGames } = useGamesActive();
    const { categories } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );

    const filtered = selectedCategory
        ? activeGames?.filter((g) => g.categoryId === selectedCategory)
        : activeGames;

    return (
        <div className='catalog'>
            {titleOrSort ? (
                <Link href={PUBLIC_URL.games()} className='catalog-title'>
                    <h3>Все игры</h3>
                    <ChevronRight className='catalog-title-svg' />
                </Link>
            ) : (
                <div className='catalog-sort'>
                    <button
                        className={`catalog-sort-btn ${selectedCategory === null ? 'catalog-sort-btn--active' : ''}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        Все
                    </button>
                    {categories?.map((c) => (
                        <button
                            key={c.id}
                            className={`catalog-sort-btn ${selectedCategory === c.id ? 'catalog-sort-btn--active' : ''}`}
                            onClick={() =>
                                setSelectedCategory(
                                    selectedCategory === c.id ? null : c.id,
                                )
                            }
                        >
                            {c.title}
                        </button>
                    ))}
                </div>
            )}

            <div className='catalog-items'>
                {!activeGames
                    ? Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className='catalog-item'>
                              <Skeleton
                                  width='100%'
                                  borderRadius={12}
                                  className='catalog-item-img-skeleton'
                              />
                              <div
                                  style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: 6,
                                      marginTop: 15,
                                  }}
                              >
                                  <Skeleton width='70%' height={17} />
                                  <Skeleton width='45%' height={15} />
                              </div>
                          </div>
                      ))
                    : filtered?.map((item) => (
                          <CatalogItem key={item.id} item={item} />
                      ))}
            </div>
        </div>
    );
}
