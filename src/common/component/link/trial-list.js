import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Table} from 'antd';

@inject('link')
@observer
class TrialList extends Component {

    onPageChange = (page) => {
        const {link: {active_link, getTrials}} = this.props;
        getTrials({
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
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">NCTID: </div>
                            <div className="col-value">{record.NCTID}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Title: </div>
                            <div className="col-value">{record.Title}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Source: </div>
                            <div className="col-value">{record.Source}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Phase: </div>
                            <div className="col-value">{record.Phase}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Condition: </div>
                            <div className="col-value">{record.Condition.join(', ')}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Intervention: </div>
                            <div className="col-value">{record.Intervention.join(', ')}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Summary: </div>
                            <div className="col-value">{record.Summary}</div>
                        </div>
                    </div>
                );
            }
        }];
    }

    render() {
        const {link: {loading_trial, pagination_trial, trials}} = this.props;
        return (
            <Table
                className="trial-list"
                columns={this.getColumns()}
                rowKey={(record) => record.NCTID}
                loading={loading_trial}
                dataSource={toJS(trials)}
                pagination={toJS(pagination_trial)}
                onChange={this.onPageChange}
            />
        );
    }
}

export default TrialList;
