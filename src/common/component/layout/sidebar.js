import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import {Menu, Icon} from 'antd';
import {MENUS} from 'common/constant';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

@inject('layout')
@observer
class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.topKeys = MENUS.map(item => item.key);
        this.allKeys = this.getAllKeys(MENUS);
        this.state = {
            openKeys: this.getOpenKeys(props.location)
        };
    }

    componentWillReceiveProps(nextProps) {
        const {location, layout: {fold_sidebar}} = nextProps;
        if(fold_sidebar) {
            this.setState({
                openKeys: []
            });
        } else {
            if(_.isEmpty(this.state.openKeys)) {
                this.setState({
                    openKeys: this.getOpenKeys(location)
                });
            }
        }
    }

    onMenuOpenChg = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if(this.topKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : []
            });
        }
    }

    getPathArray = ({pathname}) => {
        return pathname.substr(1).split('/');
    }

    getMenus = (fold_sidebar, items, parentPath = '/') => {
        return items.map(item => {
            const path = parentPath + item.key;
            const key = path.substr(1).replace(/\//g, '-');
            this.allKeys.push(key);
            if(item.children) {
                return (
                    <SubMenu
                        key={key}
                        title={
                            <span>
                                <Icon type={item.icon}/>
                                <span>{item.label}</span>
                            </span>
                        }
                    >
                        {this.getMenus(fold_sidebar, item.children, path + '/')}
                    </SubMenu>
                );
            } else {
                return (
                    <MenuItem key={key}>
                        <Link to={path}>
                            <Icon type={item.icon}/>
                            <span>{item.label}</span>
                        </Link>
                    </MenuItem>
                );
            }
        });
    }

    getKeysFormLocation = (location) => {
        const arr_1 = this.getPathArray(location);
        const arr_2 = [];
        for(let i = 0, len = arr_1.length; i < len; i++) {
            i > 0 ? arr_2.push(arr_2[i - 1] + '-' + arr_1[i]) : arr_2.push(arr_1[i]);
        }
        return arr_2;
    }

    getAllKeys = (items, parentKey = '') => {
        const res = [];
        for(let i = 0, len = items.length; i < len; i++) {
            const key = parentKey + items[i].key;
            res.push(key);
            if(items[i].children) {
                res.push(...this.getAllKeys(items[i].children, key + '-'));
            }
        }
        return res;
    }

    getOpenKeys = (location) => {
        const keys = this.getKeysFormLocation(location);
        return _.dropRight(keys, 1);
    }

    getSelectedKeys = (location) => {
        const keys = this.getKeysFormLocation(location);
        const arr_1 = _.difference(keys, this.allKeys);
        const arr_2 = _.difference(keys, arr_1);
        return [_.last(arr_2)];
    }

    render() {
        const {location, layout: {fold_sidebar}} = this.props;
        const {openKeys} = this.state;
        return (
            <div className="g-sd">
                <div className="m-hd">
                    <span className="logo"></span>
                    {fold_sidebar ? undefined : <strong className="name">PreMedKB-POI</strong>}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    inlineCollapsed={fold_sidebar}
                    onOpenChange={this.onMenuOpenChg}
                    openKeys={openKeys}
                    selectedKeys={this.getSelectedKeys(location)}

                >
                    {this.getMenus(fold_sidebar, MENUS)}
                </Menu>
            </div>
        );
    }
}

export default withRouter(Sidebar);
