import * as React from 'react';
import { Route, Link, RouteComponentProps } from 'react-router-dom';

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

class Counter extends React.Component<{} & RouteComponentProps<{}>, {count: number;}> {
    state = { count: 0 };
    increment = () => {
        this.setState({ count: this.state.count + 1 });
    }
    render() {
        return (<div onClick={this.increment}>{this.state.count}</div>);
    }
}

class Welcome extends React.Component<RouteComponentProps<{}>> {
    render() {
        return (<h1>Welcome!</h1>);
    }
}
