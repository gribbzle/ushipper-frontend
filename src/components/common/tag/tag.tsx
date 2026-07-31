import React, { MouseEventHandler } from 'react';

import { classname } from '@utils/classname';

import './tag.scss';

type TagElementProps<Tag extends 'button' | 'div'> = Tag extends 'button'
    ? {
          disabled?: boolean;
          buttonType?: 'button' | 'submit';
      }
    : NonNullable<unknown>;

type Props<Tag extends 'button' | 'div'> = React.PropsWithChildren<
    {
        className?: string;
        type?: 'default' | 'plain-primary' | 'primary' | 'gray';
        size?: 'default' | 'small' | 'round';
        onClick?: MouseEventHandler;
        withHover?: boolean;
        elementTag?: Tag;
    } & TagElementProps<Tag>
>;

const cn = classname('tag');

export const Tag = <T extends 'button' | 'div'>(props: Props<T>) => {
    const { type = 'default', elementTag = 'div', onClick, withHover, size, ...rest } = props;
    const TagElement = elementTag;

    return (
        <TagElement
            {...rest}
            className={cn(
                '',
                {
                    type: type,
                    size: size || 'default',
                    [`with-hover-${type}`]: withHover,
                },
                [props.className],
            )}
            onClick={onClick}
        >
            {props.children}
        </TagElement>
    );
};
