import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

const render = (Component: React.StatelessComponent) => {
    ReactDOM.render(
        <AppContainer><Component /></AppContainer>,
        document.getElementById('root')
    );
}

render(require('./components/App.tsx').default);

if (module.hot) {
    module.hot.accept('./components/App.tsx', () => {
        render(require('./components/App.tsx').default);
    });
}

