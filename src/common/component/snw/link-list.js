import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {AutoSizer, Table, Column} from 'react-virtualized';
import {Checkbox, Icon, Popover, Button} from 'antd';
// import LinkPopover from './link-popover';
// import RlatPopover from './rlat-popover';
// import WgtPopover from './wgt-popover';
import {WGT_RNG} from 'common/constant';
import 'common/style/snw/link-list.less';

@inject('snw', 'link')
@observer
class LinkList extends Component {
    constructor(props) {
        super(props);
        this.selectedNum = 0;
        this.totalNum = 0;
        this.setOptions(props);
    }

    componentWillReact() {
        this.setOptions(this.props);
    }

    setOptions = ({snw: {links}}) => {
        let selectedNum = 0;
        links.forEach(item => {
            if(!item.hidden) {
                selectedNum++;
            }
        });
        this.totalNum = links.length;
        this.selectedNum = selectedNum;
    }

    selectChg = (chgIds, selected) => {
        const {snw} = this.props;
        snw.worker.postMessage({
            type: 'link_select_chg',
            payload: {
                chgIds,
                selected,
                nodes: toJS(snw.nodes),
                links: toJS(snw.links),
                node_map: snw.node_map,
                link_map: snw.link_map,
                link_types: toJS(snw.link_types),
                rlats: toJS(snw.rlats)
            }
        });
    }

    onSelectRow = (e, id) => {
        const hidden = !e.target.checked;
        const {snw, link_map} = this.props;
        const {links} = snw;
        const chgIds = [];
        for(let i = 0, len = links.length; i < len; i++) {
            if(links[i].id == id) {
                chgIds.push(id);
                links[i].hidden = hidden;
                break;
            }
        }
        snw.links = toJS(links);
        this.selectChg(chgIds, !hidden);
    }

    onSelectRows = (e) => {
        const hidden = !e.target.checked;
        const {snw} = this.props;
        const {links} = snw;
        const chgIds = [];
        links.forEach(link => {
            if(link.hidden !== hidden) {
                chgIds.push(link.id);
            }
            link.hidden = hidden;
        });
        snw.links = toJS(links);
        this.selectChg(chgIds, !hidden);
    }

    onCheck = (record) => {
        const {link} = this.props;
        link.update({
            visible: true,
            active_link: record
        });
    }

    onFilter = () => {
        const {snw} = this.props;
        snw.worker.postMessage({
            type: 'filter',
            payload: {
                nodes: toJS(snw.nodes),
                links: toJS(snw.links),
                show_label: snw.show_label,
                sel_rlat_map: snw.sel_rlat_map,
                wgts: toJS(snw.wgts),
                wgt_rng: WGT_RNG,
                sel_link_type_map: snw.sel_link_type_map,
                link_types: toJS(snw.link_types),
                rlats: toJS(snw.rlats)
            }
        });
    }

    getColumnWidth = (totalWidth) => {
        const widths = [];
        if(totalWidth > 0) {
            totalWidth -= 40;
            widths.push(40);
        } else {
            totalWidth = 0;
            widths.push(0);
        }
        const ratios = [5/12, 3/12, 2/12, 2/12];
        let curWidth = 0;
        ratios.forEach((ratio, index) => {
            const width = Math.round(totalWidth * ratio);
            curWidth += width;
            if(index === (ratio.length - 1)) {
                widths.push(totalWidth - curWidth);
            } else {
                widths.push(width);
            }
        });
        return widths;
    }

    getSelectLabel = () => {
        const checked = this.selectedNum > 0 && this.selectedNum === this.totalNum;
        const indeterminate = this.selectedNum > 0 && this.selectedNum < this.totalNum;
        return (
            <Checkbox checked={checked} indeterminate={indeterminate} onChange={(e) => this.onSelectRows(e)}/>
        );
    }

    getLinkLabel = () => {
        return (
            <div className="link-label">
                <div className="m-title">Link</div>
                {
                    /*
                        <div className="m-extra">
                            <LinkPopover onFilter={this.onFilter}/>
                        </div>
                    */
                }
            </div>
        );
    }

    getRlatLabel = () => {
        return (
            <div className="rlat-label" ref="rlat-label">
                <div className="m-title">Relationship</div>
                {
                    /*
                        <div className="m-extra">
                            <RlatPopover onFilter={this.onFilter}/>
                        </div>
                    */
                }
            </div>
        );
    }

    getWgtLabel = () => {
        return (
            <div className="wgt-label">
                <div className="m-title">Evidence level</div>
                {
                    /*
                        <div className="m-extra">
                            <WgtPopover onFilter={this.onFilter}/>
                        </div>
                    */
                }
            </div>
        );
    }

    selectRender = ({rowData: {id, hidden}}) => {
        return (<Checkbox checked={!hidden} onChange={(e) => this.onSelectRow(e, id)}/>);
    }

    noRowsRender = () => {
        return (<div className="no-data-tip">No data</div>);
    }

    linkRender = ({rowData}) => {
        const icon_source = <span className="node-type" style={{backgroundImage: 'url(' + require(`../../image/${rowData.sourceType}-1.png`) + ')'}}></span>;
        const icon_target = <span className="node-type" style={{backgroundImage: 'url(' + require(`../../image/${rowData.targetType}-1.png`) + ')'}}></span>;
        const arrow = rowData.direction === 'two-way' ? '<--->' : '---->';
        return (
            <div className="link-cell" title={rowData.sourceName + ' ' + arrow + ' ' + rowData.targetName}>
                <div className="col-l">
                    {icon_source}<span className="node-text f-toe1">{rowData.sourceName}</span>
                </div>
                <div className="col-m">
                    {arrow}
                </div>
                <div className="col-r">
                    <span className="node-text f-toe1">{rowData.targetName}</span>
                    {icon_target}
                </div>
            </div>
        );
    }

    actionRender = ({rowData}) => {
        return(
            rowData.otid
            ?   <Icon type="eye-o" onClick={() => this.onCheck(rowData)}/>
            :   null
        );
    }

    render() {
        const {snw: {links}} = this.props;
        return (
            <div className="link-list" ref="link-list">
                <AutoSizer>
                    {({width, height}) => {
                       const widths = this.getColumnWidth(width);
                       return (
                            <Table
                                headerHeight={40}
                                width={width}
                                height={height}
                                rowHeight={40}
                                rowCount={links.length}
                                overscanRowCount={5}
                                rowGetter={({index}) => links[index]}
                                noRowsRenderer={this.noRowsRender}
                            >
                                <Column
                                    label={this.getSelectLabel()}
                                    dataKey="hidden"
                                    width={widths[0]}
                                    cellRenderer={this.selectRender}
                                />
                                <Column
                                    label={this.getLinkLabel()}
                                    dataKey=""
                                    width={widths[1]}
                                    cellRenderer={this.linkRender}
                                />
                                <Column
                                    label={this.getRlatLabel()}
                                    dataKey="relation"
                                    width={widths[2]}
                                />
                                <Column
                                    label={this.getWgtLabel()}
                                    dataKey="weight"
                                    width={widths[3]}
                                />
                                <Column
                                    label="Action"
                                    dataKey=""
                                    width={widths[4]}
                                    cellRenderer={this.actionRender}
                                />
                           </Table>
                       );
                    }}
                </AutoSizer>
            </div>
        );
    }
}

export default LinkList;
