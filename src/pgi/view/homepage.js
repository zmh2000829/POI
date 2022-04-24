import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Home from 'pgi/component/home/home';

import 'pgi/style/p-case-add.less';

@observer
class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="p-common pgi-case-add">
                <Home/>
            </div>
        );
    }
}

export default HomePage;
