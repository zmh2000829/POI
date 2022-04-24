import React, {Component} from 'react';
import {Spin, Card, Select} from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import axios from 'axios';
import {LEVEL4_URL_PREFIX} from 'common/config';

const SelectOption = Select.Option;

class GeneExprCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isEmpty: false,
            viewType: 'fpkm',
            pjtName: _.get(props.projects, '[0].project_name')
        }
    }

    componentWillReceiveProps(nextProps) {
        const pjtName = _.get(nextProps.projects, '[0].project_name');
        if(pjtName !== this.state.pjtName) {
            this.setState({pjtName});
        }
        const ensembl_id = nextProps.ensembl_id;
        if(ensembl_id !== this.props.ensembl_id || pjtName !== this.props.pjtName) {
            this.loadData({
                project_name: pjtName,
                ensembl_id: ensembl_id
            });
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    onPjtChg = (value) => {
        this.setState({pjtName: value}, () => {
            this.loadData({
                project_name: value,
                ensembl_id: this.props.ensembl_id
            });
        });
    }

    onViewTypeChg = (value) => {
        this.setState({viewType: value}, function() {
            if(!this.gtex_values && !this.tcga_vals) {
                return;
            }
            this.draw();
        });
    }

    destroy = () => {
        if(this.chart) {
            this.chart.dispose();
            this.chart = null;
        }
        this.legend = null;
        this.gtex_labs = null;
        this.gtex_vals = null;
        this.tcga_labs = null;
        this.tcga_vals = null;
    }

    draw = () => {
        if(!this.chart) {
            this.chart = echarts.init(this.refs['gene-expr-chart']);
        }
        this.chart.setOption(this.getChartOpts());
    }

    getChartOpts = () => {
        const {viewType} = this.state;
        const {ensembl_id} = this.props;
        const data = this.formatData(this.gtex_labs, this.gtex_vals, this.tcga_labs, this.tcga_vals, viewType);
        const name = viewType === 'fpkm' ? '' : 'log2(FPKM+0.01)';
        return {
            title: {
                text: ensembl_id,
                subtext: name
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {data: this.legend},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                name,
                nameLocation: 'middle',
                nameGap: 25,
                nameTextStyle: {
                  color: '#aaa'
                },
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: data.yAxis
            },
            series: [
                {
                    name: this.legend[0],
                    type: 'bar',
                    data: data.gtex,
                    itemStyle: {
                        normal: {
                            color: '#60C0DD',
                            barBorderRadius: 3
                        }
                    }
                }, {
                    name: this.legend[1],
                    type: 'bar',
                    data: data.tcga,
                    itemStyle: {
                        normal: {
                            color: '#FCCE10',
                            barBorderRadius: 3
                        }
                    }
                }
            ]
        };
    }

    formatData = (gtex_labs, gtex_vals, tcga_labs, tcga_vals, viewType) => {
        const gtex_arr = [];
        for(let i = 0, len = gtex_labs.length; i < len; i++) {
            gtex_arr.push({lab: gtex_labs[i], val: gtex_vals[i]});
        }
        gtex_arr.sort((a, b) => {
            return -a.lab.substr(0, 1).toLowerCase().charCodeAt() + b.lab.substr(0, 1).toLowerCase().charCodeAt();
        });
        const tcga_map = {};
        for(let i = 0, len = tcga_labs.length; i < len; i++) {
            tcga_map[tcga_labs[i]] = tcga_vals[i];
        }
        const commons = [];
        const gtex_vals_n = [];
        const tcga_vals_n = [];
        for (let i = 0, len = gtex_arr.length; i < len; i++) {
            if (tcga_map[gtex_arr[i].lab]) {
                commons.push(gtex_arr[i].lab);
                if (viewType === 'fpkm') {
                    gtex_vals_n.push((Math.pow(2, gtex_arr[i].val) - 0.01).toFixed(3));
                    tcga_vals_n.push((Math.pow(2, tcga_map[gtex_arr[i].lab]) - 0.01).toFixed(3));
                } else {
                    gtex_vals_n.push(gtex_arr[i].val.toFixed(3));
                    tcga_vals_n.push(tcga_map[gtex_arr[i].lab].toFixed(3));
                }
            }
        }
        return {yAxis: commons, gtex: gtex_vals_n, tcga: tcga_vals_n};
    }

    loadData = ({project_name, ensembl_id}) => {
        if(!project_name || !ensembl_id) {
            this.destroy();
            this.setState({isEmpty: true});
            return;
        }
        this.setState({loading: true});
        const url = `${LEVEL4_URL_PREFIX}/pgx-level4/level4data/api/v1/gene/${ensembl_id}?project_name=${project_name}`;
        axios.get(url)
        .then(({data}) => {
            if(_.isEmpty(data)) {
                return Promise.reject(new Error('no data'));
            }
            const {subproject_name, expr_value_lst, source_type} = data;
            if(_.isEmpty(subproject_name) || _.isEmpty(expr_value_lst) || _.isEmpty(source_type)) {
                return Promise.reject(new Error('no data'));
            }
            const lastIndex = subproject_name.lastIndexOf('GTEx');
            const length = expr_value_lst.length;
            this.gtex_vals = expr_value_lst.slice(0, lastIndex);
            this.gtex_labs = source_type.slice(0, lastIndex);
            this.tcga_vals = expr_value_lst.slice(lastIndex, length);
            this.tcga_labs = source_type.slice(lastIndex, length);
            this.legend = _.uniq(subproject_name);
            this.setState({loading: false, isEmpty: false}, this.draw);
        })
        .catch(() => {
            this.destroy();
            this.setState({loading: false, isEmpty: true});
        });
    }

    getExtraTpl = () => {
        const {projects} = this.props;
        const {pjtName, viewType} = this.state;
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
                <div className="item-wrap view-type-wrap">
                    <div className="item-label">View Type: </div>
                    <div className="item-value">
                        <Select value={viewType} onChange={this.onViewTypeChg}>
                            <SelectOption value="fpkm">fpkm</SelectOption>
                            <SelectOption value="log">log</SelectOption>
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
                <Card className="gene-expr-card" title="Expression Profile On Gene Level" extra={this.getExtraTpl()}>
                    {
                        isEmpty ?
                        <div key="1" className="no-data-tip">
                            No data
                        </div> :
                        <div key="2" ref="gene-expr-chart" className="gene-expr-chart"></div>
                    }
                </Card>
            </Spin>
        );
    }
}

export default GeneExprCard;
