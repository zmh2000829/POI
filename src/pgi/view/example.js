import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Example from 'pgi/component/example/example';

import 'pgi/style/p-case-add.less';

@observer
class ShowExample extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="p-common pgi-case-add">
                <Example/>
            </div>
        );
    }
}

export default ShowExample;
