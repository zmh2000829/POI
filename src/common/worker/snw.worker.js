function difference(arr1, arr2) {
    const res = [];
    for(let i = 0, len = arr1.length; i < len; i++) {
        if(arr2.indexOf(arr1[i]) === -1) {
            res.push(arr1[i]);
        }
    }
    return res;
}

function uniq(arr) {
    const res = [], map = {};
    for(let i = 0, len = arr.length; i < len; i++) {
        if(!map[arr[i]]) {
            res.push(arr[i]);
            map[arr[i]] = true;
        }
    }
    return res;
}

function calcFilter(links, link_types, rlats) {
    let link_type_map = {};
    let rlat_map = {};
    if(link_types) {
        link_types.forEach(function(item) {
            link_type_map[item.name] = {total: item.total, current: 0, selected: item.selected};
        });
    } else {
        link_type_map = {
            'variant-disease': {current: 0, total: 0},
            'variant-drug': {current: 0, total: 0},
            'variant-gene': {current: 0, total: 0},
            'disease-drug': {current: 0, total: 0},
            'disease-gene': {current: 0, total: 0},
            'drug-gene': {current: 0, total: 0}
        };
    }

    if(rlats) {
        rlats.forEach(function(item) {
            rlat_map[item.name] = {total: item.total, current: 0, selected: item.selected};
        });
    }

    let t0, t1, t2, r0;
    links.forEach(function(link, index) {
        t1 = link.sourceType + '-' + link.targetType;
        t2 = link.targetType + '-' + link.sourceType;
        if(link_type_map[t1]) {
            t0 = t1;
        } else {
            t0 = t2;
        }
        if(!link.hidden && link_type_map[t0]) {
            link_type_map[t0].current++;
        }
        if(!link_types && link_type_map[t0]) {
            link_type_map[t0].total++;
        }

        r0 = link.relation.split(/\s*;\s*/);
        r0.forEach(function(rlat) {
            if(!rlat_map[rlat]) {
                rlat_map[rlat] = {links: [], current: 0, total: 0};
            }
            if(!rlats) {
                rlat_map[rlat].total++;
            }
            if(!link.hidden) {
                rlat_map[rlat].current++;
            }
        });
    });

    link_types = [];
    const sel_link_type_map = {};
    let sel_l = true;
    for(let key in link_type_map) {
        if(link_type_map[key].total) {
            sel_l = link_type_map[key].selected !== undefined ? link_type_map[key].selected : link_type_map[key].current !== 0;
            link_types.push({
                name: key,
                total: link_type_map[key].total,
                current: link_type_map[key].current,
                selected: sel_l
            });
            if(sel_l) {
                sel_link_type_map[key] = sel_l;
            }
        }

    }

    link_types.sort(function(a, b) {
        return b.total - a.total;
    });

    rlats = [];
    const sel_rlat_map = {};
    let sel_r = true;
    for(let key in rlat_map) {
        sel_r = rlat_map[key].selected !== undefined ? rlat_map[key].selected : rlat_map[key].current !== 0;
        rlats.push({
            name: key,
            total: rlat_map[key].total,
            current: rlat_map[key].current,
            selected: sel_r
        });
        if(sel_r) {
            sel_rlat_map[key] = sel_r;
        }
    }
    rlats.sort(function(a, b) {
        return b.total - a.total;
    });
    console.log();
    return {link_types, sel_link_type_map, rlats, sel_rlat_map};
}

