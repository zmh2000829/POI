import React, {Component} from 'react';
import { Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import 'pgi/style/p-statistics.less';

export default class BarC extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    getOption = (data1,data2) => {
        if(data1 == undefined){
            data1 = [3765, 1000, 120, 130, 142, 370]
        }
        if(data2 == undefined){        
            data2 = [1700, 510, 90, 88, 50, 93]
        }
        let option = {
            tooltip: {},
            legend: {
                y: 'bottom',       
                data:['Somatic','Germline']
            },
            xAxis: {
                data: ['SNV', 'INDEL', 'CNV', 'Expression', 'Trans', 'Others']
            },
            yAxis: {},
            series: [{
                name: 'Somatic',
                type: 'bar',
                barWidth : 20,
                data: data1
            },{
                name: 'Germline',
                type: 'bar',
                barWidth : 20,
                data: data2
            }]
        };
        return option;
    }
    getColumnA = () => {
        let column = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '40%'
        },{
            title: 'Somatic Number',
            dataIndex: 'Somatic',
            key: 'Somatic',
            width: '30%',
            render: Somatic => (
                <span>{Somatic.toLocaleString('zh')}</span>
            )
        },{  
            title: 'Germline Number',
            dataIndex: 'Germline',
            key: 'Germline',
            render: Germline => (
                <span>{Germline.toLocaleString('zh')}</span>
            )
        }];
        return column;
    }
    getDataA = (data1,data2) => {
        if(data1 == undefined){
            data1 = [3765, 1000, 120, 130, 142, 370]
        }
        if(data2 == undefined){        
            data2 = [1700, 510, 90, 88, 50, 93]
        }
        const data = [{
            key: '1',
            name: 'SNV',
            Somatic: data1[0],
            Germline: data2[0],
        },{
            key: '2',
            name: 'INDEL',
            Somatic: data1[1],
            Germline: data2[1],
        },{
            key: '3',
            name: 'CNV',
            Somatic: data1[2],
            Germline: data2[2],
        },{
            key: '4',
            name: 'Expression',
            Somatic: data1[3],
            Germline: data2[3],
        },{
            key: '5',
            name: 'Translocation',
            Somatic: data1[4],
            Germline: data2[4],
        },{
            key: '6',
            name: 'Others',
            Somatic: data1[5],
            Germline: data2[5],
        }];
        return data;
    }
    render() { 
        let data = this.props['data'];
        return (
            <div style={{display: 'flex', width: '100%'}}>
            <div style={{width: '60%'}}>
                <Table pagination={false} columns={this.getColumnA()} dataSource={this.getDataA(data['Somatic'],data['Germline'])} />
            </div>
            <div style={{width: '40%'}}>
                <ReactECharts
                    option={this.getOption(data['Somatic'],data['Germline'])}
                    style={{ width: '100%' ,marginTop: '0px',marginLeft: '20px'}}
                    opts={{ renderer: 'svg' }}
                 />
            </div>
            </div>
        );
    }
};