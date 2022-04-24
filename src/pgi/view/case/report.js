import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Report from 'pgi/component/case/report';

import 'pgi/style/p-case-add.less';

@observer
class CaseReport extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="p-common-1 pgi-case-add">
                <Report caseid={this.props.match.params.caseid}/>
            </div>
        );
    }
}

export default CaseReport;
