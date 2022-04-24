import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Table} from 'antd';

@inject('link')
@observer
class PubBlock extends Component {

    onPageChange = (page) => {
        const {link: {active_link, getPubs}} = this.props;
        getPubs({
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
                            <div className="col-label f-fl">PMID: </div>
                            <div className="col-value">{record.PMID}  {record.Year ? `(${record.Year})` : ''}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Title: </div>
                            <div className="col-value">{record.Title}</div>
                        </div>
                        <div className="m-row f-cb">
                            <div className="col-label f-fl">Author: </div>
                            <div className="col-value">{record.Author.join(', ')}</div>
                        </div>
                    </div>
                );
            }
        }];
    }

    render() {
        const {link: {loading_pub, pagination_pub, pubs}} = this.props;
        return (
            <Table
                className="pub-list"
                columns={this.getColumns()}
                rowKey={(record) => record.PMID}
                loading={loading_pub}
                dataSource={toJS(pubs)}
                pagination={toJS(pagination_pub)}
                onChange={this.onPageChange}
            />
        );
    }
}

export default PubBlock;
