import React, {Component} from 'react';
import ReactECharts from 'echarts-for-react';
import { Table } from 'antd';

export default class BarB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            data: [
          {"value":100, "name": "Level A"},
          {"value":200, "name": "Level B"},
          {"value":300, "name": "Level C"},
          {"value":400, "name": "Level D"},
          {"value":500, "name": "Level E"}
        ],
            number: {},
            percent: {}
        };
    }
    getOption = (pieData) => {
        if(pieData == undefined){
            pieData = [
                {value:335, name:'Level A'},
                {value:310, name:'Level B'},
                {value:234, name:'Level C'},
                {value:135, name:'Level D'},
                {value:1548, name:'Level E'}
            ]
        }
        let option = {
            title: {
                x:'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                y: 'bottom',
            },
            series : [{
                name: 'Name',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data: pieData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        return option;
    }
    getColumnA = () => {
        let column = [{
            title: 'Name',
            dataIndex: 'database',
            key: 'database',
            width: '40%'
        },{
            title: 'Number',
            dataIndex: 'number',
            key: 'number',
            width: '30%',
            render: number => (
                <span>{number.toLocaleString('zh')}</span>
            )
        },{  
            title: 'Percent',
            dataIndex: 'percent',
            key: 'percent',
            render: percent => (
                <span>{(percent * 100).toString().match(/^\d+(?:\.\d{0,2})?/)}%</span>
            )
        }];
        return column;
    }
    getDataA = (num, per) => {
        if(num == undefined){
            num = [100,200,300,400,500]
        }
        if(per == undefined){        
            per = [0.1,0.2,0.3,0.3,0.1]
        }
        // obj[Number][0]
        let data = [{
            key: '1',
            database: 'Level A',
            number: num[0],
            percent: per[0],
        },{
            key: '2',
            database: 'Level B',
            number: num[1],
            percent: per[1],
        },{
            key: '3',
            database: 'Level C',
            number: num[2],
            percent: per[2],
        },{
            key: '4',
            database: 'Level D',
            number: num[3],
            percent: per[3],
        },{
            key: '5',
            database: 'Level E',
            number: num[4],
            percent: per[4],
        }];
        return data;
    }

    onChartReady = (echarts) => {
        console.log('echarts is ready', echarts);
    }

    onChartClick = (param, echarts) => {
        console.log(param, echarts);
        this.setState({
            count: this.state.count + 1,
        });
    };
    render() { 
        let data = this.props['data'];

        return (
            <div style={{width: '100%',display: 'flex'}}>
                <div style={{width: '60%'}}>
                    <Table pagination={false} columns={this.getColumnA()} dataSource={this.getDataA(data['Number'],data['Percent'])} />
                </div>
                <div style={{width: '40%'}}>
                    <ReactECharts
                        option={this.getOption(data['data'])}
                        style={{ height: 400 ,width: '100%', marginTop: '-100px'}}
                        LazyUpdate={true}
                        onEvents={{
                            'click': this.onChartClick
                        }}
                    />
                </div>
            </div>
        );
    }
};