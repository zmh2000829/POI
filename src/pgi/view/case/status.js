import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Status from 'pgi/component/case/status';

import 'pgi/style/p-case-add.less';

@observer
class CaseStatus extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="p-common">
                <Status 
                    caseid={this.props.match.params.caseid}
                />
            </div>
        );
    }
}

export default CaseStatus;
