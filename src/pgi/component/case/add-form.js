import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Form, Input, Popover, Modal, Radio, Select, Button, Row, Col, Upload, message, Cascader } from 'antd';
import { UploadOutlined} from '@ant-design/icons';
import reqwest from 'reqwest';
import 'pgi/style/p-case-add.less';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const crypto = require('crypto');

@observer
class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            hashTitie: '',
            modal: false,
            disease: [],
            curDisease: [],
            showDemo: false,
            demoTitle: '',
            demoId: '',
            demoPupu: undefined,
            demoTumor: [],
            curPopu: undefined,

            SomaticFileList: [],
            somaticBedFileList: [],
            SomaticGenome: 'unknown',

            GermlineFileList: [],
            BedFileList: [],
            GermlineGenome: 'unknown',

            CNVFileList: [],
            GeneFusionFile: [],

            TMB: 'unknown',
            MSI: 'unknown',

            TumorCountFile: [],
            NormaCountFile: [],

            uploading: false,
            agree: false,
            test: false
        };
    }
    onCreate = () => {
        const { title, showDemo, demoId ,agree, curDisease, SomaticFileList, somaticBedFileList, SomaticGenome, GermlineFileList, BedFileList, GermlineGenome, curPopu, CNVFileList, GeneFusionFile, TMB, MSI, TumorCountFile, NormaCountFile} = this.state;
        let hashTitie = crypto.createHash('md5').update(title).digest('hex');
        if(showDemo === true){
            let demoUrl = '/case/status/' + demoId
            this.props.history.push(demoUrl);
            return;
        }
        this.setState({
            hashTitie: hashTitie
        })
        if(title == ''){
            message.error('Please input your case title');
            return;
        }else if(curDisease.length == 0){
            message.error('Please choose Tumor Type');
            return;
        }else if(curPopu == undefined){
            message.error('Please choose Reference Population');
            return;
        }else if(SomaticFileList.length == 0){
            message.error('Please upload Somatic File');
            return;
        }else if(SomaticFileList.length != 0 && SomaticGenome == 'unknown'){
            message.error('Please choose Reference Genome');
            return;
        }else if(GermlineFileList.length == 0 && (BedFileList.length != 0 || GermlineGenome != 'unknown' ) ){
            message.error('Please upload Germline File');
            return;
        }else if(GermlineFileList.length != 0 && GermlineGenome == 'unknown'){
            message.error('Please choose Reference Genome');
            return;
        }else if(TumorCountFile.length == 0 && NormaCountFile.length != 0){
            message.error('Please upload Tumor File');
            return;
        }else if(agree === false){
            message.info('You should agree to the Terms of Use')
            return;
        }
        const formData = new FormData();
        formData.set("title",title);
        formData.set("disease",curDisease[1]);
        formData.set("tissue",curDisease[0]);
        formData.set("SomaticGenome",SomaticGenome);
        formData.set("GermlineGenome",GermlineGenome);
        formData.set("curPopu",curPopu);
        formData.set("TMB",TMB);
        formData.set("MSI",MSI);
        SomaticFileList.forEach(file => {
            formData.append('Somaticfiles[]', file);
        });
        GermlineFileList.forEach(file => {
            formData.append('Germlinefiles[]', file);
        });
        somaticBedFileList.forEach(file => {
            formData.append('somaticBedfiles[]', file);
        });
        BedFileList.forEach(file => {
            formData.append('Bedfiles[]', file);
        });
        CNVFileList.forEach(file => {
            formData.append('CNVFileList[]', file);
        });
        GeneFusionFile.forEach(file => {
            formData.append('GeneFusionFile[]', file);
        });
        TumorCountFile.forEach(file => {
            formData.append('TumorCountFile[]', file);
        });
        NormaCountFile.forEach(file => {
            formData.append('NormaCountFile[]', file);
        });
        this.setState({
            uploading: true,
        });
        // this.props.history.push('/case/status/' + hashTitie)
        reqwest({
            url: 'https://premedkb.org:5001/create',
            method: 'post',
            headers: {
                "Content-Security-Policy": "upgrade-insecure-requests"
            },
            processData: false,
            data: formData,
            success: (res) => {
                if(res == '403'){
                    message.error('The title has been already used, please change the title and recreate it.');
                }else {
                    this.reset();
                    message.success('create successfully.');
                    this.props.history.push('/case/status/' + hashTitie);
                }
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('create failed.');
            },
        });
    }

    reset = () => {
        this.setState({
            SomaticFileList: [],
            GermlineFileList: [],
            somaticBedFileList: [],
            BedFileList: [],
            CNVFileList: [],
            GeneFusionFile: [],
            TumorCountFile: [],
            NormaCountFile: [],
            curDisease: [],
            SomaticGenome: 'unknown',
            GermlineGenome: 'unknown',
            title: '',
            curPopu: undefined,
            uploading: false,
            showDemo: false,
            agree: false,
            TMB: 'unknown',
            MSI: 'unknown',
        });
        window.scrollTo(0, 0);
    }
    getDisease = () => {
        reqwest({
            url: 'https://premedkb.org:5001/select_diseaseid',
            method: 'get',
            headers: {
                "Content-Security-Policy": "upgrade-insecure-requests"
            },
            success: (res) => {
                console.log(res)
                this.setState({
                    disease: res.data,
                    demoId: res.demo,
                    demoTitle: res.title,
                    demoPopu: res.Popu,
                    demoTumor: res.tumor
                });
            },
            error: () => {
                message.error('disease get failure');
            },
        });
    }
    componentWillMount () {
        this.getDisease()
    }
    onPopuChange = (value) => {
        this.setState({
            curPopu: value
        })
    }
    onDiseaseChange = (value) => {
        this.setState({
            curDisease: value
        })
    }
    onTitleChange= (e) => {
        this.setState({
            title: e.target.value
        })
    }
    onTmbChange= (e) => {
        this.setState({
            TMB: e.target.value
        })
    }
    radioChangeG = () => {
        if(this.state.TMB === 'yes'){
            this.setState({
                TMB: 'unknown'
            })
        }
    }
    radioChangeH = () => {
        if(this.state.TMB === 'no'){
            this.setState({
                TMB: 'unknown'
            })
        }
    }

    onMsiChange= (e) => {
        this.setState({
            MSI: e.target.value
        })
    }
    radioChangeE = () => {
        if(this.state.MSI === 'yes'){
            this.setState({
                MSI: 'unknown'
            })
        }
    }
    radioChangeF = () => {
        if(this.state.MSI === 'no'){
            this.setState({
                MSI: 'unknown'
            })
        }
    }

    onSomaticGenomeChange= (e) => {
        this.setState({
            SomaticGenome: e.target.value
        })
    }
    radioChangeA = () => {
        if(this.state.SomaticGenome === 'hg19'){
            this.setState({
                SomaticGenome: 'unknown'
            })
        }
    }
    radioChangeB = () => {
        if(this.state.SomaticGenome === 'hg38'){
            this.setState({
                SomaticGenome: 'unknown'
            })
        }
    }
    onGermlineGenomeChange= (e) => {
        this.setState({
            GermlineGenome: e.target.value
        })
    }
    radioChangeC = () => {
        if(this.state.GermlineGenome === 'hg19'){
            this.setState({
                GermlineGenome: 'unknown'
            })
        }
    }
    radioChangeD = () => {
        if(this.state.GermlineGenome === 'hg38'){
            this.setState({
                GermlineGenome: 'unknown'
            })
        }
    }
    somaticBeforeUpload = (file) => {
        this.setState(state => ({
            SomaticFileList: [...state.SomaticFileList, file],
        }));
        return false;
    }
    somaticOnRemove = (file) => {
        if(!this.state.showDemo){
            this.setState(state => {
                let index = state.SomaticFileList.indexOf(file);
                let newFileList = state.SomaticFileList.slice();
                newFileList.splice(index, 1);
                return {
                    SomaticFileList: newFileList,
                };
            });
        }
    }
    germlineBeforeUpload = (file) => {
        this.setState(state => ({
            GermlineFileList: [...state.GermlineFileList, file],
        }));
        return false;
    }
    germlineOnRemove = (file) => {
        if(!this.state.showDemo){
            this.setState(state => {
                let index = state.GermlineFileList.indexOf(file);
                let newFileList = state.GermlineFileList.slice();
                newFileList.splice(index, 1);
                return {
                    GermlineFileList: newFileList,
                };
            });
        }
    }
    somaticbedBeforeUpload = (file) => {
        this.setState(state => ({
            somaticBedFileList: [...state.somaticBedFileList, file],
        }));
        return false;
    }
    somaticbedOnRemove = (file) => {
        if(!this.state.showDemo){
            this.setState(state => {
                let index = state.somaticBedFileList.indexOf(file);
                let newFileList = state.somaticBedFileList.slice();
                newFileList.splice(index, 1);
                return {
                    somaticBedFileList: newFileList,
                };
            });
        }
    }
    //
    bedBeforeUpload = (file) => {
        this.setState(state => ({
            BedFileList: [...state.BedFileList, file],
        }));
        return false;
    }
    bedOnRemove = (file) => {
        if(!this.state.showDemo){
            this.setState(state => {
                let index = state.BedFileList.indexOf(file);
                let newFileList = state.BedFileList.slice();
                newFileList.splice(index, 1);
                return {
                    BedFileList: newFileList,
                };
            });
        }
    }
    // GeneFusionFile
    geneFusionBeforeUpload = (file) => {
        this.setState(state => ({
            GeneFusionFile: [...state.GeneFusionFile, file],
        }));
        return false;
    }
    geneFusionOnRemove = (file) => {
        if(!this.state.showDemo){
            this.setState(state => {
                let index = state.GeneFusionFile.indexOf(file);
                let newFileList = state.GeneFusionFile.slice();
                newFileList.splice(index, 1);
                return {
                    GeneFusionFile: newFileList,
                };
            });
        }
    }
    // CNVFileList
    cnvBeforeUpload = (file) => {
        this.setState(state => ({
            CNVFileList: [...state.CNVFileList, file],
        }));
        return false;
    }
    cnvOnRemove = (file) => {
        if(!this.state.showDemo){
            this.setState(state => {
                let index = state.CNVFileList.indexOf(file);
                let newFileList = state.CNVFileList.slice();
                newFileList.splice(index, 1);
                return {
                    CNVFileList: newFileList,
                };
            });
        }
    }
    // TumorCountFile
    tumorCountBeforeUpload = (file) => {
        this.setState(state => ({
            TumorCountFile: [...state.TumorCountFile, file],
        }));
        return false;
    }
    tumorCountOnRemove = (file) => {
        if(!this.state.showDemo){
            this.setState(state => {
                let index = state.TumorCountFile.indexOf(file);
                let newFileList = state.TumorCountFile.slice();
                newFileList.splice(index, 1);
                return {
                    TumorCountFile: newFileList,
                };
            });
        }
    }
    // NormaCountFile
    normalCountBeforeUpload = (file) => {
        this.setState(state => ({
            NormaCountFile: [...state.NormaCountFile, file],
        }));
        return false;
    }
    normalCountOnRemove = (file) => {
        if(!this.state.showDemo){
            this.setState(state => {
                let index = state.NormaCountFile.indexOf(file);
                let newFileList = state.NormaCountFile.slice();
                newFileList.splice(index, 1);
                return {
                    NormaCountFile: newFileList,
                };
            });
        }
    }
    agreeTou = () => {
        this.setState({
            agree: !this.state.agree
        })
    }
    showModal = () => {
        this.setState({
            modal: true
        })
    }
    handleOk = () => {
        this.setState({
            modal: false
        })
    }
    handleCancel = () => {
        this.setState({
            modal: false
        })
    }
    demo = (anchorName) => {
        this.setState({
            showDemo: true,
            SomaticFileList: [{uid:'1',key:1,name:'SomaticVCF.vcf'}],
            GermlineFileList: [{uid:'2',key:2,name:'GermlineVCF.vcf'}],
            somaticBedFileList: [{uid:'3',key:3,name:'SomaticBed.bed'}],
            BedFileList: [{uid:'4',key:4,name:'GermlineBed.bed'}],
            CNVFileList: [{uid:'5',key:5,name:'CNV.csv'}],
            GeneFusionFile: [{uid:'6',key:6,name:'GeneFusionFile.csv'}],
            TumorCountFile: [{uid:'8',key:7,name:'TumorFile.csv'}],
            NormaCountFile: [{uid:'9',key:8,name:'NormalFile.csv'}],
            curDisease: this.state.demoTumor,
            SomaticGenome: 'hg19',
            GermlineGenome: 'hg19',
            title: this.state.demoTitle,
            curPopu: this.state.demoPopu,
            uploading: false,
            TMB: 'yes',
            MSI: 'yes',
        })
        setTimeout(() => {
            if (anchorName) {
                let anchorElement = document.getElementById(anchorName);
                if(anchorElement) { anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'}); }
            }
        }, 200)
    }
    render() {
        const { title, showDemo, SomaticFileList, SomaticGenome, somaticBedFileList, GermlineFileList, GermlineGenome, curPopu, BedFileList, CNVFileList, GeneFusionFile, TumorCountFile, NormaCountFile, TMB, MSI} = this.state;
        const { form: {getFieldDecorator}} = this.props;
        const content1 = (
            <div className='popover'>
              <p><b>Title: required.</b> Title is used as a unique id and from which the report link is generated.
                 Note: please do not use duplicated titles to submit tasks.</p>
              <p><b>Tumor Type: required.</b> Selecting a definite tumour type will help the PreMedKB-POI to invoke more accurate therapeutic knowledge.
                Besides, if you would like to use a tumor-only RNA expression profile to obtain drug recommendations, 
                PreMedKB-POI will make inferences based on the profiles of the corresponding tissue and tumour type in the TCGA cohort.
              </p>
              <p><b>Reference Population: required.</b> PreMedKB-POI predicts gene diplotypes based on allele frequencies of germline mutations in a given reference population. 
                Gene diplotypes will be further used for the analysis of drug response. </p> 
            </div>
        )
        const content2 = (
            <div className='popover'>
                <p>If the user wishes PreMedKB-POI to do analysis based on germline variations, please provide the following information. </p>
                <p>Germline Variation and relative information should be filled in here.</p>
                <p><b>Germline VCF: required. </b>Somatic VCF is the standard VCF file containing somatic variation information.
                </p>
                <p><b>Bed File: optional.</b> The required fields for the Bed file include "chrom", "chromStart" and "chromEnd". 
                </p>
                <p><b>Reference Genome: required.</b> Please select. It is the reference genome version used in the variant calling process.
                </p>
            </div>
        )
        const content3 = (
            <div className='popover'>
                <p>If the user wishes PreMedKB-POI to do analysis based on somatic variations, please provide the following information. </p>
                <p>Somatic Variation and relative information should be filled in here.</p>
                <p><b>Somatic VCF: required.</b> Somatic VCF is the standard VCF file containing somatic variation information.
                </p>
                <p><b>Bed File: optional.</b> The required fields for the Bed file include "chrom", "chromStart" and "chromEnd". 
                </p>
                <p><b>Reference Genome: required.</b> Please select. It is the reference genome version used in the variant calling process.
                </p>
            </div>
        )
        const content4 = (
            <div className='popover'>
                <p>If the user wishes PreMedKB-POI to do analysis based on copy numer varations, please provide the following information. </p>
                <p>Copy number variation (CNV) is defined as a copy number change involving a DNA segment that is 1kb or larger.</p>
                <p><b>CNV File: required. </b>The CNV file could be a tab-separated file (*.tsv) or a comma-separated file (*.csv), 
                  which includes the column of "gene symbol" and "estimation" at least for PreMedKB-POI (the estimation includes "gain", "loss" and "neutral"). 
                  The CNV common process reference can be found at GDC CNV pipeline.
                </p>
            </div>
        )
        const content5 = (
            <div className='popover'>
                <p>If the user wishes PreMedKB-POI to do analysis based on gene fusions, please provide the following information. </p>
                <p>Gene fusion means a gene made by joining parts of two different genes.</p>
                <p><b>Gene Fusion File: required. </b>The gene fusion file is a tab-separated file (*.tsv) or a comma-separated file (*.csv). 
                  The two columns named "fusion gene A" and "fusion gene B" are required. (the gene symbol should be annotated instead of gene id).
                </p>
            </div>
        )
        const content6 = (
            <div className='popover'>
                <p>If the user wishes PreMedKB-POI to do analysis based on tumor mutation burden, please provide the following information. </p>
                <p>Tumor Mutational Burden is the total number of mutations (changes) found in the DNA of cancer cells.</p>
                <p><b>GTMB-H: required. </b>The detail could be seen on the Help Page.
                </p>
            </div>
        )
        const content7 = (
            <div className='popover'>
                <p>If the user wishes PreMedKB-POI to do analysis based on microsatellite instability, please provide the following information. </p>
                <p>Microsatellite Instability is the change that occurs in certain cells (such as cancer cells) in which the number of repeated DNA bases in a microsatellite (a short, 
                  repeated sequence of DNA) is different from what it was when the microsatellite was inherited.</p>
                <p><b>MSI-H: required. </b>The detail could be seen on the Help Page.
                </p>
            </div>
        )
        const content8 = (
            <div className='popover'>
                <p>If the user wishes PreMedKB-POI to do analysis based on expression profiles, please provide the following information.</p>
                <p>Expression Profile is the gene count file obtained from the mRNA Analysis Pipeline.</p>
                <p><b>Tumor File: required. </b></p>
                <p><b>Normal File: optional. </b></p>
                <p>Users can upload a gene count matrix, which is a tab-separated file (*.tsv) or a comma-separated file (*.csv). 
                  The first column should be gene IDs based on Ensembl annotation (ids those start with ENSG) or HGNC gene symbols. 
                  The second column should be the gene count of each gene. Note, only the first two columns are used in PreMedKB-POI. 
                </p>
                <p>If the normal file is provided, PreMedKB-POI will use fold change of tumor and normal files for further analysis. If the normal file is missing, 
                  PreMedKB-POI will automatically use the expression intervals in the TCGA cohort, 
                  using a given tumor type in "Basic information". See detailed information on the Help page.</p>
            </div>
        )
        return (
            <div className="container">
                <br></br>
                <div className="basic-info">
                    <div className="basic-info-title">
                        <div className="basic-info-title-flow">
                            Basic Information
                            <Popover overlayStyle={{width: '50%'}} content={content1} title="Basic Information" className="basic-info-title-icon">
                                <div className="basic-info-title-icon">
                                    <img width={16} src={require('../../../common/image/wenhao.png')} />
                                </div>
                            </Popover>
                            <div className="basic-info-title-tag">
                                <Button type="primary" onClick={this.demo.bind(this,'bottom')} color="blue">Demo Report</Button>
                            </div>
                        </div>
                        <div className="basic-info-title-line"></div>
                    </div>
                    <div className="basic-info-content">
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span className="star">*</span><span style={{textAlign:"right"}}>Title</span></Col>
                            <Col span={9}>
                                <Input style={{ width: '80%' }} disabled={showDemo} value={title} onChange={this.onTitleChange.bind(this)}/>
                            </Col>
                        </Row>
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span className="star">*</span>Tumor Type</Col>
                            <Col span={9}>
                                <Cascader style={{ width: '80%' }} disabled={showDemo} value={this.state.curDisease} options={this.state.disease} onChange={this.onDiseaseChange}  placeholder="Please Select" />
                            </Col>
                        </Row>
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}><span className="star">*</span>Reference Population</span></Col>
                            <Col span={9}>
                                <Select
                                    style={{ width: '80%' }}
                                    placeholder="Please Select"
                                    onChange={this.onPopuChange}
                                    value={curPopu}
                                    disabled={showDemo} 
                                  >
                                    <Option value="African/African American">African/African American</Option>
                                    <Option value="Latino/Admixed American">Latino/Admixed American</Option>
                                    <Option value="South Asian">South Asian</Option>
                                    <Option value="East Asian">East Asian</Option>
                                    <Option value="Non-Finnish European">Non-Finnish European</Option>
                                    <Option value="Ashkenazi Jewish">Ashkenazi Jewish</Option>
                                    <Option value="Finnish">Finnish</Option>
                                    <Option value="Other">Other</Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>
                </div>
                <br></br>
                <div className="basic-info">
                    <div className="basic-info-title">
                        <div className="basic-info-title-flow">
                            Somatic Variation
                            <Popover overlayStyle={{width: '50%'}} content={content2} title="Somatic Variation" className="basic-info-title-icon">
                                <div className="basic-info-title-icon">
                                    <img width={16} src={require('../../../common/image/wenhao.png')} />
                                </div>
                            </Popover>
                        </div>
                        <div className="basic-info-title-line"></div>
                    </div>
                    <div className="basic-info-content">
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}>Somatic VCF</span></Col>
                            <Col span={9}>
                                <Upload 
                                    beforeUpload={this.somaticBeforeUpload}
                                    onRemove={this.somaticOnRemove}
                                    fileList={SomaticFileList}
                                >
                                    <Button disabled={showDemo} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Col>
                        </Row>
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}>Bed File</span></Col>
                            <Col span={9}>
                                <Upload 
                                    beforeUpload={this.somaticbedBeforeUpload}
                                    onRemove={this.somaticbedOnRemove}
                                    fileList={somaticBedFileList}
                                >
                                    <Button disabled={showDemo} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Col>
                        </Row>
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}>Reference Genome</span></Col>
                            <Col span={9}>
                                <RadioGroup disabled={showDemo} onChange={this.onSomaticGenomeChange} value={SomaticGenome}>
                                    <Radio value="hg19" onClick={this.radioChangeA}>GRCh37 (hg19)</Radio>
                                    <Radio value="hg38" onClick={this.radioChangeB}>GRCh38 (hg38)</Radio>
                                </RadioGroup>
                            </Col>
                        </Row>
                    </div>
                </div>
                <br></br>
                <div className="basic-info">
                    <div className="basic-info-title">
                        <div className="basic-info-title-flow">
                            Germline Variation
                            <Popover overlayStyle={{width: '50%'}} content={content3} title="Germline Variation" className="basic-info-title-icon">
                                <div className="basic-info-title-icon">
                                    <img width={16} src={require('../../../common/image/wenhao.png')} />
                                </div>
                            </Popover>
                        </div>
                        
                        <div className="basic-info-title-line"></div>
                    </div>
                    <div className="basic-info-content">
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}>Germline VCF</span></Col>
                            <Col span={9}>
                                <Upload 
                                    beforeUpload={this.germlineBeforeUpload}
                                    onRemove={this.germlineOnRemove}
                                    fileList={GermlineFileList}
                                >
                                    <Button disabled={showDemo} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Col>
                        </Row>
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}>Bed File</span></Col>
                            <Col span={9}>
                                <Upload 
                                    beforeUpload={this.bedBeforeUpload}
                                    onRemove={this.bedOnRemove}
                                    fileList={BedFileList}
                                >
                                    <Button disabled={showDemo} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Col>
                        </Row>
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}>Reference Genome</span></Col>
                            <Col span={9}>
                                <RadioGroup disabled={showDemo} onChange={this.onGermlineGenomeChange} value={GermlineGenome}>
                                    <Radio value="hg19" onClick={this.radioChangeC}>GRCh37 (hg19)</Radio>
                                    <Radio value="hg38" onClick={this.radioChangeD}>GRCh38 (hg38)</Radio>
                                </RadioGroup>
                            </Col>
                        </Row>
                    </div>
                </div>
                <br></br>
                <div className="basic-info">
                    <div className="basic-info-title">
                        <div className="basic-info-title-flow">
                            Copy Number Variation
                            <Popover overlayStyle={{width: '50%'}} content={content4} title="Copy Number Variation" className="basic-info-title-icon">
                                <div className="basic-info-title-icon">
                                    <img width={16} src={require('../../../common/image/wenhao.png')} />
                                </div>
                            </Popover>
                        </div>
                        
                        <div className="basic-info-title-line"></div>
                    </div>
                    <div className="basic-info-content">
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}>CNV File</span></Col>
                            <Col span={9}>
                                <Upload 
                                    beforeUpload={this.cnvBeforeUpload}
                                    onRemove={this.cnvOnRemove}
                                    fileList={CNVFileList}
                                >
                                    <Button disabled={showDemo} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Col>
                        </Row>
                    </div>
                </div>
                <br></br>
                <div className="basic-info">
                    <div className="basic-info-title">
                        <div className="basic-info-title-flow">
                            Gene Fusion
                            <Popover overlayStyle={{width: '50%'}} content={content5} title="Gene Fusion" className="basic-info-title-icon">
                                <div className="basic-info-title-icon">
                                    <img width={16} src={require('../../../common/image/wenhao.png')} />
                                </div>
                            </Popover>
                        </div>
                        
                        <div className="basic-info-title-line"></div>
                    </div>
                    <div className="basic-info-content">
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}>Gene Fusion File</span></Col>
                            <Col span={9}>
                                <Upload 
                                    beforeUpload={this.geneFusionBeforeUpload}
                                    onRemove={this.geneFusionOnRemove}
                                    fileList={GeneFusionFile}
                                >
                                    <Button disabled={showDemo} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Col>
                        </Row>
                    </div>
                </div>
                <br></br>
                <div className="basic-info">
                    <div className="basic-info-title">
                        <div className="basic-info-title-flow">
                            Tumor Mutational Burden
                            <Popover overlayStyle={{width: '50%'}} content={content6} title="Tumor Mutational Burden" className="basic-info-title-icon">
                                <div className="basic-info-title-icon">
                                    <img width={16} src={require('../../../common/image/wenhao.png')} />
                                </div>
                            </Popover>
                        </div>
                        
                        <div className="basic-info-title-line"></div>
                    </div>
                    <div className="basic-info-content">
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line">TMB-H</Col>
                            <Col span={9}>
                                <RadioGroup disabled={showDemo} onChange={this.onTmbChange} value={TMB}>
                                    <Radio value="yes" onClick={this.radioChangeG}>Yes</Radio>
                                    <Radio value="no" onClick={this.radioChangeH}>No</Radio>
                                </RadioGroup>
                            </Col>
                        </Row>
                    </div>
                </div>
                <br></br>
                <div className="basic-info">
                    <div className="basic-info-title">
                        <div className="basic-info-title-flow">
                            Microsatellite Instability
                            <Popover overlayStyle={{width: '50%'}} content={content7} title="Microsatellite Instability" className="basic-info-title-icon">
                                <div className="basic-info-title-icon">
                                    <img width={16} src={require('../../../common/image/wenhao.png')} />
                                </div>
                            </Popover>
                        </div>
                        
                        <div className="basic-info-title-line"></div>
                    </div>
                    <div className="basic-info-content">
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line">MSI-H</Col>
                            <Col span={9}>
                                <RadioGroup disabled={showDemo} onChange={this.onMsiChange} value={MSI}>
                                    <Radio value="yes" onClick={this.radioChangeE}>Yes</Radio>
                                    <Radio value="no" onClick={this.radioChangeF}>No</Radio>
                                </RadioGroup>
                            </Col>
                        </Row>
                    </div>
                </div>
                <br></br>
                <div className="basic-info">
                    <div className="basic-info-title">
                        <div className="basic-info-title-flow">
                            Expression Profile
                            <Popover overlayStyle={{width: '50%'}} content={content8} title="Expression Profile" className="basic-info-title-icon">
                                <div className="basic-info-title-icon">
                                    <img width={16} src={require('../../../common/image/wenhao.png')} />
                                </div>
                            </Popover>
                        </div>
                        
                        <div className="basic-info-title-line"></div>
                    </div>
                    <div className="basic-info-content">
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}>Tumor File</span></Col>
                            <Col span={9}>
                                <Upload 
                                    beforeUpload={this.tumorCountBeforeUpload}
                                    onRemove={this.tumorCountOnRemove}
                                    fileList={TumorCountFile}
                                >
                                    <Button disabled={showDemo} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Col>
                        </Row>
                        <Row className="basic-info-content-row">
                            <Col span={6} className="basic-info-content-row-line"><span style={{textAlign:"right"}}>Normal File</span></Col>
                            <Col span={9}>
                                <Upload 
                                    beforeUpload={this.normalCountBeforeUpload}
                                    onRemove={this.normalCountOnRemove}
                                    fileList={NormaCountFile}
                                >
                                    <Button disabled={showDemo} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Col>
                        </Row>
                    </div>
                </div>
                <br></br>
                <div className="submit-wrap">
                    <div className="submit-wrap-btns">
                        <Button className="submit-wrap-btn" onClick={this.onCreate}>Submit</Button>
                        <span>　　　</span>
                        <Button className="submit-wrap-btn" type="primary" onClick={this.reset}>Reset</Button>
                    </div>
                    <div className="submit-wrap-tips">
                        <Radio checked={this.state.agree} onClick={this.agreeTou}></Radio>
                        <div>
                            I agree to the <a id="bottom" onClick={this.showModal}>Terms of Use</a>. Please note that commercial users would need to obtain a license.
                        </div>
                    </div>
                </div>
                <Modal title="Terms of Use" visible={this.state.modal} width={650} onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.handleOk}>Submit</Button>
                    ]}>
                    <p><b>The report</b> incorporates analyses of peer-reviewed studies and other publicly available information identified by <b>PreMedKB-POI</b> by State Key Laboratory of Genetic Engineering from the School of Life Sciences and Human Phenome Institute, Fudan University, Shanghai, China. These analyses and information may include associations between a molecular alteration (or lack of alteration) and one or more drugs with potential clinical benefit (or potential lack of clinical benefit), including drug candidates that are being studied in clinical research.</p>
                    <p><b>Note:</b> A finding of biomarker alteration does not necessarily indicate pharmacologic effectiveness (or lack thereof) of any drug or treatment regimen; a finding of no biomarker alteration does not necessarily indicate lack of pharmacologic effectiveness (or effectiveness) of any drug or treatment regimen.</p>
                    <p><b>No Guarantee of Clinical Benefit:</b> This Report makes no promises or guarantees that a particular drug will be effective in the treatment of disease in any patient. This report also makes no promises or guarantees that a drug with a potential lack of clinical benefit will provide no clinical benefit.</p>
                    <p><b>Treatment Decisions are Responsibility of Physician:</b> Drugs referenced in this report may not be suitable for a particular patient. The selection of any, all, or none of the drugs associated with potential clinical benefit (or potential lack of clinical benefit) resides entirely within the discretion of the treating physician. Indeed, the information in this report must be considered in conjunction with all other relevant information regarding a particular patient, before the patient's treating physician recommends a course of treatment. Decisions on patient care and treatment must be based on the independent medical judgment of the treating physician, taking into consideration all applicable information concerning the patient's condition, such as patient and family history, physical examinations, information from other diagnostic tests, and patient preferences, following the standard of care in a given community. A treating physician's decisions should not be based on a single test, such as this test or the information contained in this report.</p>
                    <p>When using results obtained from <b>PreMedKB-POI</b>, you agree to cite <b>PreMedKB-POI</b>.</p>
                </Modal>
            </div>
        );
    }
}

export default withRouter(Form.create()(AddForm));
