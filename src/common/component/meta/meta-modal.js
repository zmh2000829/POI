import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Modal} from 'antd';
import Variant from './variant';
import Disease from './disease';
import Drug from './drug';
import Gene from './gene';

import 'common/style/meta-modal.less'

@inject('meta')
@observer
class MetaModal extends Component {
    constructor(props) {
        super(props);
        const {meta} = this.props;
        meta.getMeta();
    }

    onCancel = () => {
        const {meta} = this.props;
        meta.reset();
    }

    getMetaTpl = () => {
        const {meta: {active_meta: {type}}} = this.props;
        switch(type) {
            case 'variant':
                return (
                    <Variant/>
                );
                break;
            case 'disease':
                return (
                    <Disease/>
                );
                break;
            case 'drug':
                return (
                    <Drug/>
                );
                break;
            case 'gene':
                return (
                    <Gene/>
                );
                break;
        };
    }

    render() {
        const {meta: {visible}} = this.props;
        return (
            <Modal
                className="meta-modal"
                title='Meta Information'
                destroyOnClose={true}
                visible={visible}
                width={1200}
                footer={null}
                onCancel={this.onCancel}
                style={{top: 20}}
            >
                {this.getMetaTpl()}
            </Modal>
        );
    }
}

export default MetaModal;
