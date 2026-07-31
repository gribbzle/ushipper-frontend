import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import { classname } from '@utils/classname';
const cn = classname('payment-details-dropdown-menu');

type Props = {
    subMenu?: React.ReactNode;
    isHover?: boolean;
};

export const MenuItem = ({ subMenu, children, isHover }: PropsWithChildren<Props>) => {
    const [isOpenSubMenu, setIsOpenSubMenu] = useState(false);

    const openMenu = useCallback(() => {
        setIsOpenSubMenu(true);
    }, [setIsOpenSubMenu]);

    const closeMenu = useCallback(() => {
        setIsOpenSubMenu(false);
    }, [setIsOpenSubMenu]);

    const ref = useRef<HTMLInputElement>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const newWidth = entry.target.getBoundingClientRect().width;

                setWidth(newWidth);
            }
        });

        if (ref.current) {
            resizeObserver.observe(ref.current); // Start observing for size changes
        }

        return () => {
            resizeObserver.disconnect(); // Cleanup the observer on component unmount
        };
    }, []);

    return (
        <div className={cn('menu-item', { submenu: !!subMenu, hover: isHover })} onMouseEnter={openMenu} onMouseLeave={closeMenu}>
            {children}
            {subMenu && (
                <div style={{ left: `-${width + 4}px` }} className={cn('inner-wrap', { open: isOpenSubMenu })}>
                    <div ref={ref} className={cn('inner')}>
                        {subMenu}
                    </div>
                </div>
            )}
        </div>
    );
};
