import * as React from 'react';
import { LoadingComponentProps } from 'react-loadable';

/**
 * Loading component. Renders a div with loading message
 */
export const Loading: React.StatelessComponent<LoadingComponentProps> = ({ isLoading, error, timedOut }) => {
    if (timedOut) {
        return (<div>Still loading...</div>);
    }

    if (error) {
        const errorMessage = process.env.NODE_ENV === 'development' ? <pre>{String(error)}</pre> : null;
        return (<div><p>Something went wrong...</p>{errorMessage}</div>)
    }

    return (<div>Loading...</div>);
};
