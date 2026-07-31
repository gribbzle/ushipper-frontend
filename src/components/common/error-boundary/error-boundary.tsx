import React, { PropsWithChildren } from 'react';

import { translateByNamespace } from '@utils/i18n';

type State = {
    hasError?: boolean;
};
type Props = PropsWithChildren<{
    details?: Record<any, any>;
}>;
const t = translateByNamespace('common:notifications');

export class ErrorBoundary extends React.Component<Props, State> {
    state = {
        hasError: false,
    };

    constructor(props: Props) {
        super(props);
    }

    static getDerivedStateFromError(error: any) {
        console.log(error, 'error');

        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        console.log(this.props.details, 'this.props.details');
        console.log(error, info, 'error, info');
    }

    render() {
        return <>{this.state.hasError ? <div>{t('component-error-notification')}</div> : this.props.children}</>;
    }
}
