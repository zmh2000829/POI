import React, {Component} from 'react';
import { Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import 'pgi/style/p-statistics.less';

export default class BarA extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    getOption = (data1,data2) => {
        if(data1 == undefined){
            data1 = [11388, 540, 455, 1354]
        }
        if(data2 == undefined){        
            data2 = [2472705, 64919, 30259, 34382]
        }
        data1 = data1.map(i => {
            return Math.log10(i).toFixed(2)
        })
        data2 = data2.map(i => {
            return Math.log10(i).toFixed(2)
        })
        let option = {
            tooltip: {},
            legend: {
                y: 'bottom',       
                data:['Therapeutic','Total']
            },
            xAxis: {
                data: ['Variant', 'Gene', 'Disease', 'Drug']
            },
            yAxis: {
                name: 'log10(Number)'
            },
            series: [{
                name: 'Therapeutic',
                type: 'bar',
                barWidth : 20,
                data: data1
            },{
                name: 'Total',
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
            title: 'Therapeutic Number',
            dataIndex: 'Therapeutic',
            key: 'Therapeutic',
            width: '30%',
            render: Therapeutic => (
                <span>{Therapeutic.toLocaleString('zh')}</span>
            )
        },{  
            title: 'Total Number',
            dataIndex: 'Total',
            key: 'Total',
            render: Total => (
                <span>{Total.toLocaleString('zh')}</span>
            )
        }];
        return column;
    }
    getDataA = (data1,data2) => {
        if(data1 == undefined){
            data1 = [11388, 540, 455, 1354]
        }
        if(data2 == undefined){        
            data2 = [2472705, 64919, 30259, 34382]
        }
        const data = [{
            key: '1',
            name: 'Variant',
            Therapeutic: data1[0],
            Total: data2[0],
        },{
            key: '2',
            name: 'Gene',
            Therapeutic: data1[1],
            Total: data2[1],
        },{
            key: '3',
            name: 'Disease',
            Therapeutic: data1[2],
            Total: data2[2],
        },{
            key: '4',
            name: 'Drug',
            Therapeutic: data1[3],
            Total: data2[3],
        }];
        return data;
    }
    render() { 
        let data = this.props['data'];
        return (
            <div style={{display: 'flex', width: '100%'}}>
            <div style={{width: '60%'}}>
                <Table pagination={false} columns={this.getColumnA()} dataSource={this.getDataA(data['Therapeutic'],data['Total'])} />
            </div>
            <div style={{width: '40%'}}>
                <ReactECharts
                    option={this.getOption(data['Therapeutic'],data['Total'])}
                    style={{ width: '100%' ,marginTop: '-30px',marginLeft: '20px'}}
                    opts={{ renderer: 'svg' }}
                 />
            </div>
            </div>
        );
    }
};