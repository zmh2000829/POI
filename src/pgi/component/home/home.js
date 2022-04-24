import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import 'pgi/style/p-case-add.less';
import reqwest from 'reqwest';
import headerimg from '../../../common/image/home.jpg'

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	componentDidMount () {
		reqwest({
            url: 'https://premedkb.org:5001/count_num',
            method: 'get',
            headers: {
                "Content-Security-Policy": "upgrade-insecure-requests"
            },
            processData: false,
            success: (res) => {
                console.log(res)
            },
            error: () => {

            },
        });
	}

	render() {
		return (
			<div className="container">
				<div className="introduction">
					<div className="introduction-title-1">PreMedKB-POI</div>
					<div className="introduction-title">
						<span>P</span>ersonal <span>O</span>mics <span>I</span>
						nterpreter for Precision Oncology Therapeutics
					</div>
					<div className="introduction-text">
					<p>Deciphering a broader range of genomic and transcriptomic alterations based on harmonized therapeutic </p>
					<p>knowledge for more precise and comprehensive cancer drug recommendations</p>

					</div>
					<br></br>
					<div className="introduction-image">
						<img className="introduction-img" src={headerimg} />
					</div>
					<br></br>
					<div className="introduction-btn">
						<Button size='large'>
						  <Link to="/case/add">Get Started</Link>
						</Button>
					</div>
					<br></br>
				</div>
				<br></br>
			</div>
		)
	}
}

export default Home;