import { FloatingArrow, FloatingPortal, useMergeRefs } from '@floating-ui/react';
import * as React from 'react';

import { classname } from '@utils';

import { TooltipContext, useTooltipContext } from './context';
import { TooltipOptions, useTooltip } from './use-tooltip';

import './tooltip.scss';

export function Tooltip({ children, ...options }: { children: React.ReactNode } & TooltipOptions) {
    // This can accept any props as options, e.g. `placement`,
    // or other positioning options.
    const tooltip = useTooltip(options);

    return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
}

export const TooltipTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & { asChild?: boolean }>(function TooltipTrigger(
    { children, asChild = false, ...props },
    propRef,
) {
    const context = useTooltipContext();
    const childrenRef = (children as any).ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    // `asChild` allows the user to pass any element as the anchor
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(
            children,
            context.getReferenceProps({
                ref,
                ...props,
                ...children.props,
                'data-state': context.open ? 'open' : 'closed',
            }),
        );
    }

    return (
        <div
            ref={ref}
            // The user can style the trigger based on the state
            data-state={context.open ? 'open' : 'closed'}
            {...context.getReferenceProps(props)}
        >
            {children}
        </div>
    );
});

const cn = classname('tooltip');

export const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function TooltipContent(
    { style, children, className, ...props },
    propRef,
) {
    const context = useTooltipContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);

    if (!context.open) return null;

    return (
        <FloatingPortal>
            <div
                className={cn('', [className])}
                ref={ref}
                style={{
                    ...context.floatingStyles,
                    ...style,
                }}
                {...context.getFloatingProps(props)}
            >
                {children}
                <FloatingArrow className={cn('arrow')} strokeWidth={0.5} width={12} height={6} ref={context.arrowRef} context={context.context} />
            </div>
        </FloatingPortal>
    );
});
