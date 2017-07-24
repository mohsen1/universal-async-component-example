import * as React from 'react';
import { Route, Link } from 'react-router-dom';

import Welcome from 'components/Welcome';

import { getComponentAsync } from 'universal-async-component';
import { Loading } from './Loading'

const AsyncCounter = getComponentAsync({
    exportKey: 'Counter',
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
                <Route exact path={'/counter'} component={AsyncCounter} />
            </div>
        );
    }
}

