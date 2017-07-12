import * as React from 'react';
import { Route, Link } from 'react-router-dom';

import Loadable, { LoadingComponentProps } from 'react-loadable';
import Welcome from 'components/Welcome';

const Loading = ({ isLoading }: LoadingComponentProps) => <div>Loading...{isLoading}</div>;

const LoadableCounter = Loadable({
    loader: () => import('components/Counter'),
    loading: Loading,
});

export default class App extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    <li><Link to={'/'}>Home</Link></li>
                    <li><Link to={'/counter'}>Counter</Link></li>
                </ul>
                <Route exact path={'/'} component={Welcome} />
                <Route exact path={'/counter'} component={LoadableCounter} />
            </div>
        );
    }
}

