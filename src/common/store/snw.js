import {toJS, action, extendObservable} from 'mobx';
import {WGT_RNG} from 'common/constant';
import Worker from 'common/worker/snw.worker.js';

// 不可观察属性
const UNOBSERVABLE = {
    // webworker实例对象
    worker                : null,
    // 关系网图形实例
    graph                 : null,
    // 原始数据对象
    orign                 : {},
    node_map              : {},
    link_map              : {},
    sel_rlat_map          : {},
    sel_link_type_map     : {}
};

// 可观察属性
const OBSERVABLE = {
    node_types            : {},
    link_types            : [],
    rlats                 : [],
    nodes                 : [],
    links                 : [],
    variants              : [],
    diseases              : [],
    drugs                 : [],
    genes                 : [],
    wgts                  : WGT_RNG,
    show_label            : false,
    show_filter           : false,
    show_nodes            : true,
    show_links            : false,
    show_wc               : false,
    show_export_modal     : false,
    show_import_modal     : false,
    show_tooltip          : false,
    tooltip_type          : '',
    tooltip_item          : {},
    full_screen           : false,
    redraw                : false,

    filter_inited         : false,
    nodes_inited          : true,
    links_inited          : false,
    wc_inited             : false
}

class Snw {
    constructor() {
        this.reset();
    }

    @action.bound reset() {
        this.destroyWorker();
        this.destroyGraph();
        Object.assign(this, _.cloneDeep(UNOBSERVABLE));
        extendObservable(this, {
            ...OBSERVABLE
        });
    }

    @action.bound update(data) {
        Object.assign(this, data);
    }

    @action.bound reload(nodes, links) {
        if(!this.worker) {
            this.createWorker();
        }
        this.worker.postMessage({
            type: 'reload',
            payload: {nodes, links, show_label: this.show_label}
        });
    }

    @action.bound updateGraph = (nodes, links, options) => {
        if(!_.isEmpty(options)) {
            this.graph.setOptions(options);
        }
        this.graph.nodes.update(nodes);
        this.graph.edges.update(links);
    }

    @action.bound createWorker = () => {
        if(!this.worker) {
            this.worker = new Worker();
            this.worker.onmessage = this.onMessage;
        }
    }

    @action.bound destroyWorker = () => {
        if(this.worker) {
            this.worker.onmessage = null;
            this.worker.terminate();
            this.worker = UNOBSERVABLE.worker;
        }
    }

    @action.bound destroyGraph = () => {
        if(this.graph) {
            this.graph.destroy();
            this.graph = UNOBSERVABLE.graph;
        }
    }

    @action.bound onMessage = ({data: {type, payload}}) => {
        switch(type) {
            case 'reload':
                payload.redraw = true;
                // 保存原始值
                this.orign = {nodes: payload.nodes, links: payload.links};
                this.update({
                    ..._.cloneDeep(_.omit(UNOBSERVABLE, ['worker', 'graph', 'orign'])),
                    ..._.pick(OBSERVABLE, ['wgts', 'show_tooltip', 'tooltip_type', 'tooltip_item']),
                    ...payload
                });
                break;
            case 'remove':
                payload.redraw = true;
                this.update({
                    ..._.cloneDeep(_.omit(UNOBSERVABLE, ['worker', 'graph', 'orign'])),
                    ..._.pick(OBSERVABLE, ['wgts', 'show_tooltip', 'tooltip_type', 'tooltip_item']),
                    ...payload
                });
                break;
            case 'filter':
                payload.redraw = true;
                this.update(payload);
                break;
            case 'node_select_chg':
                this.updateGraph(payload.nodes, payload.links);
                this.update(payload);
                break;
            case 'link_select_chg':
                this.updateGraph(payload.nodes, toJS(this.links));
                this.update(payload);
        }
    }
}

export default new Snw();
