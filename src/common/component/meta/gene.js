import React,{Component} from 'react';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {Card} from 'antd';
import IgvChart from './igv-chart';
import GeneExprCard from './gene-expr-card';
import TranscriptExprCard from './transcript-expr-card';
import MutationDistCard from './mutation-dist-card';
import Bodymap from './bodymap';

@inject('meta')
@observer
class Gene extends Component {
    constructor(props) {
        super(props);
        props.meta.getProjects();
    }

    getEnsembl(data = []) {
        let ensembl = null;
        let pos = -1;
        for (let i = 0, len = data.length; i < len; i++) {
            pos = data[i].indexOf('(Ensembl)');
            if (pos !== -1) {
                ensembl = data[i].substring(0, pos);
                break;
            }
        }
        return ensembl;
    }

    render() {
        const {meta: {active_meta, gene, projects_gene, projects_transcript, projects_mutation}} = this.props;
        const ensembl_id = this.getEnsembl(gene.OtherAccession);
        return (
            <div className="m-gene">
                <div className="meta-hd">
                    <span className="node-type" style={{backgroundImage: 'url(' + require(`../../image/${active_meta.type}-1.png`) +')'}}></span>
                    <span className="node-value">{active_meta.name}</span>
                </div>
                <Card bordered={false} title="Basic Infomation">
                    <table>
                        <tbody>
                            <tr>
                                <td className="td-label">Alias</td>
                                <td>{gene.Alias && gene.Alias.length ? gene.Alias.join(', ') : ''}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Function</td>
                                <td>{gene.FunctionE}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Type</td>
                                <td>{gene.TypeName}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Source</td>
                                <td>{gene.Source}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Family</td>
                                <td>{gene.Family}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Cancer Gene</td>
                                <td>{gene.CancerGene}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Organism</td>
                                <td>{gene.Organism}</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
                <Card bordered={false} title="Genomic Context">
                    <table>
                        <tbody>
                            <tr>
                                <td className="td-label">Position</td>
                                <td>{gene.StartPos + ' - ' + gene.EndPos}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Strand</td>
                                <td>{gene.Strand}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Other Accession</td>
                                <td>
                                    {gene.OtherAccession && gene.OtherAccession.length ? gene.OtherAccession.join(', ') : ''}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
                <Card title="Genome Region">
                    <IgvChart symbol={gene.Symbol}/>
                </Card>
                <GeneExprCard ensembl_id={ensembl_id} projects={toJS(projects_gene)}/>
                <TranscriptExprCard ensembl_id={ensembl_id} projects={toJS(projects_transcript)} subPjtName="GTExMean" title="Transcript Expression Profile In GTEx"/>
                <TranscriptExprCard ensembl_id={ensembl_id} projects={toJS(projects_transcript)} subPjtName="TCGAMean" title="Transcript Expression Profile In TCGA"/>
                <MutationDistCard ensembl_id={ensembl_id} projects={toJS(projects_mutation)}/>
                <Card title="Interactive Bodymap">
                    <Bodymap ensembl_id={ensembl_id}/>
                </Card>
            </div>
        );
    }
}

export default Gene;
