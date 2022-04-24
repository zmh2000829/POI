import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Form, Input, Icon, Button} from 'antd';
import {observer, inject} from 'mobx-react';
import 'common/style/login.less';

const FormItem = Form.Item;

@inject('glbl')
@observer
class Login extends Component {
    getUsernamePrefix() {
        return (
            <Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>
        );
    }

    getPassWordPrefix() {
        return (
            <Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>
        );
    }

    doLogin = () => {
        const {glbl: {doLogin}, form: {validateFields}} = this.props;
        validateFields((err, values) => {
            if(err) {
                return;
            }
            doLogin(values);
        });
    }

    render() {
        const {glbl: {loading, user}, form: {getFieldDecorator}} = this.props;
        if(user.id) {
            const {from} = this.props.location.state || {from: {pathname: '/'}};
            return (<Redirect to={from}/>);
        }
        return (
            <div className="login">
                <div className="m-hd">
                    <span className="logo"></span>
                    <strong className="name">PGI</strong>
                </div>
                <Form>
                    <FormItem>
                        {
                            getFieldDecorator('username', {
                                initialValue: null,
                                rules: [{ required: true, message: 'Please input your username!' }]
                            })(
                                <Input prefix={this.getUsernamePrefix()} placeholder="Username" size="large"/>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator('password', {
                                initialValue: null,
                                rules: [{ required: true, message: 'Please input your password!' }]
                            })(
                                <Input prefix={this.getPassWordPrefix()} type="password" placeholder="Password" size="large"/>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" className="submit-btn" size="large" loading={loading} onClick={this.doLogin}>Sign in</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(Login);
