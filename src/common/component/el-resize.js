import React, {Component} from 'react';

class ElResize extends Component {
    constructor(props) {
        super(props);
        this.resize = _.debounce(() => {
            props.resize && props.resize();
        }, 300);
    }

    createResizeTarget = (el) => {
        const rm = this;
        const obj = document.createElement('object');
        obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1');
        obj.onload = function() {
            this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElemen__;
            this.contentDocument.defaultView.addEventListener('resize', rm.resize);
        };
        obj.type = 'text/html';
        el.appendChild(obj);
        obj.data = 'about:blank';
        return obj;
    }

    componentDidMount() {
        this.resize_target = this.createResizeTarget(this.refs['el-resize']);
    }

    componentWillUnmount() {
        this.resize_target.contentDocument.defaultView.removeEventListener('resize', this.resize);
        this.resize_target.onload = null;
        this.resize_target.parentNode.removeChild(this.resize_target);
        this.resize_target = null;
    }

    render = () => {
        return (
            <div ref="el-resize" style={{width: '100%', height: '100%'}}>
                {this.props.children}
            </div>
        );
    }
}

export default ElResize;
