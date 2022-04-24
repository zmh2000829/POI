import vis from 'vis/dist/vis-network.min';

class Graph {
    constructor(el, nodes, edges, options) {
        this.el = el;
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        this.nodes.add(nodes);
        this.edges.add(edges);
        this.setOptions(options);
        this.selectedNodeIds = [];
        this.visNwCfg = {
            interaction: {
                dragView: true,
                hideEdgesOnDrag: edges.length > 500,
                hover: true,
                multiselect: true,
                selectConnectedEdges: false,
                keyboard: {
                    enabled: true,
                    speed: {x: 10, y: 10, zoom: 0.02},
                    bindToWindow: true
                }
            },
            layout: {
                randomSeed: 10,
				improvedLayout: false
			},
            physics: {
                enabled: true,
                timestep: 0.2,
                maxVelocity: 40,
                minVelocity: 0.5,
                stabilization: {
                    enabled: false,
                    updateInterval: 100,
                    onlyDynamicEdges: true
                }
            },
            nodes: {
                font: {
                    align: 'left'
                },
                borderWidth: 0,
                size: 20
            },
            edges: {
                smooth: {
                    enabled: true,
                    type: 'dynamic',
                    forceDirection: 'none',
                    roundness: 0.5
                },
                font: {
                    align: 'top'
                }
            },
            groups: {
                'variant': {
                    shape: 'circularImage',
                    image: {
                        unselected: require('../../image/variant-1.png'),
                        selected: require('../../image/variant-2.png')
                    }
                },
                'disease': {
                    shape: 'circularImage',
                    image: {
                        unselected: require('../../image/disease-1.png'),
                        selected: require('../../image/disease-2.png')
                    }
                },
                'drug': {
                    shape: 'circularImage',
                    image: {
                        unselected: require('../../image/drug-1.png'),
                        selected: require('../../image/drug-2.png')
                    }
                },
                'gene': {
                    shape: 'circularImage',
                    image: {
                        unselected: require('../../image/gene-1.png'),
                        selected: require('../../image/gene-2.png')
                    }
                }
            }
        };
        this.draw();
    }

    destroy = () => {
        this.nodes.clear();
        this.edges.clear();
        this.selectedNodeIds = [];
        this.visNw.destroy();
    }

    setOptions = (options) => {
        for(let key in options) {
            this[key] = options[key];
        }
    }

    draw = () => {
        const el = this.el;
        const visNw = this.visNw = new vis.Network(
            el,
            {
                nodes: this.nodes,
                edges: this.edges
            },
            this.visNwCfg
        );

        const canvas = this.canvas = el.getElementsByTagName('canvas')[0];

        visNw.once('stabilized', () => {
            visNw.fit({
                animation: {
                    duration: 1000,
                    easingFunction: 'linear'
                }
            });
            visNw.setOptions({
                nodes: {physics: false}
            });
        });

        visNw.on('hoverNode', this.onHoverNode);
        visNw.on('blurNode', this.onBlurNode);
        visNw.on('hoverEdge', this.onHoverEdge);
        visNw.on('blurEdge', this.onBlurEdge);
        visNw.on('click', this.onClick);
    }

    redraw = (nodes, edges) => {
        this.destroy();
        this.visNwCfg.interaction.hideEdgesOnDrag = edges.length > 1000 ? true : false;
        this.nodes.add(nodes);
        this.edges.add(edges);
        this.draw();
    }

    fixed = () =>{
        this.visNw.stabilize(50);
        this.visNw.stopSimulation();
    }

    onHoverNode = ({node: id}) => {
        if(id === undefined || id === null) {return;};
        this.canvas.style.cursor = 'pointer';
        const nodeIds = this.visNw.getConnectedNodes(id);
        const edgeIds = this.visNw.getConnectedEdges(id);
        nodeIds.push(id);
        const nodes = this.nodes.get(nodeIds);
        const edges = this.edges.get(edgeIds);
        nodes.forEach(node => {
            node.label = node.name;
            node.image = require(`../../image/${node.group}-3.png`);
        });
        edges.forEach(edge => {
            edge.label = edge.relation + `(${edge.weight})`;
        });
        this.nodes.update(nodes);
        this.edges.update(edges);
    }

    onBlurNode = ({node: id}) => {
        if(id === undefined || id === null) {return;};
        this.canvas.style.cursor = 'auto';
        const nodeIds = this.visNw.getConnectedNodes(id);
        const edgeIds = this.visNw.getConnectedEdges(id);
        nodeIds.push(id);
        const nodes = this.nodes.get(nodeIds);
        const edges = this.edges.get(edgeIds);
        if(this.show_label) {
            nodes.forEach(node => {
                node.image = require(`../../image/${node.type}-1.png`);
            });
        } else {
            nodes.forEach(node => {
                node.label = undefined;
                node.image = require(`../../image/${node.type}-1.png`);
            });
        }
        edges.forEach(edge => {
            edge.label = undefined;
        });
        this.edges.update(edges);
        this.nodes.update(nodes);
    }

    onHoverEdge = ({edge: id}) => {
        this.canvas.style.cursor = 'pointer';
        const edge = this.edges.get(id);
        const source = this.nodes.get(edge.from);
        const target = this.nodes.get(edge.to);
        const nodes = [source, target];
        nodes.forEach(node => {
            node.label = node.name;
            node.image = require(`../../image/${node.group}-3.png`);
        });
        edge.label = edge.relation + ' (' + edge.weight + ') ';
        this.nodes.update(nodes);
        this.edges.update(edge);
    }

    onBlurEdge = ({edge: id}) => {
        this.canvas.style.cursor = 'pointer';
        const edge = this.edges.get(id);
        const source = this.nodes.get(edge.from);
        const target = this.nodes.get(edge.to);
        const nodes = [source, target];
        if(this.show_label) {
            nodes.forEach(node => {
                node.image = require(`../../image/${node.group}-1.png`);
            });
        } else {
            nodes.forEach(node => {
                node.label = undefined;
                node.image = require(`../../image/${node.group}-1.png`);
            });
        }
        edge.label = undefined;
        this.edges.update(edge);
        this.nodes.update(nodes);
    }

    onClick = ({nodes, edges}) => {
        this.selectedNodeIds = nodes;
        if(!this.clickNetwork) {
            return;
        }
        if(nodes.length === 1 ) {
            this.clickNetwork('node', this.nodes.get(nodes[0]));
        } else if(edges.length === 1) {
            this.clickNetwork('link', this.edges.get(edges[0]));
        }

    }
}

export default Graph;
