import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { message, Modal } from 'antd';
import reqwest from 'reqwest';
import 'pgi/style/p-example.less';

class Example extends Component {
	constructor(props) {
        super(props);
        this.state = {
            example1: '',
            example2: '',
            example3: ''
        };
    }
    componentWillMount () {
        reqwest({
            url: 'https://premedkb.org:5001/getExample',
            method: 'get',
            headers: {
                "Content-Security-Policy": "upgrade-insecure-requests"
            },
            processData: false,
            success: (res) => {
                console.log(res.data)
                this.setState({
                    example1: res.data[0],
                    example2: res.data[1],
                    example3: res.data[2]
                })
            },
            error: () => {
                message.error('Error.');
            },
        });   
    }
    render() {
        const example1 = "/case/report/" + this.state.example1
        const example2 = "/case/report/" + this.state.example2
        const example3 = "/case/report/" + this.state.example3
    	return (
    		<div className="container">
                <div style={{fontSize: '16px', paddingRight: '20px'}}>These examples are used to get users acquainted with our system more quickly. 
                    Users can view the detailed formats of the files that the system requires to be uploaded in the Input part, 
                    and the corresponding reports generated by the system based on the uploaded files in the Output part.</div>
                <br></br>
                <div className="example-title">
                <b>Example 1</b>
                </div>
                <div className="example-content">
                    <div className="example-content-input">
                        <b>• Input: </b>
                        <a href="https://premedkb.org/case/example1.zip"> example1.zip </a>
                    </div>
                    <div className="example-content-output">
                        <b>• Output: </b>
                        <Link to={example1}> Link to the report </Link>
                    </div>
                </div>
                <br></br>
                <div className="example-title">
                    <b>Example 2</b>
                </div>
                <div className="example-content">
                    <div className="example-content-input">
                        <b>• Input: </b>
                        <a href="https://premedkb.org/case/example2.zip"> example2.zip </a>
                    </div>
                    <div className="example-content-output">
                        <b>• Output: </b>
                        <Link to={example2}> Link to the report </Link>
                    </div>
                </div>
                <br></br>
                <div className="example-title">
                    <b>Example 3</b>
                </div>
                <div className="example-content">
                    <div className="example-content-input">
                        <b>• Input: </b>
                        <a href="https://premedkb.org/case/example3.zip"> example3.zip </a>
                    </div>
                    <div className="example-content-output">
                        <b>• Output: </b>
                        <Link to={example3}> Link to the report </Link>
                    </div>
                </div>
    		</div>
    	)
    }
}

export default Example;