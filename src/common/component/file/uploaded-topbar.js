import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Row, Col, Form, Select} from 'antd';

const FormItem = Form.Item;
const SelectOption = Select.Option;

const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 10}
}

@inject('file')
@observer
class Topbar extends Component {
    constructor(props) {
        super(props);
    }

    onSysChg = (value) => {
        const {file} = this.props;
        file.active_sys = value;
        file.getFiles();
    }

    onPjtChg = (value) => {
        const {file} = this.props;
        file.active_pjt = value;
        file.getPjtFiles();
    }

    render() {
        const {file: {active_sys, projects}, form: {getFieldDecorator}} = this.props;
        return (
            <Row className="topbar">
                <Col span={12}>
                    <FormItem label="System" {...layout}>
                        {getFieldDecorator('system', {
                            initialValue: active_sys
                        })(
                            <Select onChange={this.onSysChg}>
                                <SelectOption value="file_sys">File Management System</SelectOption>
                                <SelectOption value="pass_sys">Pass System</SelectOption>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                {
                    active_sys === 'pass_sys' ?
                    <Col span={12}>
                        <FormItem label="Project" {...layout}>
                            {getFieldDecorator('project', {
                                initialValue: projects.length ? projects[0].id : ''
                            })(
                                <Select onChange={this.onPjtChg}>
                                    {
                                        projects.map((item, index) => {
                                            return (
                                                <SelectOption key={index} value={item.id}>{item.projectName}</SelectOption>
                                            );
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col> : null
                }
            </Row>
        );
    }
}

export default Form.create()(Topbar);
