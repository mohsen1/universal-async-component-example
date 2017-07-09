import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

declare var module: NodeModule & { hot: any };

const render = (Component) => {
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