function reload({nodes, links, show_label}) {
    const node_map = {}, link_map = {}, node_arr = [], link_arr = [], variants = [], diseases = [], drugs = [], genes = [];
    nodes.forEach(function(node) {
        node.group = node.type;
        node.hidden = true;
        if(show_label) {node.label = node.name;}
        node.relatedNodeIds = [];
        node.relatedLinkIds = [];
        node_map[node.id] = node;
        switch(node.type) {
            case 'variant':
                variants.push(node);
                break;
            case 'disease':
                diseases.push(node);
                break;
            case 'drug':
                drugs.push(node);
                break;
            case 'gene':
                genes.push(node);
                break;
        }
    });

    links.forEach(function(link, index) {
        if(node_map[link.source] && node_map[link.target]) {
            if(link.direction === 'two-way') {
                link.arrows = 'to;from';
            } else {
                link.arrows = 'to';
            }
            if(index < 20) {
                link.hidden = false;
                node_map[link.source].hidden = false;
                node_map[link.target].hidden = false;
            } else {
                link.hidden = true;
            }
            link.from = link.source;
            link.to = link.target;
            link.sourceType = node_map[link.source].type;
            link.sourceName = node_map[link.source].name;
            link.targetType = node_map[link.target].type;
            link.targetName = node_map[link.target].name;
            link.color = '#3BC9CB';
            link_arr.push(link);
            link_map[link.id] = link;
            node_map[link.from].relatedNodeIds.push(link.to);
            node_map[link.to].relatedNodeIds.push(link.from);
            node_map[link.from].relatedLinkIds.push(link.id);
            node_map[link.to].relatedLinkIds.push(link.id);
        }
    });

    // 去处孤立节点
    nodes.forEach(function(node) {
        if(node_map[node.id].relatedNodeIds.length) {
            node_arr.push(node);
        }
    });

    const {link_types, sel_link_type_map, rlats, sel_rlat_map} = calcFilter(link_arr);

    return {nodes: node_arr, links: link_arr, variants, diseases, drugs, genes, node_map, link_map, sel_link_type_map, link_types, rlats, sel_rlat_map};
}

function remove({nodes, links, selNodeIds, selLinkIds, link_types, rlats}) {
    const del_node_map = {};
    const del_link_map = {};
    selNodeIds.forEach(function(item) {
        del_node_map[item] = true;
    });
    selLinkIds.forEach(function(item) {
        del_link_map[item] = true;
    });
    const node_map = {}, link_map = {}, variants = [], diseases = [], drugs = [], genes = [];
    const nodes_fin = [];
    const links_fin = [];
    const nodes_tmp = [];
    nodes.forEach(function(node) {
        if(!del_node_map[node.id]) {
            nodes_tmp.push(node);
        } else {
            const relatedLinkIds = node.relatedLinkIds;
            relatedLinkIds.forEach(function(item) {
                if(!del_link_map[item]) {
                    del_link_map[item] = true;
                    selLinkIds.push(item);
                }
            });
        }
    });
    const retain_link_map = {};
    links.forEach(function(link) {
        if(!del_link_map[link.id]) {
            links_fin.push(link);
            retain_link_map[link.id] = true;
        }
    });
    nodes_tmp.forEach(function(node) {
        if(difference(node.relatedLinkIds, selLinkIds).length > 0) {
            nodes_fin.push(node);
        }
    });
    nodes_fin.forEach(function(node) {
        node.relatedNodeIds = [];
        node.relatedLinkIds = [];
        node_map[node.id] = node;
        switch(node.type) {
            case 'variant':
                variants.push(node);
                break;
            case 'disease':
                diseases.push(node);
                break;
            case 'drug':
                drugs.push(node);
                break;
            case 'gene':
                genes.push(node);
                break;
        }
    });
    links_fin.forEach(function(link) {
        link_map[link.id] = link;
        node_map[link.from].relatedNodeIds.push(link.to);
        node_map[link.to].relatedNodeIds.push(link.from);
        node_map[link.from].relatedLinkIds.push(link.id);
        node_map[link.to].relatedLinkIds.push(link.id);
    });

    const filters = calcFilter(links_fin, link_types, rlats);

    return {nodes: nodes_fin, links: links_fin, variants, diseases, drugs, genes, node_map, link_map, link_types: filters.link_types, rlats: filters.rlats};
}

