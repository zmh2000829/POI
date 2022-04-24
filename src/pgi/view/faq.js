import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Faq from 'pgi/component/help/Faq';

import 'pgi/style/p-case-add.less';

@observer
class HelpFaq extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="p-common pgi-case-add">
                <Faq/>
            </div>
        );
    }
}

export default HelpFaq;
