import { arrow, autoUpdate, flip, offset, Placement, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole } from '@floating-ui/react';
import React from 'react';

export type TooltipOptions = {
    initialOpen?: boolean;
    placement?: Placement;
    open?: boolean;
    showDelay?: number;
    hideDelay?: number;
    onOpenChange?: (open: boolean) => void;
};

export function useTooltip({
    initialOpen = false,
    placement = 'top',
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    showDelay,
    hideDelay,
}: TooltipOptions = {}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
    const arrowRef = React.useRef(null);

    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;

    const data = useFloating({
        placement,
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(12),
            flip({
                crossAxis: placement.includes('-'),
                fallbackAxisSideDirection: 'start',
                padding: 12,
            }),
            shift({ padding: 12 }),
            arrow({ element: arrowRef, padding: 4 }),
        ],
    });

    const context = data.context;

    const hover = useHover(context, {
        move: false,
        enabled: controlledOpen == null,
        delay: { open: showDelay, close: hideDelay },
    });
    const focus = useFocus(context, {
        enabled: controlledOpen == null,
    });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'tooltip' });

    const interactions = useInteractions([hover, focus, dismiss, role]);

    return React.useMemo(
        () => ({
            open,
            setOpen,
            ...interactions,
            ...data,
            arrowRef,
        }),
        [open, setOpen, interactions, data],
    );
}
