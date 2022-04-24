import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Popover, Icon, Button, Checkbox} from 'antd';

@inject('snw')
@observer
class LinkPopover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    onVisibleChange = (visible) => {
        this.setState({visible});
    }

    onNodeSelect = (e, type) => {
        const {snw: {node_types, sel_node_type_map}} = this.props;
        const checked = e.target.checked;
        for(let i = 0, len = node_types.length; i < len; i++) {
            if(node_types[i].name === type) {
                node_types.splice(i, 1, {...node_types[i], selected: checked});
                break;
            }
        }
        if(checked) {
            sel_node_type_map[type] = true;
        } else {
            delete sel_node_type_map[type];
        }
    }

    onLinkSelect = (e, type) => {
        const {snw: {link_types, sel_link_type_map}} = this.props;
        const checked = e.target.checked;
        for(let i = 0, len = link_types.length; i < len; i++) {
            if(link_types[i].name === type) {
                link_types.splice(i, 1, {...link_types[i], selected: checked});
                break;
            }
        }
        if(checked) {
            sel_link_type_map[type] = true;
        } else {
            delete sel_link_type_map[type];
        }
    }

    onClear = () => {
        const {snw} = this.props;
        const node_types = toJS(snw.node_types);
        const link_types = toJS(snw.link_types);
        const rlats = toJS(snw.rlats);
        for(let i = 0; i < node_types.length; i++) {
            node_types[i].selected = false;
            node_types[i].current = 0;
        }
        for(let i = 0; i < link_types.length; i++) {
            link_types[i].selected = false;
            link_types[i].current = 0;
        }
        for(let i = 0, len = rlats.length; i < len; i++) {
            rlats[i].current = 0;
        }

        snw.update({
            node_types,
            link_types,
            rlats,
            sel_node_type_map: {},
            sel_link_type_map: {},
            nodes: [],
            links: [],
            variants: [],
            diseases: [],
            drugs: [],
            genes: [],
            node_map: {},
            link_map: {}
        });
    }

    onOk = () => {
        this.props.onFilter();
    }

    getContent = () => {
        const {snw: {node_types, link_types}} = this.props;
        return (
            <div className="f-cb">
                <ul className="list-l f-fl">
                    {
                        node_types.map((item, index) => {
                            return (
                                <li key={item.name} className="item">
                                    <Checkbox checked={item.selected} onChange={(e) => this.onNodeSelect(e, item.name)}/>
                                    <span className="name">{item.name}</span>
                                    <span className="count">
                                        (<span className={['current', item.current > 0 ? 'not-empty' : ''].join(' ')}>{item.current}</span>&nbsp;|&nbsp;<span className="total">{item.total}</span>)
                                    </span>
                                </li>
                            );
                        })
                    }
                </ul>
                <ul className="list-r f-fl">
                    {
                        link_types.map((item, index) => {
                            return (
                                <li key={item.name} className="item">
                                    <Checkbox checked={item.selected} onChange={(e) => this.onLinkSelect(e, item.name)}/>
                                    <span className="name">{item.name}</span>
                                    <span className="count">
                                        (<span className={['current', item.current > 0 ? 'not-empty' : ''].join(' ')}>{item.current}</span>&nbsp;|&nbsp;<span className="total">{item.total}</span>)
                                    </span>
                                </li>
                            );
                        })
                    }
                </ul>
                <div className="action-wrap">
                    <Button size="small" onClick={this.onClear}>Clear</Button>
                    <Button size="small" onClick={this.onOk}>OK</Button>
                </div>
            </div>
        );
    }

    isActive = () => {
        const {snw: {sel_node_type_map, sel_link_type_map}} = this.props;
        if(!_.isEmpty(sel_node_type_map) || !_.isEmpty(sel_link_type_map)) {
            return true;
        }
        return false
    }

    render() {
        return (
            <Popover
                overlayClassName="link-popover"
                placement="bottom"
                trigger="click"
                content={this.getContent()}
                visible={this.state.visible}
                onVisibleChange={this.onVisibleChange}
            >
                <Icon type="filter" className={this.isActive() ? 'active' : ''}/>
            </Popover>
        );
    }
}

export default LinkPopover;
