import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {Dropdown, Menu, Avatar, Icon} from 'antd';

const MenuItem = Menu.Item;

@inject('glbl', 'layout')
@observer
class Header extends Component {
    toggleSider = () => {
        const {layout} = this.props;
        layout.update({
            fold_sidebar: !layout.fold_sidebar
        });
    }

    onUserMenuClick = (e) => {
        if(e.key === 'logout') {
            this.doLogout();
        }
    }

    getUserMenu = () => {
        return (
            <Menu>
                <MenuItem key="logout" onClick={this.onUserMenuClick}>
                    <Icon type="logout"/>
                    logout
                </MenuItem>
            </Menu>
        );
    }

    doLogout() {
        const {glbl} = this.props;
        glbl.doLogout();
    }

    render() {
        const {glbl: {user}, layout: {fold_sidebar}} = this.props;
        return (
            <div className="g-hd">
                <div className="toggle-sider-btn" onClick={this.toggleSider}>
                    <Icon type={fold_sidebar ? 'menu-unfold' : 'menu-fold'}/>
                </div>
                <div className="col-r f-fr">
                    {
                        user.id ?
                        <Dropdown overlay={this.getUserMenu()}>
                            <span className="account">
                                <Avatar icon="user" size="small"/>
                                <span className="account-name">{user.username}</span>
                            </span>
                        </Dropdown> :
                        null
                    }
                </div>
            </div>
        );
    }
}

export default Header;
