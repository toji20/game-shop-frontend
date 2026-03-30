import './info-block.css';
import { Instructions } from './instructions/instructions';
import { SideBar } from './sidebar/sidebar';
import { IGame } from '@/shared/types';

interface InfoBlockProps {
    game: IGame;
}

export function InfoBlock({ game }: InfoBlockProps) {
    return (
        <div className='info-block'>
            <Instructions images={game.instructions} />
        </div>
    );
}
