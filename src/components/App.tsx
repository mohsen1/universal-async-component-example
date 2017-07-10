import * as React from 'react';
import { Route, Link } from 'react-router-dom';

import { LoadingComponentProps } from 'react-loadable';
const Loadable = require('react-loadable');

const Loading = ({ isLoading }: LoadingComponentProps) => <div>Loading...{isLoading}</div>;

const LoadableWelcome = Loadable({
    loader: () => import('components/Welcome'),
    loading: Loading,
});

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
                <Route exact path={'/'} component={LoadableWelcome} />
                <Route exact path={'/counter'} component={LoadableCounter} />
            </div>
        );
    }
}

