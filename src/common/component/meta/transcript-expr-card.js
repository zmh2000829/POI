import React, {Component} from 'react';
import {Spin, Card, Select} from 'antd';
import axios from 'axios';
import {heatmap} from 'static/heatmap/heatmap';
import {getRequest, getENSTID} from 'static/heatmap/idconvertor';
import {LEVEL4_URL_PREFIX, ENSG2T_URL_PREFIX} from 'common/config';

const SelectOption = Select.Option;

class TranscriptExprCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isEmpty: false,
            pjtName: _.get(props.projects, '[0].project_name')
        }
    }

    componentWillReceiveProps(nextProps) {
        const pjtName = _.get(nextProps.projects, '[0].project_name');
        if(pjtName !== this.state.pjtName) {
            this.setState({pjtName});
        }
        const ensembl_id = nextProps.ensembl_id;
        if(ensembl_id != this.props.ensembl_id || pjtName != this.props.pjtName) {
            this.draw({
                project_name: pjtName,
                ensembl_id: ensembl_id,
                sub_project_name: nextProps.subPjtName
            });
        }
    }

    onPjtChg = (value) => {
        this.setState({pjtName: value}, () => {
            this.draw({
                project_name: value,
                sub_project_name: this.props.subPjtName,
                ensembl_id: this.props.ensembl_id
            });
        });
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy = () => {
        if(this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        $(this.refs['transcript-expr-chart']).html('');
    }

    draw = ({project_name, ensembl_id, sub_project_name}) => {
        if(!project_name || !ensembl_id) {
            this.destroy();
            this.setState({isEmpty: true});
            return;
        }
        this.setState({loading: true});
        const config = {
            'forceFit': true,
            'queryData': {
                'geneEnsemblID': ensembl_id,
                'projectName': project_name,
                'loader': 'transcripts_heatmap',
                'transcriptEnsemblIdLst': null,
                'subprojectName': sub_project_name,
            },
            'apiPrefix': {
                'idConvertorApiPrefix': `${ENSG2T_URL_PREFIX}/ensg2t/ensg2t`,
                'transQueryApiPrefix': `${LEVEL4_URL_PREFIX}/pgx-level4/level4data/api/v1/`
            },
            'title': 'Transcript Expression Value in Tissues'
        };
        getRequest(config.queryData.geneEnsemblID, config.apiPrefix.idConvertorApiPrefix)
        .then((response) => {
            const transcript_ensembl_id_lst = getENSTID(response);
            if(_.isEmpty(transcript_ensembl_id_lst)) {
                return Promise.reject(new Error('no data'));
            }
            return axios({
                method: 'post',
                url: config.apiPrefix.transQueryApiPrefix + 'transcripts/queries',
                data: {
                    transcript_ensembl_id_lst,
                    project_name: config.queryData.projectName,
                    gene_ensembl_id: config.queryData.geneEnsemblID,
                    subproject_name: config.queryData.subprojectName,
                    loader: config.queryData.loader
                }
            });
        })
        .then((response) => {
            const id = _.get(response, 'data.data.id');
            if(_.isEmpty(id)) {
                return Promise.reject(new Error('no data'));
            }
            return axios({
                method: 'get',
                url: config.apiPrefix.transQueryApiPrefix + "exprinfo/" + id + "?loader=" + config.queryData.loader
            });
        })
        .then((response) => {
            const data = _.get(response, 'data.data') || {};
            if(_.isEmpty(data.data) || _.isEmpty(data.transcript_ids)) {
                return Promise.reject(new Error('no data'));
            }
            const width = $(this.refs['transcript-expr-chart']).width();
            config.height = (width - 200) / data.data.length * data.transcript_ids.length + 150;
            if(config.height < 300) {
                config.height = 300;
            }

            this.setState({loading: false, isEmpty: false}, () => {
                this.chart = heatmap(`transcript-expr-${sub_project_name}-${ensembl_id}`, data, config);
                this.chart.render();
            });
        })
        .catch(() => {
            this.destroy();
            this.setState({loading: false, isEmpty: true});
        });;
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
        const {subPjtName, ensembl_id, title} = this.props;
        const {loading, isEmpty} = this.state;
        return (
            <Spin spinning={loading}>
                <Card title={title} extra={this.getExtraTpl()}>
                    {
                        isEmpty ?
                        <div key="1" className="no-data-tip">
                            No data
                        </div> :
                        <div key="2" id={`transcript-expr-${subPjtName}-${ensembl_id}`} ref="transcript-expr-chart" className="transcript-expr-chart"></div>
                    }
                </Card>
            </Spin>
        );
    }
}

export default TranscriptExprCard;
