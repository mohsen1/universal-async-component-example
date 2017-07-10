import * as React from 'react';
import { Route, Link } from 'react-router-dom';

import { Welcome, Counter } from 'components';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    <li><Link to={'/'}>Home</Link></li>
                    <li><Link to={'/counter'}>Counter</Link></li>
                </ul>
                <Route exact path={'/'} component={Welcome} />
                <Route exact path={'/counter'} component={Counter} />
            </div>
        );
    }
}

