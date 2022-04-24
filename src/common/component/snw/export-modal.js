import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {saveAs} from 'file-saver';
import {Modal, Row, Col, Form, Select, Input, notification} from 'antd';

const FormItem = Form.Item;
const SelectOption = Select.Option;

const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 18}
};

@inject('snw')
@observer
class ExportModal extends Component {

    onOk = () => {
        const {snw, form: {getFieldsValue}} = this.props;
        const canvas = snw.graph.canvas;
        if(!window.Blob || !canvas.toBlob) {
            notification.warning({
                message: 'Notice',
                description: 'Your browser version is too low， please update.'
            });
            return;
        }
        let {type, name} = getFieldsValue();
        name = name + '.' + type;
        if(type === 'jpg' || type === 'png') {
            canvas.toBlob((blob) => {
                saveAs(blob, name);
                snw.show_export_modal = false;
            });
        } else {
            const blob = new Blob(
                [JSON.stringify({
                    nodes: toJS(snw.nodes),
                    links: toJS(snw.links)
                    // variants: toJS(snw.variants),
                    // diseases: toJS(snw.diseases),
                    // drugs: toJS(snw.drugs),
                    // genes: toJS(snw.genes),
                    // node_map: snw.node_map,
                    // link_map: snw.link_map
                })],
                {type: "text/plain;charset=utf-8"}
            );
            saveAs(blob, name);
            snw.show_export_modal = false;
        }
    }

    onCancel = () => {
       this.props.snw.show_export_modal = false;
    }

    render() {
        const {snw: {show_export_modal}, form: {getFieldDecorator}} = this.props;
        const modalProps = {
            title: 'Export',
            width: 500,
            wrapClassName: 'vertical-center',
            visible: show_export_modal,
            onOk: this.onOk,
            onCancel: this.onCancel
        };
        return (
            <Modal className="snw-export" {...modalProps}>
                <Form>
                    <FormItem label="Type" {...layout}>
                        {getFieldDecorator('type', {
                            initialValue: 'jpg'
                        })(
                            <Select>
                                <SelectOption value="jpg">JPG</SelectOption>
                                <SelectOption value="png">PNG</SelectOption>
                                <SelectOption value="json">JSON</SelectOption>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="Name" {...layout} hasFeedback>
                        {getFieldDecorator('name', {
                            rules: [
                                {required: true, message: 'Please enter a name'}
                            ]
                        })(
                            <Input placeholder="The name of the export file"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(ExportModal);
