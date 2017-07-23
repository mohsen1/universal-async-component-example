import * as React from 'react';
import { Route, Link } from 'react-router-dom';

import Welcome from 'components/Welcome';

import { getComponentAsync } from 'UniversalAsyncComponent/getComponentAsync'
import { Loading } from './Loading'

const AsyncCounter = getComponentAsync({
    exportKey: 'Counter',
    asyncLoader: () => {
        const id = require.resolveWeak('components/Counter');
        if (__webpack_modules__[id]) {
             if (global.__webpack_report_dynamic_module__) {
                global.__webpack_report_dynamic_module__!(id);
             }
             return __webpack_require__(id);
        }
        return import('components/Counter')
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
                <Route exact path={'/counter'} component={AsyncCounter} />
            </div>
        );
    }
}

