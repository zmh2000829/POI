import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Table, Popconfirm, Icon} from 'antd';
import moment from 'moment';

@inject('file')
@observer
class UploadedList extends Component {
    constructor(props) {
        super(props);
    }

    onDelete = (record) => {
        const {file} = this.props;
        file.deleteFile({name: record.pathOrName});
    }

    getColumns = () => {
        const {file: {active_sys}} = this.props;
        return [
            {
                title: 'File Name',
                dataIndex: 'pathOrName'
            },
            {
                title: 'File Size',
                dataIndex: 'dataSize',
                render: (value, record) => {
                    return Jt.file.formatSize(value);
                }
            },
            {
                title: 'Upload Date',
                dataIndex: 'createdAt',
                render: (value, record) => {
                    return moment(value).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            {
                title: 'Action',
                dataIndex: 'action',
                render: (value, record) => {
                    return (
                        (!active_sys || active_sys == 'file_sys')?(
                            <Popconfirm title="Are you sure delete this file?" onConfirm={() => this.onDelete(record)}>
                                <Icon type="delete" />
                            </Popconfirm>
                        ):null
                    );
                }
            }
        ];
    }

    render() {
        const {file: {loading, files_end}} = this.props;
        return (
            <Table
                simple
                size="middle"
                className="uploaded-list"
                scroll={{x: 900}}
                loading={loading}
                columns={this.getColumns()}
                rowKey={record => record.id}
                dataSource={toJS(files_end)}
                pagination={false}
            />
        );
    }
}

export default UploadedList;
