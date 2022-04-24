import React,{Component} from 'react';
import {observer, inject} from 'mobx-react';
import {Card} from 'antd';
import IgvChart from './igv-chart';

@inject('meta')
@observer
class Variant extends Component {
    getTranscriptVarTpl = (data = []) => {
        const res = [];
        data.forEach(item => {
            for(let key in item) {
                res.push(key + ' : ' + item[key]);
            }
        });
        return res.join(' , ');
    }

    render() {
        const {meta: {active_meta, variant}} = this.props;
        return (
            <div className="m-variant">
                <div className="meta-hd">
                    <span className="node-type" style={{backgroundImage: 'url(' + require(`../../image/${active_meta.type}-1.png`) +')'}}></span>
                    <span className="node-value">{active_meta.name}</span>
                </div>
                <Card title="Genome Region">
                    <IgvChart symbol={variant.Gene}/>
                </Card>
                <Card bordered={false} title="Basic Infomation">
                    <table>
                        <tbody>
                            <tr>
                                <td className="td-label">Symbol</td>
                                <td>{variant.Symbol}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Gene</td>
                                <td>{variant.Gene}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Start Position</td>
                                <td>{variant.StartPos}</td>
                            </tr>
                            <tr>
                                <td className="td-label">End Position</td>
                                <td>{variant.EndPos}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Band Location</td>
                                <td>{variant.BandLoc}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Type Name</td>
                                <td>{variant.TypeName}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Source</td>
                                <td>{variant.SourceName}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Chromosome</td>
                                <td>{variant.Chromosome}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Loc Class</td>
                                <td>{variant.LocClass}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Loc Name</td>
                                <td>{variant.LocName}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Freq Level Class</td>
                                <td>{variant.FreqLevelClass}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Freq Level Name</td>
                                <td>{variant.FreqLevelName}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Reference</td>
                                <td>{variant.Ref}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Alt</td>
                                <td>{variant.Alt}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Transcript Var</td>
                                <td>{this.getTranscriptVarTpl(variant.TranscriptVar)}</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </div>
        );
    }
}

export default Variant;
