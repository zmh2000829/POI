import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {AutoSizer, Table, Column} from 'react-virtualized';
import {Checkbox, Icon} from 'antd';

@inject('meta')
@observer
class NodeList extends Component {
    constructor(props) {
        super(props);
        this.selectedNum = 0;
        this.totalNum = 0;
        this.setOptions(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setOptions(nextProps);
    }

    setOptions = ({nodes}) => {
        let selectedNum = 0;
        nodes.forEach(item => {
            if(!item.hidden) {
                selectedNum++;
            }
        });
        this.totalNum = nodes.length;
        this.selectedNum = selectedNum;
    }

    onCheck = (record) => {
        const {meta} = this.props;
        meta.update({
            visible: true,
            active_meta: record
        });
    }

    onSelectRow = (e, id) => {
        const hidden = !e.target.checked;
        const {type, nodes, updateNode, selectChg} = this.props;
        const chgIds = [];
        for(let i = 0, len = nodes.length; i < len; i++) {
            if(nodes[i].id == id) {
                chgIds.push(id);
                nodes[i].hidden = hidden;
                updateNode(type, i, nodes[i]);
                break;
            }
        }
        selectChg(type, chgIds, !hidden);
    }

    onSelectRows = (e) => {
        const hidden = !e.target.checked;
        const {type, nodes, updateNodes, selectChg} = this.props;
        const chgIds = [];
        nodes.forEach(node => {
            if(node.hidden !== hidden) {
                chgIds.push(node.id);
            }
            node.hidden = hidden;
        });
        updateNodes(type, nodes);
        selectChg(type, chgIds, !hidden);
    }

    getSelectLabel = () => {
        const checked = this.selectedNum > 0 && this.selectedNum === this.totalNum;
        const indeterminate = this.selectedNum > 0 && this.selectedNum < this.totalNum;
        return (
            <Checkbox checked={checked} indeterminate={indeterminate} onChange={(e) => this.onSelectRows(e)}/>
        );
    }

    selectRender = ({rowData: {id, hidden}}) => {
        return (<Checkbox checked={!hidden} onChange={(e) => this.onSelectRow(e, id)}/>);
    }

    noRowsRender = () => {
        return (
            <div className="no-data-tip">No data</div>
        );
    }

    nameRender = ({rowData}) => {
        const {onClickNode} = this.props;
        return (
            <span
                className="name-cell"
                title={rowData.name}
                onClick={() => onClickNode(rowData.id)}
            >
                {rowData.name}
            </span>
        );
    }

    actionRender = ({rowData}) => {
        return (
            rowData.metaid
            ?   <Icon type="eye-o" onClick={() => this.onCheck(rowData)}/>
            :   null
        );
    }

    render() {
        const {type, nodes} = this.props;
        return (
            <div className="snw-node-list">
                <AutoSizer>
                    {({width, height}) => {
                        return (
                            <Table
                                headerHeight={40}
                                width={width}
                                height={height}
                                rowHeight={40}
                                rowCount={nodes.length}
                                overscanRowCount={5}
                                rowGetter={({index}) => nodes[index]}
                                noRowsRenderer={this.noRowsRender}
                            >
                                <Column
                                    label={this.getSelectLabel()}
                                    dataKey="hidden"
                                    width={20}
                                    cellRenderer={this.selectRender}
                                />
                                <Column
                                    label="Name"
                                    dataKey="name"
                                    width={300}
                                    cellRenderer={this.nameRender}
                                />
                                <Column
                                    label="Action"
                                    dataKey=""
                                    width={80}
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

export default NodeList;
