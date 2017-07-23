import * as  React from 'react';

type ModuleNamespace<T> = any; // TODO

/** Props passed to the loading component */
export interface LoadingProps {
    isLoading: boolean;
    error: any;
    timedOut: boolean;
}

interface GetComponentAsyncProps<T> {
    /** A function that returns promise of a module namespace or a module namespace */
    asyncLoader: (props: T) => ((() => Promise<ModuleNamespace<T>>) | ModuleNamespace<T>);
    loading?: React.ComponentType<LoadingProps>;
    exportKey?: string;
}
export function getComponentAsync<T>(getComponentAsyncProps: GetComponentAsyncProps<T>) {

    return class AsyncComponent extends React.Component<T, { ResultComponent: React.ComponentType<T> }> {
        state = { ResultComponent: null as any };

        componentWillMount() {
            const exportKey = getComponentAsyncProps.exportKey || 'default';
            const loaderResult = getComponentAsyncProps.asyncLoader(this.props);
            if (loaderResult instanceof Promise) {
                (loaderResult as Promise<ModuleNamespace<T>>).then(result =>{
                    this.setState({ ResultComponent: result[exportKey] });
                })
            } else {
                this.setState({ ResultComponent: (loaderResult as ModuleNamespace<T>)[exportKey] });
            }
        }

        render() {
            if (this.state.ResultComponent) {
                return <this.state.ResultComponent />
            }
            if (getComponentAsyncProps.loading) {
                return <getComponentAsyncProps.loading isLoading={true} error={null} timedOut={false} />
            }
            return null;
        }
    }
}

