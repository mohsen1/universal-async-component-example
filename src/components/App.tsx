import * as React from 'react';
import { Route, Link } from 'react-router-dom';

import Welcome from 'components/Welcome';

import { Loadable } from './Loadable'
import { Loading } from './Loading'

const LoadableCounter = Loadable({
    loader: () => {
        const moduleId = require.resolveWeak('components/Counter');
        if (__webpack_modules__[moduleId]) {
            if (global.__webpack_report_dynamic_module__) {
                global.__webpack_report_dynamic_module__(moduleId)
            }
            const moduleObject = __webpack_require__(moduleId);
            return moduleObject.Counter;
        }

        return import('components/Counter').then(ns => ns.Counter)
    },
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

