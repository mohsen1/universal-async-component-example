import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export class Welcome extends React.Component<RouteComponentProps<{}>> {
    render() {
        return (<h1>Welcome</h1>);
    }
}
