import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {Card, Rate} from 'antd';
import JmolChart from './jmol-chart';
import ProductList from './product-list';

@inject('meta')
@observer
class Drug extends Component {

    getProductTpl = (data = []) => {
        const count = data.length;
        let height = 0;
        if(count === 0) {
            height = 2 * 40;
        } else if(count > 10) {
            height = 11 * 40;
        } else {
            height = (count + 1) * 40;
        }
        return (
            <div className="product-wrap" style={{height}}>
                <ProductList data={data}/>
            </div>
        );
    }

    render() {
        const {meta: {active_meta, drug}} = this.props;
        return (
            <div className="m-drug">
                <div className="meta-hd">
                    <span className="node-type" style={{backgroundImage: 'url(' + require(`../../image/${active_meta.type}-1.png`) +')'}}></span>
                    <span className="node-value">{active_meta.name}</span>
                </div>
                <Card title="Molecular Formula">
                    <JmolChart name={drug.Name}/>
                </Card>
                <Card bordered={false} title="Basic Infomation">
                    <table>
                        <tbody>
                            <tr>
                                <td className="td-label">CASNumber</td>
                                <td>{drug.CASNumber}</td>
                            </tr>
                            <tr>
                                <td className="td-label">NameC</td>
                                <td>{drug.NameC}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Description</td>
                                <td>{drug.Description}</td>
                            </tr>
                            <tr>
                                <td className="td-label">InChI</td>
                                <td>{drug.InChI}</td>
                            </tr>
                            <tr>
                                <td className="td-label">InChIKey</td>
                                <td>{drug.InChIKey}</td>
                            </tr>
                            <tr>
                                <td className="td-label">SMILES</td>
                                <td>{drug.SMILES}</td>
                            </tr>
                            <tr>
                                <td className="td-label">IUPAC</td>
                                <td>{drug.IUPAC}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Indications</td>
                                <td>{drug.Indications}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Pharmacodynamics</td>
                                <td>{drug.Pharmacodynamics}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Mechanism Action</td>
                                <td>{drug.MechanismAction}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Toxicity</td>
                                <td>{drug.Toxicity}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Metabolism</td>
                                <td>{drug.Metabolism}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Absorption</td>
                                <td>{drug.Absorption}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Halflife</td>
                                <td>{drug.Halflife}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Protein binding</td>
                                <td>{drug.Proteinbinding}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Elimination</td>
                                <td>{drug.Elimination}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Distribution</td>
                                <td>{drug.Distribution}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Clearance</td>
                                <td>{drug.Clearance}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Structure 2d</td>
                                <td>{drug.Structure2d}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Structure 3d</td>
                                <td>{drug.Structure3d}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Source</td>
                                <td>{drug.Source}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Phase Name</td>
                                <td>{drug.PhaseName}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Type Name</td>
                                <td>{drug.TypeName}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Score</td>
                                <td><Rate disabled value={parseInt(drug.score)}/></td>
                            </tr>
                            <tr>
                                <td className="td-label">Synonym</td>
                                <td>{drug.Synonym && drug.Synonym.length && drug.Synonym.join(', ')}</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
                <Card className="product-card" title="Product">
                    {this.getProductTpl(drug.Product)}
                </Card>
            </div>
        );
    }
}

export default Drug;
