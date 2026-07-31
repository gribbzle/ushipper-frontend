import React, { useEffect, useRef, useState } from 'react';

import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './text-accordion.scss';

type Props = {
    text: string;
    lineHeight?: number;
    maxLineCount?: number;
    className?: string;
};

const t = translateByNamespace('common:text-accordion');
const cn = classname('text-accordion');

export const TextAccordion = ({ text, className, lineHeight = 20, maxLineCount = 3 }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const currentTextRef = textRef.current;

        if (currentTextRef) {
            const textHeight = currentTextRef.scrollHeight;
            const maxTextHeight = lineHeight * maxLineCount;

            setIsButtonVisible(textHeight > maxTextHeight);
        }
    }, [text, lineHeight, maxLineCount]);

    const toggleExpand = () => {
        setIsExpanded(preValue => !preValue);
    };

    return (
        <div className={cn('', [className])}>
            <p ref={textRef} className={cn('text', { collapsed: isButtonVisible && !isExpanded })}>
                {text}
            </p>
            {isButtonVisible && (
                <span className={cn('toggle-button')} onClick={toggleExpand}>
                    {isExpanded ? t('show-less-btn-label') : t('show-more-btn-label')}
                </span>
            )}
        </div>
    );
};
