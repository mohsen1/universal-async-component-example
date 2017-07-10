import * as React from 'react';

export default class App extends React.Component<{}, {count: number;}> {
    state = { count: 0 };

    render() {
        return (
            <div
                style={{fontSize: '5em', color: 'red'}}
                onClick={() => this.setState({count: this.state.count + 1})}
            >
                {this.state.count}
            </div>
        );
    }
}
