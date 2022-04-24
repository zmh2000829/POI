import React, {Component} from 'react';
import {Spin, Icon} from 'antd';
import axios from 'axios';
import tools from 'static/bodymap/jstools';
import mapPath from 'static/bodymap/MapPath';
import Raphael from 'static/bodymap/raphael';
import {LEVEL4_URL_PREFIX} from 'common/config';

const set_box = tools['set_box'];
const get_data = tools['get_data'];
const get_organs = tools['get_organs'];
const show_value = tools['show_value'];
const paintMap = mapPath['paintMap'];
const colors = mapPath['colors'];

class Bodymap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isEmpty: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.ensembl_id !== this.props.ensembl_id) {
            this.draw(nextProps);
        }
    }

    draw = ({ensembl_id}) => {
        if(!ensembl_id) {
            this.setState({loading: false, isEmpty: true});
            return;
        }
        this.setState({loading: true, isEmpty: false});
        const url = LEVEL4_URL_PREFIX + '/pgx-level4/level4data/api/v1/gene/' + ensembl_id + '?project_name=ExpressionMean&loader=gene_bodymap';
        axios.get(url)
        .then(({data}) => {
            if(_.isEmpty(data) || _.isEmpty(data.data) || _.isEmpty(data.data.normal_data) || _.isEmpty(data.data.tumor_data)) {
                return Promise.reject(new Error('no data'));
            }
            this.setState({loading: false, isEmpty: false}, () => {
                this.refs['bodymap'].style.display = 'flex';

                const {normal_data, tumor_data} = data.data;
                const norm_R = Raphael(this.refs['normal-map'], 1000, 1500);
                const norm_bodymap = paintMap(norm_R);
                set_box(norm_bodymap, normal_data, norm_R);
                get_data(norm_bodymap, colors['normal'], normal_data);
                const organs_n = get_organs(normal_data);
                for(let i = 0, len = organs_n.length; i < len; i++) {
                    const organ = organs_n[i];
                    show_value(organ, norm_bodymap, colors['normal'], norm_R, normal_data);
                }
                const tumor_R = Raphael(this.refs['tumor-map'], 1000, 1500);
                const tumor_bodymap = paintMap(tumor_R);
                set_box(tumor_bodymap, tumor_data, tumor_R);
                get_data(tumor_bodymap, colors['tumor'], tumor_data);
                const organs_t = get_organs(tumor_data);
                for(let i = 0, len = organs_t.length; i < len; i++) {
                    const organ = organs_t[i];
                    show_value(organ, tumor_bodymap, colors['tumor'], tumor_R, tumor_data);
                }
            });
        })
        .catch(() => {
            this.setState({loading: false, isEmpty: true});
        });
    }

    render() {
        const {loading, isEmpty} = this.state;
        return (
            <Spin spinning={loading}>
                <div className="bodymap-wrap">
                    {
                        isEmpty ?
                        <div className="no-data-tip">
                            No data
                        </div> :
                        <div className="bodymap" ref="bodymap">
                            <div className="normal-svg">
                                <div ref="normal-map" className="normal-map"></div>
                            </div>
                            <div className="tumor-svg">
                                <div ref="tumor-map" className="tumor-map"></div>
                            </div>
                        </div>
                    }
                </div>
            </Spin>
        );
    }
}

export default Bodymap;
