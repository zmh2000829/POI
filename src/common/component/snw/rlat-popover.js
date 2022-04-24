import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {List} from 'react-virtualized';
import {Checkbox, Button, Icon, Popover} from 'antd';
import {WGT_RNG} from 'common/constant';

@inject('snw')
@observer
class RlatPopover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    onVisibleChange = (visible) => {
        this.setState({visible});
    }

    onSelect = (e, rlat) => {
        const {snw: {rlats, sel_rlat_map}} = this.props;
        const checked = e.target.checked;
        for(let i = 0, len = rlats.length; i < len; i++) {
            if(rlats[i].name === rlat) {
                rlats.splice(i, 1, {...rlats[i], selected: checked});
                break;
            }
        }
        if(checked) {
            sel_rlat_map[rlat] = true;
        } else {
            delete sel_rlat_map[rlat];
        }
    }

    onClear = () => {
        const {snw} = this.props;
        const node_types = toJS(snw.node_types);
        const link_types = toJS(snw.link_types);
        const rlats = toJS(snw.rlats);
        for(let i = 0; i < node_types.length; i++) {
            node_types[i].current = 0;
        }
        for(let i = 0; i < link_types.length; i++) {
            link_types[i].current = 0;
        }
        for(let i = 0, len = rlats.length; i < len; i++) {
            rlats[i].selected = false;
            rlats[i].current = 0;
        }

        snw.update({
            node_types,
            link_types,
            rlats,
            sel_rlat_map: {},
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
        const {snw: {rlats}} = this.props;
        const height = rlats.length > 5 ? 5 * 36 : rlats.length * 36;
        return (
            <div>
                <List
                    width={240}
                    height={height}
                    rowCount={rlats.length}
                    rowHeight={36}
                    rowRenderer={({key, index, style}) => {
                        return (
                            <div key={key} style={style} className="rlat-item">
                                <Checkbox checked={rlats[index].selected} onChange={(e) => this.onSelect(e, rlats[index].name)}></Checkbox>
                                <span className="name f-toe1" title={rlats[index].name}>{rlats[index].name}</span>
                                <span className="count">
                                    (<span className={['current', rlats[index].current > 0 ? 'not-empty' : ''].join(' ')}>{rlats[index].current}</span>&nbsp;|&nbsp;<span className="total">{rlats[index].total}</span>)
                                </span>
                            </div>
                        );
                    }}
                />
                <div className="action-wrap">
                    <Button size="small" onClick={this.onClear}>Clear</Button>
                    <Button size="small" onClick={this.onOk}>OK</Button>
                </div>
            </div>
        );
    }

    isActive = () => {
        const {snw: {sel_rlat_map}} = this.props;
        if(!_.isEmpty(sel_rlat_map)) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <Popover
                overlayClassName="rlat-popover"
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

export default RlatPopover;
