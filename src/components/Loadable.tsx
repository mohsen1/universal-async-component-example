import * as  React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface LoadableProps<T> {
    loader: (props: RouteComponentProps<T>) => ((() => Promise<React.ComponentType<T>>) | React.ComponentType<T>);
    loading: React.ComponentType<T>;
}
export function Loadable<T>(loadableProps: LoadableProps<T>) {

    return class LoadableComponent extends React.Component<RouteComponentProps<T>, { ResultComponent: React.ComponentType<T> }> {
        state = { ResultComponent: null as any };

        componentWillMount() {
            const loaderResult = loadableProps.loader(this.props);
            if (loaderResult instanceof Promise) {
                loaderResult.then(result =>{
                    this.setState({ ResultComponent: result });

                })
            } else {
                this.setState({ ResultComponent: loaderResult as React.ComponentType<T> });
            }
        }

        render() {
            if (this.state.ResultComponent) {
                return <this.state.ResultComponent />
            }
            return <loadableProps.loading />
        }
    }
}