function filter({nodes, links, show_label, wgts, wgt_rng, link_types, sel_link_type_map, rlats, sel_rlat_map}) {
    let node_map = {}, link_map = {}, node_arr = [], link_arr = [], variants = [], diseases = [], drugs = [], genes = [];
    let sel_link_types = [];
    for(let key in sel_link_type_map) {
        if(sel_link_type_map[key]) {
            sel_link_types.push(key);
        }
    }
    // const sel_link_types = Object.keys(sel_link_type_map);
    if(sel_link_types.length) {
        const link_reg = sel_link_types.length ? new RegExp(sel_link_types.join('|')) : new RegExp('');
        links.forEach(function(link) {
            const type_1 = link.sourceType + '-' + link.targetType;
            const type_2 = link.targetType + '-' + link.sourceType;
            if(link_reg && (link_reg.test(type_1) || link_reg.test(type_2))) {
                link_arr.push(link);
            }
        });
    }

    let sel_rlats = [];
    for(let key in sel_rlat_map) {
        if(sel_rlat_map[key]) {
            sel_rlats.push(key);
        }
    }
    // const sel_rlats = Object.keys(sel_rlat_map);
    if(sel_rlats.length) {
        const rlat_filter_arr = [];
        const rlat_reg = new RegExp('\\b' + sel_rlats.join('|') + '\\b');
        let temp_arr = link_arr.length ? link_arr : links;
        temp_arr.forEach(function(link) {
            if(rlat_reg.test(link.relation)) {
                rlat_filter_arr.push(link);
            }
        });
        link_arr = rlat_filter_arr;
    }

    if(wgts[0] > wgt_rng[0] || wgts[1] < wgt_rng[1]) {
        const wgt_filter_arr = [];
        const temp_arr = link_arr.length ? link_arr : links;
        temp_arr.forEach(function(link) {
            if(link.weight >= wgts[0] && link.weight <= wgts[1]) {
                wgt_filter_arr.push(link);
            }
        });
        link_arr = wgt_filter_arr;
    }

    link_arr.forEach(function(link, index) {
        node_map[link.source] = true;
        node_map[link.target] = true;
    });

    nodes.forEach(function(node) {
        if(node_map[node.id]) {
            var type = node.type;
            node.group = type;
            node.hidden = false;
            if(show_label) {node.label = node.name;}
            node.relatedNodeIds = [];
            node.relatedLinkIds = [];
            node_map[node.id] = node;
            node_arr.push(node);
            switch(type) {
                case 'variant':
                    variants.push(node);
                    break;
                case 'disease':
                    diseases.push(node);
                    break;
                case 'drug':
                    drugs.push(node);
                    break;
                case 'gene':
                    genes.push(node);
                    break;
            }
        }
    });

    link_arr.forEach(function(link) {
        if(link.direction === 'two-way') {
            link.arrows = 'to;from';
        } else {
            link.arrows = 'to';
        }
        link.hidden = false;
        link.from = link.source;
        link.to = link.target;
        link.sourceType = node_map[link.source].type;
        link.sourceName = node_map[link.source].name;
        link.targetType = node_map[link.target].type;
        link.targetName = node_map[link.target].name;
        link.color = '#3BC9CB';
        link_map[link.id] = link;
        node_map[link.from].relatedNodeIds.push(link.to);
        node_map[link.to].relatedNodeIds.push(link.from);
        node_map[link.from].relatedLinkIds.push(link.id);
        node_map[link.to].relatedLinkIds.push(link.id);
    });

    const filters = calcFilter(link_arr, link_types, rlats);

    return {nodes: node_arr, links: link_arr, variants, diseases, drugs, genes, node_map, link_map, link_types: filters.link_types, rlats: filters.rlats};
}

