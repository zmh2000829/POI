import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import { toJS, reaction } from 'mobx';
import {Row, Col, Icon} from 'antd';

import 'common/style/snw/tooltip.less';

const types = {
    node: [
        {key: 'type', label: 'Type'},
        {key: 'name', label: 'Name'}
    ],
    link: [
        {key: 'sourceName', label: 'Source'},
        {key: 'targetName', label: 'Target'},
        {key: 'direction', label: 'Direction'},
        {key: 'weight', label: 'Weight'},
        {key: 'relation', label: 'Relation'}
    ]
};

@inject('snw', 'link', 'meta')
@observer
class Tooltip extends Component {

    onClose = () => {
        this.props.snw.show_tooltip = false;
    }

    onCheck = () => {
        const {snw: {tooltip_type, tooltip_item}, meta, link} = this.props;
        if(tooltip_type === 'node') {
            meta.update({
                visible: true,
                active_meta: tooltip_item
            });
        } else if(tooltip_type === 'link') {
            link.update({
                visible: true,
                active_link: tooltip_item
            });
        }
    }

    getInfoTpl = () => {
        const {snw: {tooltip_type, tooltip_item}} = this.props;
        const attrs = types[tooltip_type];
        if(!attrs) {
            return;
        }
        return (
            attrs.map((attr, index) => {
                return (
                    <Row key={index} className="attr-row">
                        <Col span={8} className="col-label">
                            <span>{attr.label}: </span>
                        </Col>
                        <Col span={16} className="col-value">
                            <span>{tooltip_item[attr.key]}</span>
                        </Col>
                    </Row>
                );
            })
        );
    }

    render() {
        const { snw: { show_tooltip, tooltip_type, tooltip_item}} = this.props;
        return (
            <div className={["snw-tooltip", show_tooltip ? 'active' : undefined].join(' ')}>
                <Icon type="close" onClick={this.onClose}/>
                {this.getInfoTpl()}
                {
                    (tooltip_type === 'node' && tooltip_item.metaid) || (tooltip_type === 'link' && tooltip_item.otid)
                    ?   <Row>
                            <Col span={16} offset={8} className="btn-wrap">
                                <Icon type="eye-o" onClick={this.onCheck} />
                            </Col>
                        </Row>
                    :   null
                }
            </div>
        );
    }
}

export default Tooltip;
