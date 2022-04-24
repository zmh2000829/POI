import React, {Component} from 'react';
import {IGV_URL_PREFIX} from 'common/config';

class IgvChart extends Component {
    constructor(props) {
        super(props);
        this.ready = false;
        this.state = {
            isEmpty: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.symbol !== this.props.symbol && this.ready) {
            this.draw(nextProps);
        }
    }

    componentDidMount() {
        Jt.loader.loadSheets([
            'static/font-awesome/css/font-awesome.css',
            'static/igv/1.0.6/igv.css'
        ]);
        Jt.loader.loadScripts([
            'static/jquery-ui/jquery-ui.min.js',
            'static/igv/1.0.6/igv.min.js'
        ], () => {
            this.ready = true;
            this.draw(this.props);
        });
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy = () => {
        if(this.chart) {
            this.chart.un();
            this.chart = null;
        }
        $(this.refs['igv-chart']).html('');
    }

    draw = ({symbol}) => {
        if(_.isEmpty(symbol)) {
            this.setState({isEmpty: true});
            return;
        }
        this.setState({isEmpty: false});
        const options = {
            showNavigation: true,
            showRuler: true,
            locus: symbol,
            reference: {
                id: "hg19"
            },
            tracks: [{
                name: "Genes",
                //url: "//s3.amazonaws.com/igv.broadinstitute.org/annotations/hg19/genes/gencode.v18.collapsed.bed",
                //url:"//10.157.11.30/genome-viewer/gencode.v18.collapsed.bed",
                //url: "//igv.broadinstitute.org/annotations/hg19/genes/gencode.v18.collapsed.bed",
                url: "//igv.broadinstitute.org/annotations/hg19/genes/gencode.v18.collapsed.bed",
                indexURL: `//${IGV_URL_PREFIX}/genome-viewer/gencode.v18.collapsed.bed.idx`,
                //indexURL: "//s3.amazonaws.com/igv.broadinstitute.org/annotations/hg19/genes/gencode.v18.collapsed.bed.idx",
                //order: Number.MAX_VALUE,
                color: "red",
                displayMode: "EXPANDED"
            }]
        };
        this.chart = igv.createBrowser(this.refs['igv-chart'], options);
    }

    render() {
        const {isEmpty} = this.state;
        return (
            <div ref="igv-chart" className="igv-chart" style={!isEmpty ? {padding: 10} : undefined}>
                {
                    isEmpty ?
                    <div className="no-data-tip">
                        No data
                    </div> :
                    undefined
                }
            </div>
        );
    }
}

export default IgvChart;