function nodeSelectChg({chgIds, selected, nodes, links, node_map, link_map, link_types, rlats}) {
    const includeIds = [...chgIds];
    const excludeIds = [];
    let pendingIds = [];
    for(let i = 0, len = chgIds.length; i < len; i++) {
        pendingIds.push(...node_map[chgIds[i]].relatedNodeIds);
    }
    pendingIds = uniq(pendingIds);
    if(!selected) {
        function findNodes(arr_1) {
            arr_1 = difference(arr_1, [...includeIds, ...excludeIds]);
            for(let i = 0, len_1 = arr_1.length; i < len_1; i++) {
                const arr_2 = difference(node_map[arr_1[i]].relatedNodeIds, [...includeIds]);
                let num = 0;
                const arr_3 = [];
                for(let j = 0, len_2 = arr_2.length; j < len_2; j++) {
                    if(!node_map[arr_2[j]].hidden) {
                        num++;
                        break;
                    } else {
                        arr_3.push(arr_2[j]);
                    }
                }
                if(num > 0) {
                    excludeIds.push(arr_1[i]);
                } else {
                    includeIds.push(arr_1[i]);
                    findNodes(arr_3);
                }
            }
        }
        findNodes(pendingIds);
    } else {
        includeIds.push(...pendingIds);
    }
    includeIds.forEach(id => {
        node_map[id].hidden = !selected;
    });

    const variants = [], diseases = [], drugs = [], genes = [];

    nodes.forEach(node => {
        node.hidden = node_map[node.id].hidden;
        switch(node.type) {
            case 'variant':
                variants.push(node);
                break;
            case 'disease':
                diseases.push(node);
                break;
            case 'drug':
                drugs.push(node);
                break;
            case 'gene':
                genes.push(node);
                break;
        }
    });

    links.forEach(link => {
        if(!node_map[link.from].hidden && !node_map[link.to].hidden) {
            link.hidden = false;
        } else {
            link.hidden = true;
        }
    });
    const filters = calcFilter(links, link_types, rlats);
    return {nodes, links, variants, diseases, drugs, genes, node_map, link_map, link_types: filters.link_types, rlats: filters.rlats};
}

function linkSelectChg({chgIds, selected, nodes, links, node_map, link_map, link_types, rlats}) {
    if(!selected) {
        for(let i = 0, len_i = chgIds.length; i < len_i; i++) {
            const arr_f = node_map[link_map[chgIds[i]].from].relatedLinkIds;
            const arr_t = node_map[link_map[chgIds[i]].to].relatedLinkIds;
            let num_f = 0;
            let num_t = 0;
            for(let j = 0, len_j = arr_f.length; j < len_j; j++) {
                if(arr_f[j] != chgIds[i] && !link_map[arr_f[j]].hidden) {
                    num_f++;
                    break;
                }
            }
            if(num_f > 0) {
                node_map[link_map[chgIds[i]].from].hidden = false;
            } else {
                node_map[link_map[chgIds[i]].from].hidden = true;
            }

            for(let k = 0, len_k = arr_t.length; k < len_k; k++) {
                if(arr_t[k] != chgIds[i] && !link_map[arr_t[k]].hidden) {
                    num_t++;
                    break;
                }
            }
            if(num_t > 0) {
                node_map[link_map[chgIds[i]].to].hidden = false;
            } else {
                node_map[link_map[chgIds[i]].to].hidden = true;
            }
            link_map[chgIds[i]].hidden = true;
        }
    } else {
        for(let i = 0, len = chgIds.length; i < len; i++) {
            node_map[link_map[chgIds[i]].from].hidden = false;
            node_map[link_map[chgIds[i]].to].hidden = false;
            link_map[chgIds[i]].hidden = false;
        }
    }

    const variants = [], diseases = [], drugs = [], genes = [];
    nodes.forEach(node => {
        node.hidden = node_map[node.id].hidden;
        switch(node.type) {
            case 'variant':
                variants.push(node);
                break;
            case 'disease':
                diseases.push(node);
                break;
            case 'drug':
                drugs.push(node);
                break;
            case 'gene':
                genes.push(node);
                break;
        }
    });
    const filters = calcFilter(links, link_types, rlats);
    return {nodes, variants, diseases, drugs, genes, node_map, link_map, link_types: filters.link_types, rlats: filters.rlats};
}

onmessage = function(evt) {
    var type = evt.data.type;
    var payload = evt.data.payload;
    switch(type) {
        case 'reload':
            postMessage({type, payload: reload(payload)});
            break;
        case 'remove':
            postMessage({type, payload: remove(payload)});
            break;
        case 'filter':
            postMessage({type, payload: filter(payload)});
            break;
        case 'node_select_chg':
            postMessage({type, payload: nodeSelectChg(payload)});
            break;
        case 'link_select_chg':
            postMessage({type, payload: linkSelectChg(payload)});
            break;
    }
};
