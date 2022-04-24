import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Table, Rate} from 'antd';

@inject('link')
@observer
class DetailList extends Component {

    onPageChange = (page) => {
        const {link: {active_link, getDetails}} = this.props;
        getDetails({
            otid: active_link.otid,
            pageNum: page.current
        });
    }

    getColumns = () => {
        return [{
            title: '',
            dataIndex: '',
            render: (text, record) => {
                return(
                    <div className="m-block">
                        <div className="m-row source-row f-cb">
                            <div className="col-label f-fl">Source: </div>
                            <div className="col-value"><span className="text">{record.Source}</span><Rate disabled value={parseInt(record.Rank)}/></div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Drug: </div>
                            <div className="col-value">{record.Drug.join(', ')}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Disease: </div>
                            <div className="col-value">{record.Disease.join(', ')}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Gene: </div>
                            <div className="col-value">{record.Gene.join(', ')}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Variation: </div>
                            <div className="col-value">{record.Variation.join(', ')}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Respond: </div>
                            <div className="col-value">{record.Respond}</div>
                        </div>
                    </div>
                );
            }
        }];
    }

    render() {
        const {link: {loading_detail, pagination_detail, details}} = this.props;
        return (
            <Table
                className="detail-list"
                columns={this.getColumns()}
                rowKey={(record) => record.ID}
                loading={loading_detail}
                dataSource={toJS(details)}
                pagination={toJS(pagination_detail)}
                onChange={this.onPageChange}
            />
        );
    }
}

export default DetailList;
