import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './components/App';

const render = (Component) => {
    ReactDOM.render(
        <AppContainer><Component /></AppContainer>,
        document.getElementById('root')
    );
}

render(App);

declare var module: NodeModule & { hot: any };

if (module.hot) {
    module.hot.accept('./components/App.tsx', () => {
        render(require('./components/App.tsx'));
    });
}

