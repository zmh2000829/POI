import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import AddForm from 'pgi/component/case/add-form';

import 'pgi/style/p-case-add.less';

@observer
class Add extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="p-common pgi-case-add">
                <AddForm/>
            </div>
        );
    }
}

export default Add;
