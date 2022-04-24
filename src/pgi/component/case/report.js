import React, {Component} from 'react';
import { notification, Tabs, Table, Tag, message } from 'antd';
import reqwest from 'reqwest';
import { withRouter } from 'react-router-dom';
import CGI from '../../../common/image/CGI.png'
import CIViC from '../../../common/image/CIViC.png'
import CPIC from '../../../common/image/CPIC.png'
import CPNDS from '../../../common/image/CPNDS.png'
import DPWG from '../../../common/image/DPWG.png'
import FDA from '../../../common/image/FDA.png'
import MyCancerGenome from '../../../common/image/MCG.png'
import NCCN from '../../../common/image/NCCN.png'
import OncoKB from '../../../common/image/OncoKB.png'
import PharmGKB from '../../../common/image/PharmGKB.png'
import PRO from '../../../common/image/PRO.png'
import header from '../../../common/image/header.jpg'

import _ from 'lodash'
import 'pgi/style/p-case-report.less';

const { TabPane } = Tabs;
const columns4 = [{
    title: 'Gene',
    dataIndex: 'Gene',
    key: 'Gene',
    width: '10%',
    sorter: (a, b) => a.Gene.localeCompare(b.Gene),
},{
    title: 'Alteration',
    dataIndex: 'Alteration',
    key: 'Alteration',
    sorter: (a, b) => a.Alteration.localeCompare(b.Alteration),
},{
    title: 'Source',
    dataIndex: 'Source',
    key: 'Source',
    width: '10%',
    sorter: (a, b) => a.Source.localeCompare(b.Source),
},{
    title: 'Consequence',
    dataIndex: 'Consequence',
    key: 'Consequence',
    sorter: (a, b) => a.Consequence.localeCompare(b.Consequence),
    width: '20%',
},{
    title: 'Population AF',
    dataIndex: 'Population_AF',
    key: 'Population_AF',
    // sorter: (a, b) => a.Allele_Frequency - b.Allele_Frequency,
},{
    title: 'Clinical Significance',
    dataIndex: 'Clinical_Significance',
    key: 'Clinical_Significance',
    width: '21%',
}]

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caseid: this.props.caseid,
            status: 0, // 0:waiting, 1:invalid, 2:Running, 3:Done, 4:Failed
            statusText: 'waiting',
            tumor_text: '',
            popu: '',
            time: '',
            LA: '',
            LB: '',
            LC: '',
            LD: '',
            LE: '',
            dataBS: [],
            dataRec: [],
            dataRes: [],
            dataRep: [],
            summary: {}
        };
    }

    componentWillMount () {
        let caseid = this.state.caseid
        const formData = new FormData();
        formData.set("caseid",caseid);
        reqwest({
            url: 'https://premedkb.org:5001/getReport',
            headers: {
                "Content-Security-Policy": "upgrade-insecure-requests"
            },
            method: 'post',
            processData: false,
            data: formData,
            success: (res) => {
                if(res.code == '404'){
                    message.error('Invalid Report ID');
                    this.setState({
                        status: 4,
                        statusText: 'Invalid Report ID'
                    })
                }else if(res.code == '202'){
                    this.setState({
                        status: 1,
                        statusText: 'Running'
                    })
                }else if(res.code == '201'){
                    this.setState({
                        status: 0,
                        statusText: 'Waiting'
                    })
                }else if(res.code == '200'){
                    let L_a = res.summary['Level_A']
                    let L_b = res.summary['Level_B']
                    let L_c = res.summary['Level_C']
                    let L_d = res.summary['Level_D']
                    let L_e = res.summary['Level_E']
                    let L_A = !L_a ? '' :( (L_a['resistance'].length == 0 ? '' :  L_a['resistance'].join(',') + ',' ) + ( L_a['conflict'].length == 0 ? '' : L_a['conflict'].join(',') + ',' ) + L_a['normal'].length == 0 ? '' : L_a['normal'].join(',') ).split(',')
                    let L_B = !L_b ? '' :( (L_b['resistance'].length == 0 ? '' :  L_b['resistance'].join(',') + ',' ) + ( L_b['conflict'].length == 0 ? '' : L_b['conflict'].join(',') + ',' ) + L_b['normal'].length == 0 ? '' : L_b['normal'].join(',') ).split(',')
                    let L_C = !L_c ? '' :( (L_c['resistance'].length == 0 ? '' :  L_c['resistance'].join(',') + ',' ) + ( L_c['conflict'].length == 0 ? '' : L_c['conflict'].join(',') + ',' ) + L_c['normal'].length == 0 ? '' : L_c['normal'].join(',') ).split(',')
                    let L_D = !L_d ? '' :( (L_d['resistance'].length == 0 ? '' :  L_d['resistance'].join(',') + ',' ) + ( L_d['conflict'].length == 0 ? '' : L_d['conflict'].join(',') + ',' ) + L_d['normal'].length == 0 ? '' : L_d['normal'].join(',') ).split(',')
                    let L_E = !L_e ? '' :( (L_e['resistance'].length == 0 ? '' :  L_e['resistance'].join(',') + ',' ) + ( L_e['conflict'].length == 0 ? '' : L_e['conflict'].join(',') + ',' ) + L_e['normal'].length == 0 ? '' : L_e['normal'].join(',') ).split(',')
                    this.setState({
                        dataRec: res.data['Direct_Evidence'],
                        dataRes: res.data['Drug_Response'],
                        dataRep: res.data['Indirect_Evidence'],
                        dataBS: res.data['Biomarker'],
                        status: 2,
                        statusText: 'Done',
                        tumor_text: res.tumor,
                        popu: res.popu,
                        summary: res.summary,
                        time: res.time,
                        LA: L_A,
                        LB: L_B,
                        LC: L_C,
                        LD: L_D,
                        LE: L_E
                    })
                   
                }else {
                    this.setState({
                        status: 3,
                        statusText: 'Failed'
                    })
                }
            },
            error: () => {
                message.error('Error.');
                this.setState({
                    status: 3,
                    statusText: 'Failed'
                })
            },
        });   
    }
    download = () => {
        let url = "https://premedkb.org/case/"+this.state.caseid+"/premedkb-poi-report.zip"
        window.location.href = url
    }
    showTextA = (text) => {
        const len = text.length - 1;
        let nodes = [];
        for (let i = 0; i < len; i++) {
            nodes.push(React.createElement('p' ,{className: 'showP'} , text[i])) 
        }
        const nodeA = React.createElement('a',{ href: text[len]}, text[len])
        const node = React.createElement('div',null, [nodes, nodeA])
        const args = {
            message: 'Explanation',
            description: node,
            duration: 4,
            style: {
                width:700,
                marginLeft: 335 - 700,
            }
        };
        notification.open(args);
    }
    showTextB = (text) => {
        const args = {
            message: 'Explanation',
            description: text,
            duration: 4,
            style: {
                width:700,
                marginLeft: 335 - 700,
            }
        };
        notification.open(args);
    }
    goToHelp = () => {
        console.log(123)
        this.props.history.push('/faq');
    }
    render() {
        const columns3 = [{
            title: 'Gene',
            dataIndex: 'Gene',
            key: 'Gene',
            sorter: (a, b) => a.Gene.localeCompare(b.Gene),
        },{
            title: 'Alteration',
            dataIndex: 'Alteration',
            key: 'Alteration',
            sorter: (a, b) => a.Alteration.localeCompare(b.Alteration),
        },{
            title: 'Allele',
            dataIndex: 'Allele',
            key: 'Allele',
            sorter: (a, b) => a.Allele.localeCompare(b.Allele),
        },{
            title: 'Source',
            dataIndex: 'Source',
            key: 'Source',
            sorter: (a, b) => a.Source.localeCompare(b.Source),
        },{
            title: 'Drugs',
            dataIndex: 'Drugs',
            key: 'Drugs',
            sorter: (a, b) => a.Drugs.localeCompare(b.Drugs),
        },{
            title: 'Response',
            dataIndex: 'Response',
            key: 'Response',
            sorter: (a, b) => a.Responses.localeCompare(b.Responses),
        },{
            title: 'Level',
            dataIndex: 'Level',
            key: 'Level',
            sorter: (a, b) => a.Level.localeCompare(b.Level),
        }
        ,{
            title: 'Level Details',
            dataIndex: 'Level_Details',
            key: 'Level_Details',
            render: Level_Details => (
                <div className="showIcons">
                    {Object.keys(Level_Details).map(i => {
                        return (
                            <img className="showIcon" src={require(`../../../common/image/${i}.png`)} onClick={() => this.showTextA(Level_Details[i])}/>                      
                        );
                    })}
                </div>
            )
        },{
            title: 'Guidelines',
            dataIndex: 'Guidelines',
            key: 'Guidelines',
            render: Guidelines => (
                <div className="showIcons">
                    {Object.keys(Guidelines).map(i => {
                        return (
                            <img className="showIcon" src={require(`../../../common/image/${i}.png`)} onClick={() => this.showTextB(Guidelines[i])}/>                      
                        );
                    })}
                </div>
            )
        }]
        const columns2 = [{
            title: 'Gene',
            dataIndex: 'Gene',
            key: 'Gene',
            width: '10%',
            sorter: (a, b) => a.Gene.localeCompare(b.Gene),
        },{
            title: 'Associated Gene',
            dataIndex: 'Associated_Gene',
            key: 'Associated_Gene',
            width: '15%',
        },{
            title: 'Pathway',
            dataIndex: 'Pathway',
            key: 'Pathway',
            width: '15%',
        },{
            title: 'PPI Score',
            dataIndex: 'PPI_Score',
            key: 'PPI_Score',
            width: '10%',
            sorter: (a, b) => a.PPI_Score - b.PPI_Score,
        },{
            title: 'Drugs',
            dataIndex: 'Drugs',
            key: 'Drugs',
        },{
            title: 'Response',
            dataIndex: 'Response',
            key: 'Response',
        },{
            title: 'Level',
            dataIndex: 'Level',
            key: 'Level',
            sorter: (a, b) => a.Level.localeCompare(b.Level),
        }
        ,{
            title: 'Level Details',
            dataIndex: 'Level_Details',
            key: 'Level_Details',
            render: Level_Details => (
                <div className="showIcons">
                    {Object.keys(Level_Details).map(i => {
                        return (
                            <img className="showIcon" src={require(`../../../common/image/${i}.png`)} onClick={() => this.showTextA(Level_Details[i])}/>                      
                        );
                    })}
                </div>
            )
        },{
            title: 'Guidelines',
            dataIndex: 'Guidelines',
            key: 'Guidelines',
            render: Guidelines => (
                <div className="showIcons">
                    {Object.keys(Guidelines).map(i => {
                        return (
                            <img className="showIcon" src={require(`../../../common/image/${i}.png`)} onClick={() => this.showTextB(Guidelines[i])}/>                      
                        );
                    })}
                </div>
            )
        }]
        const columns1 = [{
            title: 'Gene',
            dataIndex: 'Gene',
            key: 'Gene',
            sorter: (a, b) => a.Gene.localeCompare(b.Gene),
            width:'10%',
        },{
            title: 'Alteration',
            dataIndex: 'Alteration',
            key: 'Alteration',
            sorter: (a, b) => a.Alteration.localeCompare(b.Alteration),
            width: '15%',
        },{
            title: 'Source',
            dataIndex: 'Source',
            key: 'Source',
            sorter: (a, b) => a.Source.localeCompare(b.Source),
        },{
            title: 'Drugs',
            dataIndex: 'Drugs',
            key: 'Drugs',
            sorter: (a, b) => a.Drugs.localeCompare(b.Drugs),
            width: '20%',
        },{
            title: 'Response',
            dataIndex: 'Response',
            key: 'Response',
            width: '15%',
        },{
            title: 'Level',
            dataIndex: 'Level',
            key: 'Level',
            sorter: (a, b) => a.Level.localeCompare(b.Level),
        }
        ,{
            title: 'Level Details',
            dataIndex: 'Level_Details',
            key: 'Level_Details',
            render: Level_Details => (
                <div className="showIcons">
                    {Object.keys(Level_Details).map(i => {
                        return (
                            <img className="showIcon" src={require(`../../../common/image/${i}.png`)} onClick={() => this.showTextA(Level_Details[i])}/>                      
                        );
                    })}
                </div>
            )
        },{
            title: 'Guidelines',
            dataIndex: 'Guidelines',
            key: 'Guidelines',
            render: Guidelines => (
                <div className="showIcons">
                    {Object.keys(Guidelines).map(i => {
                        return (
                            <img className="showIcon" src={require(`../../../common/image/${i}.png`)} onClick={() => this.showTextB(Guidelines[i])}/>                      
                        );
                    })}
                </div>
            )
        }]
        const { Therapies, Alterations, Input, Level_A, Level_C, Level_B, Level_D, Level_E } = this.state.summary
        const { LA, LB, LC, LD, LE } = this.state
        return (
            <div className="report-container">
                <div className="report-content">
                    <div className="report-content-head">
                        <p><b>Report</b> <b style={{fontSize: '16px'}}>{this.state.caseid}</b></p>
                        <p><b>Status</b>: {this.state.statusText}</p>
                        <p style={{display: this.state.tumor_text == '' ? 'none' : 'block'}}><b>Tumor Type</b>: {this.state.tumor_text}</p>
                        <p style={{display: this.state.popu == '' ? 'none' : 'block'}}><b>Reference Population</b>: {this.state.popu}</p> 
                        <p style={{display: this.state.time == '' ? 'none' : 'block'}}><b>Date</b>: {this.state.time}</p>
                    </div>
                    <div className="report-content-img">
                        <img width={140} src={require('../../../common/image/header.jpg')} />
                    </div>
                </div>

                <div className="report-show">
                {
                    this.state.status == 2 ? (
                        <div>
                            <div className="report-show-content">
                                <div className="report-show-content-title">
                                    <b>Summary</b>
                                    <div className="report-show-content-icon">
                                        <img width={16} onClick={this.goToHelp} src={require('../../../common/image/wenhao.png')} />
                                    </div>
                                    <Tag onClick={this.download} color="blue">Download Report</Tag>
                                </div>
                                <div className="report-show-content-text">
                                    <p>There are <span>{Therapies}</span> therapies were selected based on <span>{Alterations}</span> alterations in the <span>{Input}</span>.</p>
                                    <p>Drugs marked with <span style={{color: '#7881FF'}}>*</span><span style={{color: '#FE7503'}}>*</span> should be used with caution: <span style={{color: '#7881FF'}}>*</span> Resistance or adverse response. <span style={{color: '#FE7503'}}>*</span> Conflicts between different knowledgebases.</p>
                                </div>
                                <div className="report-show-content-levels">
                                    { !Level_A === false ? (
                                        <div className="report-show-content-level">
                                            <Tag style={{ minWidth: 72 }} color="#003254"><b>Level A</b></Tag>
                                            {LA.map((drug, index) => {
                                                if (LA.length == index + 1) {
                                                    if (Level_A['resistance'].length > index ) {
                                                        return(
                                                            <span style={{color: '#7881FF'}}>{drug}*</span>
                                                        )
                                                    }else if(Level_A['resistance'].length + Level_A['conflict'].length > index ) {
                                                        return(
                                                            <span style={{color: '#FE7503'}}>{drug}*</span>
                                                        )
                                                    }else {
                                                        return(
                                                            <span>{drug}</span>
                                                        )
                                                    }
                                                }else {
                                                    if (Level_A['resistance'].length > index ) {
                                                        return(
                                                            <span style={{color: '#7881FF'}}>{drug}*<b style={{color: '#000', marginRight: '6px'}}>,</b></span>
                                                        )
                                                    }else if(Level_A['resistance'].length + Level_A['conflict'].length > index ) {
                                                        return(
                                                            <span style={{color: '#FE7503'}}>{drug}*<b style={{color: '#000', marginRight: '6px'}}>,</b></span>
                                                        )
                                                    }else {
                                                        return(
                                                            <span>{drug}<b style={{color: '#000', marginRight: '6px'}}>,</b></span>
                                                        )
                                                    }
                                                }
                                            })}
                                        </div>
                                        ) : <div></div>
                                    }
                                    { !Level_B === false ? (
                                        <div className="report-show-content-level">
                                            <Tag style={{ minWidth: 72 }} color="#1F8050"><b>Level B</b></Tag>
                                            <span style={{width: "100%", display: "inlineBlock"}}>
                                            {LB.map((drug, index) => {
                                                if (LB.length == index + 1) {
                                                    if (Level_B['resistance'].length > index ) {
                                                        return(
                                                            <span style={{color: '#7881FF'}}>{drug}*</span>
                                                        )
                                                    }else if(Level_B['resistance'].length + Level_B['conflict'].length > index ) {
                                                        return(
                                                            <span style={{color: '#FE7503'}}>{drug}*</span>
                                                        )
                                                    }else {
                                                        return(
                                                            <span>{drug}</span>
                                                        )
                                                    }
                                                }else {
                                                    if (Level_B['resistance'].length > index ) {
                                                        return(
                                                            <span style={{color: '#7881FF'}}>{drug}*<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }else if(Level_B['resistance'].length + Level_B['conflict'].length > index ) {
                                                        return(
                                                            <span style={{color: '#FE7503'}}>{drug}*<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }else {
                                                        return(
                                                            <span>{drug}<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }
                                                }
                                            })}
                                            </span>
                                        </div>
                                        ) : <div></div>
                                    }
                                    { !Level_C === false ? (
                                        <div className="report-show-content-level">
                                            <Tag style={{ minWidth: 72 }} color="#ECAC18"><b>Level C</b></Tag>
                                            <span style={{width: "100%", display: "inlineBlock"}}>
                                            {LC.map((drug, index) => {
                                                if (LC.length == index + 1) {
                                                    if (Level_C['resistance'].length > index ) {
                                                        return(
                                                            <span style={{color: '#7881FF'}}>{drug}*</span>
                                                        )
                                                    }else if(Level_C['resistance'].length + Level_C['conflict'].length > index ) {
                                                        return(
                                                            <span style={{color: '#FE7503'}}>{drug}*</span>
                                                        )
                                                    }else {
                                                        return(
                                                            <span>{drug}</span>
                                                        )
                                                    }
                                                }else {
                                                    if (Level_C['resistance'].length > index ) {
                                                        return(
                                                            <span style={{color: '#7881FF'}}>{drug}*<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }else if(Level_C['resistance'].length + Level_C['conflict'].length > index ) {
                                                        return(
                                                            <span style={{color: '#FE7503'}}>{drug}*<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }else {
                                                        return(
                                                            <span>{drug}<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }
                                                }
                                            })}
                                            </span>
                                        </div>
                                        ) : <div></div>
                                    }
                                    { !Level_D === false ? (
                                        <div className="report-show-content-level" style={{display: !Level_D ? 'none' : 'block'}}>
                                            <Tag style={{ minWidth: 72 }} color="#8E0019"><b>Level D</b></Tag>
                                            <span style={{width: "100%", display: "inlineBlock"}}>
                                            {LD.map((drug, index) => {
                                                if (LE.length == index + 1) {
                                                    if (Level_D['resistance'].length > index ) {
                                                        return(
                                                            <span style={{color: '#7881FF'}}>{drug}*</span>
                                                        )
                                                    }else if(Level_D['resistance'].length + Level_D['conflict'].length > index ) {
                                                        return(
                                                            <span style={{color: '#FE7503'}}>{drug}*</span>
                                                        )
                                                    }else {
                                                        return(
                                                            <span>{drug}</span>
                                                        )
                                                    }
                                                }else {
                                                    if (Level_D['resistance'].length > index ) {
                                                        return(
                                                            <span style={{color: '#7881FF'}}>{drug}*<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }else if(Level_D['resistance'].length + Level_D['conflict'].length > index ) {
                                                        return(
                                                            <span style={{color: '#FE7503'}}>{drug}*<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }else {
                                                        return(
                                                            <span>{drug}<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }
                                                }
                                            })}
                                            </span>
                                        </div>
                                        ) : <div></div>
                                    }
                                    { !Level_E === false ? (
                                        <div className="report-show-content-level">
                                            <Tag style={{ minWidth: 72 }} color="#595958"><b>Level E</b></Tag>
                                            <span style={{width: "100%", display: "inlineBlock"}}>
                                            {LE.map((drug, index) => {
                                                if (LE.length == index + 1) {
                                                    if (Level_E['resistance'].length > index ) {
                                                        return(
                                                            <span style={{color: '#7881FF'}}>{drug}*</span>
                                                        )
                                                    }else if(Level_E['resistance'].length + Level_E['conflict'].length > index ) {
                                                        return(
                                                            <span style={{color: '#FE7503'}}>{drug}*</span>
                                                        )
                                                    }else {
                                                        return(
                                                            <span>{drug}</span>
                                                        )
                                                    }
                                                }else {
                                                    if (Level_E['resistance'].length > index ) {
                                                        return(
                                                            <span style={{color: '#7881FF'}}>{drug}*<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }else if(Level_E['resistance'].length + Level_E['conflict'].length > index ) {
                                                        return(
                                                            <span style={{color: '#FE7503'}}>{drug}*<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }else {
                                                        return(
                                                            <span>{drug}<b style={{color: '#000', marginRight: '6px'}}>, </b></span>
                                                        )
                                                    }
                                                }
                                            })}
                                            </span>
                                        </div>
                                        ) : <div></div>
                                    }
                                </div>
                            </div>
                            <Tabs defaultActiveKey="1" type="card" >
                                <TabPane tab="Therapeutic" key="1">
                                <Tabs size="small">
                                    <TabPane tab="Direct Evidence" key="1">
                                        <Table columns={columns1} dataSource={this.state.dataRec} />
                                    </TabPane>
                                    <TabPane tab="Indirect Evidence" key="2">
                                        <Table columns={columns2} dataSource={this.state.dataRep} />
                                    </TabPane>
                                    <TabPane tab="Drug Response" key="3">
                                        <Table columns={columns3} dataSource={this.state.dataRes} />
                                    </TabPane>
                                </Tabs>
                                </TabPane>
                                <TabPane tab="Biomarker" key="4">
                                    <Table columns={columns4} dataSource={this.state.dataBS} />
                                </TabPane>
                            </Tabs>
                        </div>
                    ) : (
                        <div>
                            <div style={{display: this.state.status == 4 ? 'none' : 'block'}}>Waiting for a moment and reload this url to get the report...</div>
                            <div style={{display: this.state.status != 4 ? 'none' : 'block'}}>Invalid Report ID, Please check your URL...</div>
                        </div>
                    )
                }
                </div>
            </div>
        )
    }
}

export default withRouter(Report);