import React, {Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Popover, Icon, Slider} from 'antd';
import {WGT_RNG} from 'common/constant';

@inject('snw', 'link')
@observer
class WgtPopover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    onVisibleChange = (visible) => {
        this.setState({visible});
    }

    onChange = (value) => {
        const {snw} = this.props;
        snw.wgts = value;
    }

    onAfterChange = (value) => {
        this.props.onFilter();
    }

    getContent = () => {
        const {snw: {wgts}} = this.props;
        return (
            <Slider
                range
                min={WGT_RNG[0]}
                max={WGT_RNG[1]}
                step={0.1}
                value={toJS(wgts)}
                onChange={this.onChange}
                onAfterChange={this.onAfterChange}
            />
        );
    }

    render() {
        return (
            <Popover
                overlayClassName="wgt-popover"
                placement="bottom"
                trigger="click"
                content={this.getContent()}
                visible={this.state.visible}
                onVisibleChange={this.onVisibleChange}
            >
                <Icon type="filter" className="active"/>
            </Popover>
        );
    }
}

export default WgtPopover;
