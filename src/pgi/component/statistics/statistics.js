import React, {Component} from 'react';
import {Table, message } from 'antd';
import BarA from './echarts-bar';
import BarC from './echarts-bar2';
import BarD from './echarts-bar3';
import BarB from './echarts-pie';
import reqwest from 'reqwest';
import 'pgi/style/p-statistics.less';

class Statistics  extends Component {
	constructor(props) {
        super(props);
        this.state = {
            Clinical_Evidence: {},
            Semantic_Relation: {},
            Meta_Data: {},
            Alteration_Summary: {},
            database: []
        };
    }

    componentDidMount () {
        reqwest({
            url: 'https://premedkb.org:5001/getData',
            method: 'get',
            headers: {
                "Content-Security-Policy": "upgrade-insecure-requests"
            },
            processData: false,
            success: (res) => {
                this.setState({
                    Semantic_Relation: res['data']['Semantic_Relation'],
                    Clinical_Evidence: res['data']['Clinical_Evidence'],
                    Meta_Data: res['data']['Meta_Data'],
                    Alteration_Summary: res['data']['Alteration_Summary'],
                    database: res['database']
                })
            },
            error: () => {
                message.error('Error.');
            },
        });   
    }
    render() {
        const columns = [{
            title: 'Database',
            dataIndex: 'Database',
            key: 'Database',
            width: '15%'
        },{
            title: 'Version',
            dataIndex: 'Version',
            key: 'Version',
            width: '15%'
        },{
            title: 'URL',
            dataIndex: 'URL',
            key: 'URL',
            width: '45%',
            render: URL => (
                <a>{URL}</a>
            )
        },{
            title: 'Function',
            dataIndex: 'Function',
            key: 'Function',
            width: '25%'
        }]
    	return (
    		<div className="container">
    			<div className="statistics-title">
                    {this.state.Meta_Data['sum'] ? (
                        <span>Meta Data: {this.state.Meta_Data['sum'].toLocaleString('zh')}</span>
                    ) : (
                        <span></span>
                    )}
                    <div className="title-line"></div>
                </div>
                <div className="statistics-table">
                    <BarA data={this.state.Meta_Data}/>
                </div>
                <div className="statistics-title">
                    {this.state.Semantic_Relation['sum'] ? (
                        <span>Semantic Relation: {this.state.Semantic_Relation['sum'].toLocaleString('zh')}</span>
                    ) : (
                        <span></span>
                    )}
                    <div className="title-line"></div>
                </div>
                <div className="statistics-table">
                    <BarD data={this.state.Semantic_Relation}/>
                </div>
                <div className="statistics-title">
                    {this.state.Clinical_Evidence['sum'] ? (
                        <span>Clinical Evidence: {this.state.Clinical_Evidence['sum'].toLocaleString('zh')}</span>
                    ) : (
                        <span></span>
                    )}
                    <div className="title-line"></div>
                </div>
                <div className="statistics-table">
                    <BarB data={this.state.Clinical_Evidence}/>
                </div>
                <div className="statistics-title">
                    {this.state.Alteration_Summary['sum'] ? (
                        <span>Alteration Summary: {this.state.Alteration_Summary['sum'].toLocaleString('zh')}</span>
                    ) : (
                        <span></span>
                    )}
                    <div className="title-line"></div>
                </div>
                <div className="statistics-table">
                    <BarC data={this.state.Alteration_Summary}/>
                </div>
                <br></br>
                <div className="statistics-title">
                    <span>Data Source</span>
                    <div className="title-line"></div>
                </div>
                <div style={{width: '100%'}}>
                    <Table columns={columns} dataSource={this.state.database} />
                </div>
    		</div>
    	)
    }
}

export default Statistics;