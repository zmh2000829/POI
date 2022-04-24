import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {Card, Rate} from 'antd';

@inject('meta')
@observer
class Disease extends Component {

    render() {
        const {meta: {active_meta, disease}} = this.props;
        return (
            <div className="m-drug">
                <div className="meta-hd">
                    <span className="node-type" style={{backgroundImage: 'url(' + require(`../../image/${active_meta.type}-1.png`) +')'}}></span>
                    <span className="node-value">{active_meta.name}</span>
                </div>
                <Card bordered={false} title="Basic Infomation">
                    <table>
                        <tbody>
                            <tr>
                                <td className="td-label">Name</td>
                                <td>{disease.Name}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Description</td>
                                <td>{disease.Description}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Anatomical Content</td>
                                <td>{disease.AnatomicalContent}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Anatomical Name</td>
                                <td>{disease.AnatomicalName}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Score</td>
                                <td>{<Rate disabled value={parseInt(disease.score)}/>}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Category</td>
                                <td>{disease.Category && disease.Category.length ? disease.Category.join(', ') : ''}</td>
                            </tr>
                            <tr>
                                <td className="td-label">External Links</td>
                                <td>{disease.ExternalLinks && disease.ExternalLinks.length ? disease.ExternalLinks.join(', ') : ''}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Synonym</td>
                                <td>{disease.Synonym && disease.Synonym.length ? disease.Synonym.join(', ') : ''}</td>
                            </tr>
                            <tr>
                                <td className="td-label">Sympton</td>
                                <td>{disease.Sympton && disease.Sympton.length ? disease.Sympton.join(', ') : ''}</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </div>
        );
    }
}

export default Disease;
