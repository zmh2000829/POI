import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { message, Modal } from 'antd';
import reqwest from 'reqwest';
import 'pgi/style/p-case-status.less';

class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caseid: this.props.caseid,
            status: 0, // 0:waiting, 1:invalid, 2:Done, 3:Failed
            statusText: 'waiting',
            tumor_text: '',
            popu: '',
            loading: true,
            url: '',
            time: '',
            modal: ''
        };
    }

    componentWillMount () {
        let caseid = this.state.caseid;
        const formData = new FormData();
        formData.set("caseid",caseid);
        reqwest({
            url: 'https://premedkb.org:5001/checkValid',
            method: 'post',
            headers: {
                "Content-Security-Policy": "upgrade-insecure-requests"
            },
            processData: false,
            data: formData,
            success: (res) => {
                if(res.code == '404'){
                    message.error('invalid Submission ID');
                    this.setState({
                        status: 1,
                        statusText: 'invalid Submission ID'
                    })
                }else {
                    this.setState({
                        status: 2,
                        statusText: 'Done',
                        tumor_text: res.tumor,
                        popu: res.popu,
                        time: res.time,
                        url: '/case/report/' + caseid
                    })
                }
            },
            error: () => {
                message.error('Error.');
                this.setState({
                    status: 3,
                    statusText: 'invalid Submission ID'
                })
            },
        });   
    }

    showModal = () => {
        this.setState({
            modal: true
        })
    }
    handleOk = () => {
        this.setState({
            modal: false
        })
        this.props.history.push('/case/report/' + this.state.caseid);
    }
    handleCancel = () => {
        this.setState({
            modal: false
        })
    };

    render() {
        return (
            <div className="status-container">
                <div className="status-content-head">
                    <p>Submission <b>{this.state.caseid}</b></p>
                    <p>Status: <b>{this.state.statusText}</b></p>
                    <p style={{display: this.state.tumor_text == '' ? 'none' : 'block'}}>Tumor Type: <b>{this.state.tumor_text}</b></p>
                    <p style={{display: this.state.popu == '' ? 'none' : 'block'}}>Reference Population: <b>{this.state.popu}</b></p>
                    <p style={{display: this.state.time == '' ? 'none' : 'block'}}>Date: <b>{this.state.time}</b></p>
                </div>
                <br></br>
                {
                    this.state.status == 2 ? (
                        <div>
                            <div className="status-content">
                                <p>Your submission has been received by the PreMedPGI server at <b>{this.state.time}</b></p>
                                <p>The results will be generated at 
                                <a onClick={this.showModal}> https://premedkb.org/#{this.state.url} </a>
                                after the computation is done. </p>
                                <br></br>
                                <br></br>
                                <Modal title="Notice" visible={this.state.modal} okText="Go" onOk={this.handleOk} onCancel={this.handleCancel}>
                                    <span>Please ensure that you have saved this report URL:</span>
                                    <Link to={this.state.url}> https://premedkb.org/#{this.state.url} </Link>
                                    <p>Otherwise it will not be retrievable</p>
                                </Modal>
                                <b>NOTES</b>
                                <p style={{marginTop: '12px'}}>1. We recommend that you save the URL of the interpretation report, for example as a bookmark, 
                                    and then come back some time later to view the results. It is also possible to keep the browser open until the results appear.
                                    </p>
                                <p style={{marginTop: '12px'}}>2. All information, including raw data and interpretation reports, will be deleted <b>within 7 days.</b></p>
                                <p style={{marginTop: '12px'}}>3. If you are using <b>Demo</b> data to submit a task, you will get a pre-generated report immediately. 
                                    PreMedKB-POI often <b>requires a longer time</b> to interpret multi-omics data from a patient, especially when germline VCF is included. 
                                    If you want to experience the real computing process, try submitting the real data you have, or go to the <b>Example</b> page to learn more.</p>
                            </div>
                            <br></br>
                        </div>
                    ) : (
                        <div></div>
                    )
                }
                
            </div>
        )
    }
}

export default withRouter(Status);