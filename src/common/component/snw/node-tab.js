import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Tabs} from 'antd';
import NodeList from './node-list';
import 'common/style/snw/node-tab.less';

const TabPane = Tabs.TabPane;

@inject('snw')
@observer
class NodeTab extends Component {
    constructor(props) {
        super(props);
    }

    onClickNode = (id) => {
        const {snw} = this.props;
        snw.graph.onBlurNode({node: this.clickId});
        if(this.clickId === id) {
            this.clickId = null;
        } else {
            snw.graph.onHoverNode({node: id});
            snw.graph.visNw.focus(id, {
                animation: {
                    duration: 600,
                    easingFunction: 'linear'
                }
            });
            this.clickId = id;
        }
    }

    updateNode = (type, index, node) => {
        const {snw} = this.props;
        snw[type + 's'][index] = toJS(node);
    }

    updateNodes = (type, nodes) => {
        const {snw} = this.props;
        snw[type + 's'] = toJS(nodes);
    }

    selectChg = (type, chgIds, selected) => {
        const {snw} = this.props;
        snw.worker.postMessage({
            type: 'node_select_chg',
            payload: {
                type,
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

    render() {
        const {snw: {variants, diseases, drugs, genes}, history} = this.props;
        const listProps = {
            history,
            onClickNode: this.onClickNode,
            updateNode: this.updateNode,
            updateNodes: this.updateNodes,
            selectChg: this.selectChg
        };
        return (
            <Tabs className="snw-node-tab">
                <TabPane key="1" tab={<span>Variant ({variants.length})</span>}>
                    <NodeList type="variant" nodes={variants} {...listProps}/>
                </TabPane>
                <TabPane key="2" tab={<span>Disease ({diseases.length})</span>}>
                    <NodeList type="disease" nodes={diseases} {...listProps}/>
                </TabPane>
                <TabPane key="3" tab={<span>Drug ({drugs.length})</span>}>
                    <NodeList type="drug" nodes={drugs} {...listProps}/>
                </TabPane>
                <TabPane key="4" tab={<span>Gene ({genes.length})</span>}>
                    <NodeList type="gene" nodes={genes} {...listProps}/>
                </TabPane>
            </Tabs>
        );
    }
}

export default NodeTab;
