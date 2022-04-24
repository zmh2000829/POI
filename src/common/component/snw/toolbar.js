import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Icon, Tooltip} from 'antd';
import 'common/style/snw/toolbar.less';

@inject('snw')
@observer
class Toolbar extends Component {
    constructor(props) {
        super(props);
        let includes = ['node', 'link', 'filter', 'word', 'restore', 'check', 'fixed', 'export', 'import', 'delete', 'full_screen'];
        if(!_.isEmpty(props.includes)) {
            includes = props.includes;
        } else if(!_.isEmpty(props.excludes)) {
            includes = _.difference(includes, props.excludes);
        }
        this.types = {};
        includes.forEach(item => {
            this.types[item] = true;
        });
    }

    toggleFilter = () => {
        const {snw} = this.props;
        const payload = {
            show_filter: !snw.show_filter
        };
        if(payload.show_filter) {
            payload.show_nodes = false;
        }
        if(!snw.filter_inited) {
            payload.filter_inited = true;
        }
        snw.update(payload);
    }

    toggleNodes = () => {
        const {snw} = this.props;
        const payload = {
            show_nodes: !snw.show_nodes
        };
        if(payload.show_nodes) {
            payload.show_filter = false;
        }
        if(!snw.nodes_inited) {
            payload.nodes_inited = true;
        }
        snw.update(payload);
    }

    toggleLinks = () => {
        const {snw} = this.props;
        const payload = {
            show_links: !snw.show_links
        };
        if(!snw.links_inited) {
            payload.links_inited = true;
        }
        snw.update(payload);
    }

    toggleWC = () => {
        const {snw} = this.props;
        snw.show_wc = !snw.show_wc;
        if(!snw.wc_inited) {
            snw.wc_inited = true;
        }
    }

    toggleLabel = () => {
        const {snw} = this.props;
        const {nodes, links} = snw;
        snw.show_label = !snw.show_label;
        if(snw.show_label) {
            nodes.forEach(node => {
                node.label = node.name;
            });
            // links.forEach(link => {
            //     link.label = link.relation + '(' + link.weight + ')';
            // });
        } else {
            nodes.forEach(node => {
                node.label = undefined;
            });
            // links.forEach(link => {
            //     link.label = undefined;
            // });
        }
        snw.updateGraph(toJS(nodes), toJS(links), {show_label: snw.show_label});
    }

    onRestore = () => {
        const {snw} = this.props;
        snw.worker.postMessage({
            type: 'reload',
            payload: {
                nodes: snw.orign.nodes,
                links: snw.orign.links,
                show_label: snw.show_label
            }
        });
    }

    onFixed = () => {
        const {snw} = this.props;
        snw.graph.fixed();
    }

    onExport = () => {
        const {snw} = this.props;
        snw.show_export_modal = true;
    }

    onImport = () => {
        const {snw} = this.props;
        snw.show_import_modal = true;
    }

    onDelete = () => {
        const {graph, worker, nodes, links, link_types, rlats} = this.props.snw;
        const visNw = graph.visNw;
        const selection = visNw.getSelection();
        const selNodeIds = selection.nodes;
        const selLinkIds = selection.edges;

        worker.postMessage({
            type: 'remove',
            payload: {
                selNodeIds,
                selLinkIds,
                nodes: toJS(nodes),
                links: toJS(links),
                link_types: toJS(link_types),
                rlats: toJS(rlats)
            }
        });
    }

    toggleFullScreen = () => {
        const {snw} = this.props;
        snw.full_screen = !snw.full_screen;
    }

    render() {
        const {snw} = this.props;
        const types = this.types;
        return (
            <div className="snw-toolbar">
                {
                    types.node
                    ? <Tooltip title="Node list"><Icon type="node" className={snw.show_nodes ? 'active' : undefined} onClick={this.toggleNodes}/></Tooltip>
                    : undefined
                }
                {
                    types.link
                    ? <Tooltip title="Relation list"><Icon type="link" className={snw.show_links ? 'active' : undefined} onClick={this.toggleLinks}/></Tooltip>
                    : undefined
                }
                {
                    types.filter
                    ? <Tooltip title="Filter"><Icon type="filter" className={snw.show_filter ? 'active' : undefined} onClick={this.toggleFilter}/></Tooltip>
                    : undefined
                }
                {
                    types.word
                    ? <Tooltip title="Hot words"><Icon type="word" className={snw.show_wc ? 'active' : undefined} onClick={this.toggleWC}/></Tooltip>
                    : undefined
                }
                {
                    types.restore
                    ? <Tooltip title="Reset"><Icon type="restore" onClick={this.onRestore}/></Tooltip>
                    : undefined
                }
                {
                    types.check
                    ? <Tooltip title="View nodes"><Icon type="eye" className={snw.show_label ? 'active' : undefined} onClick={this.toggleLabel}/></Tooltip>
                    : undefined}
                {
                    types.fixed
                    ? <Tooltip title="Fix"><Icon type="fixed" onClick={this.onFixed}/></Tooltip>
                    : undefined
                }
                {
                    types.export
                    ? <Tooltip title="Export"><Icon type="export" onClick={this.onExport}/></Tooltip>
                    : undefined
                }
                {
                    types.import
                    ? <Tooltip title="Import"><Icon type="import" onClick={this.onImport}/></Tooltip>
                    : undefined
                }
                {
                    types.delete
                    ? <Tooltip title="Delete"><Icon type="delete" onClick={this.onDelete}/></Tooltip>
                    : undefined
                }
                {
                    types.full_screen
                    ? <Tooltip title="Full screen"><Icon type="full-screen" className={snw.full_screen ? 'active' : undefined} onClick={this.toggleFullScreen}/></Tooltip>
                    : undefined
                }
            </div>
        );
    }
}

export default Toolbar;
