import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Table, Progress, Icon} from 'antd';

const statusMap = {
    1: 'pause',
    2: 'uploading',
    3: 'end'
};

@inject('file')
@observer
class UploadingList extends Component {
    constructor(props) {
        super(props);
    }

    toggleStatus = (record) => {
        const {file: {uploader, files_ing}} = this.props;
        for(let i = 0, len = files_ing.length; i < len; i++) {
            if(files_ing[i].id === record.id) {
                if(files_ing[i].status === 1) {
                    files_ing[i].status = 2;
                    uploader.upload(record.id);
                } else if(files_ing[i].status === 2) {
                    files_ing[i].status = 1;
                    uploader.stop(record);
                }
                break;
            }
        }
    }

    getColumns = () => {
        return [
            {
                title: 'File Name',
                dataIndex: 'name',
                width: 300
            },
            {
                title: 'File Size',
                dataIndex: 'size',
                width: 150
            },
            {
                title: 'Progress',
                dataIndex: 'percent',
                width: 250,
                render: (val) => {
                    return <div className="progress-col"><Progress percent={+val} strokeWidth={5}/></div>
                }
            },
            {
                title: 'Action',
                dataIndex: 'action',
                width: 200,
                className: 'action-col',
                render: (val, record) => {
                    const status = record.status;
                    if(status > 2) {
                        return;
                    } else {
                        return [
                            <Icon key="1" type={status === 2 ? 'pause' : 'play'} onClick={() => this.toggleStatus(record)}/>
                        ];
                    }
                }
            }
        ];
    }

    render() {
        const {file: {files_ing}} = this.props;
        return (
            <Table
                simple
                size="middle"
                className="uploading-list"
                scroll={{x: 900}}
                columns={this.getColumns()}
                rowKey={record => record.id}
                dataSource={toJS(files_ing)}
                pagination={false}
            />
        );
    }
}

export default UploadingList;
