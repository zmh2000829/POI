import React, {Component} from 'react';
import {FOOTER} from 'common/constant';

class Footer extends Component {
    render() {
        return (          //  如果想要多余显示... 加f-toe1这个类
            <div className="g-ft" title={FOOTER.text}>
                {FOOTER.text}
            </div>
        );
    }
}

export default Footer;
