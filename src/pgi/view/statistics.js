import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Statistics from 'pgi/component/statistics/statistics';

import 'pgi/style/p-case-add.less';

@observer
class ShowStatistics extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="p-common pgi-case-add">
                <Statistics/>
            </div>
        );
    }
}

export default ShowStatistics;
