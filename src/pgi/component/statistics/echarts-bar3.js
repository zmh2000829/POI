import React, {Component} from 'react';
import { Table } from 'antd';
import 'pgi/style/p-statistics.less';
import tri from '../../../common/image/tri.jpg'

export default class BarD extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    getColumnA = () => {
        let column = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '40%'
        },{
            title: 'Number',
            dataIndex: 'Number',
            key: 'Number',
            width: '30%',
            render: Number => (
                <span>{Number.toLocaleString('zh')}</span>
            )
        },{  
            title: 'Percent',
            dataIndex: 'Percent',
            key: 'Percent',
            render: Percent => (
                <span>{(Percent * 100).toString().match(/^\d+(?:\.\d{0,2})?/)}%</span>
            )
        }];
        return column;
    }
    getDataA = (data1,data2) => {
        if(data1 == undefined){
            data1 = [100,200,100,400,150,50]
        }
        if(data2 == undefined){        
            data2 = [0.1, 0.2, 0.1, 0.4, 0.15, 0.05]
        }
        const data = [{
            key: '1',
            name: 'Gene-Variant',
            Number: data1[0],
            Percent: data2[0],
        },{
            key: '2',
            name: 'Disease-Variant',
            Number: data1[1],
            Percent: data2[1],
        },{
            key: '3',
            name: 'Disease-Gene',
            Number: data1[2],
            Percent: data2[2],
        },{
            key: '4',
            name: 'Drug-Gene',
            Number: data1[3],
            Percent: data2[3],
        },{
            key: '5',
            name: 'Drug-Variant',
            Number: data1[4],
            Percent: data2[4],
        },{
            key: '6',
            name: 'Disease-Drug',
            Number: data1[5],
            Percent: data2[5],
        }];
        return data;
    }
    render() { 
        let data = this.props['data'];
        return (
            <div style={{display: 'flex', width: '100%'}}>
            <div style={{width: '60%'}}>
                <Table pagination={false} columns={this.getColumnA()} dataSource={this.getDataA(data['Number'],data['Percent'])} />
                <br></br>
            </div>
            <div style={{width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div>
                    <img width={300} src={require('../../../common/image/tri.jpg')} />
                </div>
            </div>
            </div>
        );
    }
};