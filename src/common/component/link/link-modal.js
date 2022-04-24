import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Modal, Row, Col, Tabs, Icon} from 'antd';
// import DetailList from './detail-list';
import TrialList from './trial-list';
import PubList from './pub-list';

import 'common/style/link-modal.less';

const TabPane = Tabs.TabPane;

@inject('link')
@observer
class LinkModal extends Component {

    constructor(props) {
        super(props);
        props.link.getData();
    }

    onCancel = () => {
        this.props.link.reset();
    }

    render() {
        const {link: {visible, active_link}} = this.props;
        return (
            <Modal
                className="link-modal"
                title='Link Information'
                destroyOnClose={true}
                visible={visible}
                width={1200}
                footer={null}
                onCancel={this.onCancel}
                style={{top: 20}}
            >
                <div className="m-hd">
                    <Row type="flex">
                        <Col span={8} className="col-source">
                            <span className="node-type" style={{backgroundImage: 'url(' + require(`../../image/${active_link.sourceType}-1.png`) +')'}}></span>
                            <span className="node-value">{active_link.sourceName}</span>
                        </Col>
                        <Col span={8} className="col-relation">
                            {
                                active_link.direction === 'two-way' ?
                                <div className="line"><Icon type="left"/><Icon type="right"/></div> :
                                <div className="line"><Icon type="right"/></div>
                            }
                            <div className="text">{active_link.relation} ( {active_link.weight} ) </div>
                        </Col>
                        <Col span={8} className="col-target">
                            <span className="node-value">{active_link.targetName}</span>
                            <span className="node-type" style={{backgroundImage: 'url(' + require(`../../image/${active_link.targetType}-1.png`) +')'}}></span>
                        </Col>
                    </Row>
                </div>
                <div className="m-bd">
                    <Tabs defaultActiveKey="2">
                        {/*
                            <TabPane key="1" tab="Details">
                                <DetailList/>
                            </TabPane>
                        */}
                        <TabPane key="2" tab="Clinical Trials">
                            <TrialList/>
                        </TabPane>
                        <TabPane key="3" tab="Publications">
                            <PubList/>
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        );
    }
}

export default LinkModal;
