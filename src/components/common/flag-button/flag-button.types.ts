import { MouseEvent } from 'react';

export type FlagButtonProps = {
    isFlagged: boolean;
    handleMarkAsUnFlaggedClick: (e: MouseEvent<HTMLButtonElement>) => void;
    handleMarkAsFlaggedClick: (e: MouseEvent<HTMLButtonElement>) => void;
};
