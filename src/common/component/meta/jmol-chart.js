import React, {Component} from 'react';
import {Spin} from 'antd';

class JmolChart extends Component {
    constructor(props) {
        super(props);
        this.ready = false;
        this.state = {
            loading: false,
            isEmpty: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.name !== this.props.name && this.ready) {
            this.draw(nextProps);
        }
    }

    componentDidMount() {
        Jt.loader.loadScripts(['static/jsmol/JSmol.min.nojq.js'], () => {
            this.ready = true;
            this.draw(this.props);
        });
    }

    draw = ({name, height}) => {
        if(_.isEmpty(name)) {
            this.setState({loading: false, isEmpty: true});
            return;
        }
        this.setState({loading: true, isEmpty: false});
        const config = {
            width: '100%',
            height: height || 400,
            dedebug: false,
            j2sPath: "./static/jsmol/j2s",
            color: "0xC0C0C0",
            disableJ2SLoadMonitor: true,
			disableInitialConsole: true,
            addSelectionOptions: false,
            serverURL: "http://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
            use: "HTML5",
            readyFunction: null,
            script: `set zoomLarge false;load $${name}`,
        }
        $.ajax({
            type: 'get',
            url: `https://cactus.nci.nih.gov/chemical/structure/${name}/file?format=sdf&get3d=true`,
            dataType: 'binary'
        })
        .then(() => {
            this.setState({loading: false, isEmpty: false});
            $(this.refs['jmol-chart']).html(Jmol.getAppletHtml("jmolApplet0", config));
        })
        .fail(() => {
            this.setState({loading: false, isEmpty: true});
        });
    }

    render() {
        const {loading, isEmpty} = this.state;
        const {name} = this.props;

        return (
            <Spin spinning={loading}>
                <div className="jmol-chart" ref="jmol-chart" style={loading ? {height: 40} : undefined}>
                    {
                        isEmpty ?
                        <div className="no-data-tip">
                            no {name} chemical structure
                        </div> :
                        undefined
                    }
                </div>
            </Spin>
        );
    }
}

export default JmolChart;
