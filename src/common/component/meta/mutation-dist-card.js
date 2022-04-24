import React, {Component} from 'react';
import {Spin, Card, Select} from 'antd';
import axios from 'axios';
import needle from 'static/needle/src/js/MutsNeedlePlot';
import {LEVEL4_URL_PREFIX} from 'common/config';

const SelectOption = Select.Option;

class MutationDistCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isEmpty: false,
            pjtName: _.get(props.projects, '[0].project_name')
        };
    }

    componentWillReceiveProps(nextProps) {
        const pjtName = _.get(nextProps.projects, '[0].project_name');
        if(pjtName !== this.state.pjtName) {
            this.setState({pjtName});
        }
        const ensembl_id = nextProps.ensembl_id;
        if(ensembl_id != this.props.ensembl_id || pjtName !== this.props.pjtName) {
            this.draw({
                project_name: pjtName,
                ensembl_id: ensembl_id,
            });
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    onPjtChg = (value) => {
        this.setState({pjtName: value}, () => {
            this.draw({
                project_name: value,
                ensembl_id: this.props.ensembl_id
            });
        });
    }

    destroy = () => {
        if(this.chart) {
            this.chart.unbind();
            this.chart = null;
        }
        $(this.refs['mutation-dist-chart']).html('');
        $('.d3-tip-needle, .d3-tip-selection').remove();
    }

    draw = ({project_name, ensembl_id}) => {
        if(!project_name || !ensembl_id) {
            this.destroy();
            this.setState({isEmpty: true});
            return;
        }
        this.setState({loading: true});
        const url = `${LEVEL4_URL_PREFIX}/pgx-level4/level4data/api/v1/mutations/${ensembl_id}?project_name=${project_name}&loader=mutation_gene_needle`;
        axios.get(url).then(({data}) => {
            if(data.data && data.data.length) {
                this.destroy();
                this.setState({loading: false, isEmpty: false}, () => {
                    const colorMap = {
                        // mutation categories
                        "missense_variant": "yellow",
                        "frameshift_variant": "blue",
                        "stop_gained": "red",
                        "stop_lost": "orange",
                        "synonymous_variant": "lightblue",
                        // regions
                        "X-binding": "olive",
                        "region1": "olive"
                    };
                    const legends = {
                        x: "Corresponding gene positions to gene " + ensembl_id,
                        y: "Number of recorded mutation in gene " + ensembl_id
                    };
                    const width = $(this.refs['mutation-dist-chart']).width();
                    const height = 500;
                    const plotConfig = {
                        width,
                        height,
                        colorMap,
                        legends,
                        responsive: 'resize',
                        targetElement: this.refs['mutation-dist-chart'],
                        maxCoord: data.metadata.max_coord,
                        minCoord: data.metadata.min_coord,
                        mutationData: data.data
                    };
                    this.chart = new needle.MutsNeedlePlot(plotConfig);
                });
            } else {
                return Promise.reject(new Error('no data'));
            }
        })
        .catch(() => {
            this.destroy();
            this.setState({loading: false, isEmpty: true});
        });
    }

    getExtraTpl = () => {
        const {projects} = this.props;
        const {pjtName} = this.state;
        return (
            <div className="m-extra">
                <div className="item-wrap pjt-name-wrap">
                    <div className="item-label">Project Name: </div>
                    <div className="item-value">
                        <Select value={pjtName} onChange={this.onPjtChg}>
                            {
                                projects.map(item => {
                                    return (
                                        <SelectOption key={item.project_id} value={item.project_name}>{item.project_name}</SelectOption>
                                    );
                                })
                            }
                        </Select>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {loading, isEmpty} = this.state;
        return (
            <Spin spinning={loading}>
                <Card title="Mutations distribution along sequence" extra={this.getExtraTpl()}>
                    {
                        isEmpty ?
                        <div key="1" className="no-data-tip">
                            No data
                        </div> :
                        <div key="2" className={['mutation-dist-chart']} ref="mutation-dist-chart"></div>
                    }
                </Card>
            </Spin>
        );
    }
}

export default MutationDistCard;
