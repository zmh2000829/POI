import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {reaction} from 'mobx';
import {observer, inject} from 'mobx-react';
import {ROUTER_PATHS} from 'common/constant';
import Login from './login';
import Layout from './layout';

const PrivateRoute = ({component: Component, authed, ...rest}) => {
    const render = function(props) {
        return (
            authed === true ?
            <Component {...props}/> :
            <Redirect to={{pathname: ROUTER_PATHS.LOGIN, state: {from: props.location}}}/>
        );
    };
    return (
        <Route {...rest} render={render}/>
    );
}

@inject('glbl')
@observer
class Index extends React.Component {

    componentDidMount() {
        const {glbl: {user}, history} = this.props;
        reaction(
            () => user.id,
            (id) => {
                if(!id) {
                    history.push(ROUTER_PATHS.LOGIN);
                }
            }
        );
    }

    render() {
        const {glbl: {user}} = this.props;
        const authed = !user.id;
        return (
            <div style={{width: '100%', height: '100%'}}>
                <Switch>
                    <Route path={ROUTER_PATHS.LOGIN} component={Login}/>
                    <PrivateRoute authed={authed} path="/" component={Layout}/>
                </Switch>
            </div>
        );
    }
}

export default Index;
