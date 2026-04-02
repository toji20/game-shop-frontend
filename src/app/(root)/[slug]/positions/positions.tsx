import { PositionItem } from '../position-item/position-item';
import './positions.css';
import { IPosition } from '@/shared/types';

interface PositionsProps {
    items: IPosition[];
    gameId: number;
}

export function Positions({
    items,
    gameId,
    gameName,
}: PositionsProps & { gameName?: string }) {
    return (
        <div className='positions'>
            <div className='positions-block'>
                {items.map((item) => (
                    <PositionItem
                        item={item}
                        key={item.id}
                        gameId={gameId}
                        gameName={gameName}
                    />
                ))}
            </div>
        </div>
    );
}
