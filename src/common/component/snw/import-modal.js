import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {Modal, Row, Col, Icon, Input, notification} from 'antd';
import 'common/style/snw/import-modal.less';

@inject('snw')
@observer
class ImportModal extends Component {

    constructor(props) {
        super(props);
        this.icons = {
            wait: 'plus',
            process: 'loading',
            success: 'check',
            error: 'close'
        };
        this.state = {
            name: '',
            status: 'wait',
            data: {}
        };
    }

    showUpload = () => {
        this.refs['file-input'].click();
    }

    onFileChg = (e) => {
        if(!window.FileReader) {
            notification.warning({
                message: 'Notice',
                description: 'Your browser version is too low， please update.'
            });
            return;
        }
        const file = e.target.files[0];
        this.setState({
            name: file.name,
            status: 'process'
        });
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            this.setState({
                status: 'success',
                data
            });
        };
        reader.onerror = () => {
            this.setState({
                status: 'error'
            })
        };
    }

    onOk = () => {
        const {status, data} = this.state;
        if(status !== 'success') {
            return;
        }
        const {snw} = this.props;
        // snw.update({
        //     ...data,
        //     redraw: true,
        //     show_import_modal: false
        // });
        snw.reload(data.nodes, data.links);
        snw.update({
            show_import_modal: false
        });
    }

    onCancel = () => {
        this.props.snw.show_import_modal = false;
    }

    render() {
        const {snw: {show_import_modal}} = this.props;
        const {name, status} = this.state;
        const modalProps = {
            title: 'Import',
            width: 500,
            wrapClassName: 'vertical-center',
            visible: show_import_modal,
            onOk: this.onOk,
            onCancel: this.onCancel
        };
        const icons = this.icons;
        return (
            <Modal className="snw-import" {...modalProps}>
                <Row>
                    <Col span={6} className="label-col">
                        Select the file：
                    </Col>
                    <Col span={15}>
                        <div className="file-wrap">
                            <span className="file-cover f-toe1" onClick={this.showUpload}>
                                {status === 'wait' ? <Icon type={icons.wait}/> : name}
                            </span>
                            <input
                                type = "file"
                                ref="file-input"
                                className="file-input"
                                accept="application/json"
                                onChange={this.onFileChg}
                            />
                        </div>
                    </Col>
                    <Col span={2}>
                        <div className="status-wrap">
                            {status !== 'wait' ? <Icon type={icons[status]}/> : undefined}
                        </div>
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default ImportModal;
