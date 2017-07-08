import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';

const AppContainer = require('react-hot-loader').AppContainer;

const render = (Component) => {
    ReactDOM.render(
        React.createElement(AppContainer, null, React.createElement(Component)),
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

