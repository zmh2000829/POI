import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {AutoSizer, List} from 'react-virtualized';
import {Slider, Button, Checkbox, Row, Col} from 'antd';
import {WGT_RNG} from 'common/constant';

import 'common/style/snw/filter-layer.less';

@inject('snw')
@observer
class FilterLayer extends Component {
    constructor(props) {
        super(props);
        this.selectedLinkNum = 0;
        this.totalLinkNum = 0;
        this.selectedRlatNum = 0;
        this.totalRlatNum = 0;

        this.setOptions(props);
    }

    componentWillReact() {
        this.setOptions(this.props);
    }

    setOptions = ({snw: {link_types, rlats}}) => {
        let selectedLinkNum = 0;
        let selectedRlatNum = 0;
        link_types.forEach(item => {
            if(item.selected) {
                selectedLinkNum++;
            }
        });
        rlats.forEach(item => {
            if(item.selected) {
                selectedRlatNum++;
            }
        });
        this.selectedLinkNum = selectedLinkNum;
        this.totalLinkNum = link_types.length;
        this.selectedRlatNum = selectedRlatNum;
        this.totalRlatNum = rlats.length;
    }

    onLinkSelect = (e, type) => {
        const {snw: {link_types, sel_link_type_map}} = this.props;
        const checked = e.target.checked;
        if(checked) {
            sel_link_type_map[type] = true;
        } else {
            delete sel_link_type_map[type];
        }
        for(let i = 0, len = link_types.length; i < len; i++) {
            if(link_types[i].name === type) {
                link_types.splice(i, 1, {...link_types[i], selected: checked});
                break;
            }
        }
    }

    onLinkSelectAll = (e) => {
        const snw = this.props.snw;
        let {link_types, sel_link_type_map} = snw;
        link_types = toJS(link_types);
        const checked = e.target.checked;
        if(checked) {
            for(let key in sel_link_type_map) {
                sel_link_type_map[key] = checked;
            }
        } else {
            snw.sel_link_type_map = {};
        }
        for(let i = 0, len = link_types.length; i < len; i++) {
            link_types[i].selected = checked;
        }
        snw.link_types = link_types;
    }

    onRlatSelect = (e, rlat) => {
        const {snw: {rlats, sel_rlat_map}} = this.props;
        const checked = e.target.checked;
        if(checked) {
            sel_rlat_map[rlat] = true;
        } else {
            delete sel_rlat_map[rlat];
        }
        for(let i = 0, len = rlats.length; i < len; i++) {
            if(rlats[i].name === rlat) {
                rlats.splice(i, 1, {...rlats[i], selected: checked});
                break;
            }
        }
    }

    onRlatSelectAll = (e) => {
        const snw = this.props.snw;
        let {rlats, sel_rlat_map} = snw;
        rlats = toJS(rlats);
        const checked = e.target.checked;
        if(checked) {
            for(let key in sel_rlat_map) {
                sel_rlat_map[key] = checked;
            }
        } else {
            snw.sel_rlat_map = {};
        }
        for(let i = 0, len = rlats.length; i < len; i++) {
            rlats[i].selected = checked;
        }
        snw.rlats = rlats;
    }

    onWgtChg = (value) => {
        const {snw} = this.props;
        snw.wgts = value;
    }

    onFilter = () => {
        const {snw} = this.props;
        snw.worker.postMessage({
            type: 'filter',
            payload: {
                nodes: snw.orign.nodes,
                links: snw.orign.links,
                show_label: snw.show_label,
                wgts: toJS(snw.wgts),
                wgt_rng: WGT_RNG,
                sel_link_type_map: snw.sel_link_type_map,
                link_types: toJS(snw.link_types),
                sel_rlat_map: snw.sel_rlat_map,
                rlats: toJS(snw.rlats)
            }
        });
    }

    onClear = () => {
        const {snw} = this.props;
        const link_types = toJS(snw.link_types);
        const rlats = toJS(snw.rlats);
        for(let i = 0; i < link_types.length; i++) {
            link_types[i].selected = false;
            link_types[i].current = 0;
        }
        for(let i = 0; i < rlats.length; i++) {
            rlats[i].selected = false;
            rlats[i].current = 0;
        }
        snw.update({
            link_types,
            rlats,
            redraw: true,
            wgts: WGT_RNG,
            sel_link_type_map: {},
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



    render() {
        let {snw: {link_types, rlats, wgts}} = this.props;
        rlats = toJS(rlats);
        const linksChecked = this.selectedLinkNum > 0 && this.selectedLinkNum === this.totalLinkNum;
        const linksIndeterminate = this.selectedLinkNum > 0 && this.selectedLinkNum < this.totalLinkNum;
        const rlatsChecked = this.selectedRlatNum > 0 && this.selectedRlatNum === this.totalRlatNum;
        const rlatsIndeterminate = this.selectedRlatNum > 0 && this.selectedRlatNum < this.totalRlatNum;
        return (
            <div className="snw-filter-layer">
                <div className="block-link">
                    <div className="block-hd"><Checkbox indeterminate={linksIndeterminate} checked={linksChecked} onChange={(e) => this.onLinkSelectAll(e)}/>Link</div>
                    <div className="block-bd">
                        <ul className="list">
                            {
                                link_types.map((item) => {
                                    return (
                                        <li key={item.name} className="item f-toe1">
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
                    </div>
                </div>
                <div className="block-rlat">
                    <div className="block-hd"><Checkbox indeterminate={rlatsIndeterminate} checked={rlatsChecked} onChange={(e) => this.onRlatSelectAll(e)}/>Relationship</div>
                    <div className="block-bd">
                        <AutoSizer>
                            {({width, height}) => {
                                return (
                                    <List
                                        width={width}
                                        height={height}
                                        rowHeight={36}
                                        rowCount={rlats.length}
                                        rowRenderer={({key, index, style}) => {
                                            return (
                                                <div key={key} style={style} className="rlat-item f-toe1">
                                                    <Checkbox checked={rlats[index].selected} onChange={(e) => this.onRlatSelect(e, rlats[index].name)}></Checkbox>
                                                    <span className="name f-toe1" title={rlats[index].name}>{rlats[index].name}</span>
                                                    <span className="count">
                                                        (<span className={['current', rlats[index].current > 0 ? 'not-empty' : ''].join(' ')}>{rlats[index].current}</span>&nbsp;|&nbsp;<span className="total">{rlats[index].total}</span>)
                                                    </span>
                                                </div>
                                            );
                                        }}
                                    />
                                );
                            }}
                        </AutoSizer>
                    </div>
                </div>
                <div className="block-level">
                    <div className="block-hd">Level</div>
                    <div className="block-bd">
                        <Slider
                            range
                            min={WGT_RNG[0]}
                            max={WGT_RNG[1]}
                            step={0.1}
                            value={toJS(wgts)}
                            onChange={this.onWgtChg}
                            onAfterChange={this.onAfterChange}
                        />
                    </div>
                </div>
                <div className="block-btn">
                    <Button size="small" type="primary" className="btn-filter" onClick={this.onFilter}>Filter</Button>
                    <Button size="small" className="btn-clear" onClick={this.onClear}>Clear</Button>
                </div>
            </div>
        );
    }
}

export default FilterLayer;
