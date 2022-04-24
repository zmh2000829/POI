import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import 'pgi/style/p-faq.less';

class Faq extends Component {
	constructor(props) {
        super(props);
        this.state = {

        };
    }

    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            let anchorElement = document.getElementById(anchorName);
            if(anchorElement) { anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'}); }
        }
    }

    handleAnchorClick = (e) => {
        e.preventDefault();
    };

    render() {
    	return (
    		<div className="faq-container">
    			<div className="faq-left">
                    <div className="faq-left-title">Help</div>
                    <div className="faq-left-subtitle">
                        <a id="intr">General Information</a>
                    </div>
                    <div className="faq-left-content">
                        <a id="intr1">1. What is PreMedKB-POI?</a>
                        <p className="faq-left-content-text">
                        PreMedKB-POI (Personal Omics Interpreter based on Precision Medicine Knowledgebase) is an efficient and user-friendly tool that 
                        assists clinicians and researchers in resolving patients' multi-omics therapeutic biomarkers to obtain treatments supported by clinical evidence or potentially feasible.
                        </p>
                        <p className="faq-left-content-text">
                        An important aspect of precision oncology aims to provide the right therapy based on interpreting unique omics features of each patient, thereby maximizing drug efficacy and minimizing adverse drug reactions. Thus, it is crucial to make full use of the patient's omics profiles and to interpret them accurately. Unfortunately, discrepancies in prominent precision oncology knowledge bases, 
                        limitations of manual interpretation, and the incomprehensiveness of using only somatic variant data all hinder accurate therapy selection.
                        </p>
                        <a id="intr2">2. Why users shall choose PreMedKB-POI for drug recommendations?</a>
                        <p className="faq-left-content-text">
                        The PreMedKB-POI system has several unique features:
                        </p>
                        <p className="faq-left-content-text">
                        1. Dissecting a wider range of genomic and transcriptomic variants. PreMedKB-POI is not 
                        limited to resolving somatic mutations for drug recommendations but takes into account both germline variants and aberrantly expressed genes at the expression profile level.
                        </p>
                        <p className="faq-left-content-text">
                        2. Comprehensive and harmonized therapeutic knowledge. 
                        By integrating multiple published databases and employing ontology and semantic network techniques, the knowledgebase contains comprehensive therapeutic records. 
                        </p>
                        <p className="faq-left-content-text">
                        3. ­­A wider range of patients benefited. Building on the therapeutic regimens with clinical evidence integrated into PreMedKB, we combine biological context information, i.e., 
                        pathway networks and population mutation frequencies to provide drug repurposing regimens for the person who does not have any therapeutic biomarker.
                        </p>
                        <a id="intr3">3. What types of omics data can be used for drug recommendations in PreMedKB-POI?</a>
                        <p className="faq-left-content-text">
                        PreMedKB-POI enables the joint resolution of patient genomic and transcriptomic profiles, including somatic variations, germline variations, copy number alterations, level of tumor mutation burden, expression profiles, 
                        and so on. Note, the current version of PreMedKB-POI can analyze variations in VCF/TXT format. High-throughput data in FASTQ format is not available. 
                        </p>
                        <a id="intr4">4. How is multi-sourced knowledge integrated into PreMedKB-POI?</a>
                        <p className="faq-left-content-text">
                        As omics technologies and methodologies develop, precision medicine, especially precision oncology, unprecedently requires identifying and interpreting molecular alterations from multi-omic perspectives. The mainstream focuses on giving precision 
                        therapies based on genomic variations, which lack interpretation of transcriptional levels to provide more information on clinical suggestions. 
                        </p>
                        <p className="faq-left-content-text">
                        Therefore, PreMedKB-POI achieves interpreting transcriptomic expression profiles, enables the joint resolution 
                        of patient genomic and transcriptomic profiles, and thus gives comprehensive and accurate drug recommendations and drug response interpretations.
                        </p>
                        <a id="intr5">5. What is the relationship between PreMedKB-POI and previous PreMedKB?</a>
                        <p className="faq-left-content-text">
                        We have published PreMedKB (Yu Y., et al. NAR Database Issue 2019), an integrated precision medicine knowledgebase for interpreting relationships between diseases, genes, variants, and drugs two years ago, 
                        as known as PreMedKB v1. PreMedKB-POI is built based on PreMedKB architecture. However, differences between PreMedKB-POI and PreMedKB v1 database exists. 
                        </p>
                        <p className="faq-left-content-text">
                        First, PreMeKB-POI is a web server that can analyze patients' multi-omics data at a time, including somatic variations, germline variations, and expression profiling. 
                        While PreMedKB v1 is a web-based database that can view relationships between a/some given variation(s) to genes, drugs, and diseases.
                        </p>
                        <p className="faq-left-content-text">
                        Secondly, the results of PreMedKB-POI and PreMedKB v1 are different. PreMedKB-POI provides a ranked list of drugs based on levels of clinical evidence, while PreMedKB v1 provides a knowledge graph of relationships 
                        among elements based on confidence ratings calculated mostly based on the number of occurrences in databases, clinical trials, and publications.    
                        </p>
                        <p className="faq-left-content-text">
                        Thirdly, we updated source databases of PreMedKB, add several cancer-specific knowledgebases for satisfying precision oncology, 
                        and remove some knowledgebases that were less relevant to oncology to gain a higher computing efficiency. 
                        </p>
                        <a id="intr6">6. How does PreMedKB-POI provide drug recommendations?</a>
                        <p className="faq-left-content-text">
                        The PreMedKB-POI system consists of two main components as the name implies. One of them is the PreMedKB database which provides harmonized therapeutic knowledge, 
                        and the POI which is a tool for analyzing the entire process from receiving the user data to outputting the results. The steps are shown in the following diagram.
                        </p>
                        <p className="faq-left-content-text">
                        POI pre-processes and normalizes the format of multi-omics data to PreMedKB to retrieve the drugs associated with the specific disease and variants. The POI runs a built-in parsing tool to obtain drug repurposing 
                        data if the user cannot benefit from a prior knowledge with evidence level. Besides, drug response can be obtained if germline data is available.
                        </p>
                        <p className='faq-left-content-img'>
                            <img width ={600} src={require('../../../common/image/image.png')} />
                        </p>
                        <a id="intr7">7. How are evidence levels defined in PreMedKB-POI?</a>
                        <p className="faq-left-content-text">
                        <b>PreMedKB-POI Evidence Levels</b> are divided into five categories, with Levels A-E defined by reference to the structured guidelines for clinical interpretation of somatic variants, 
                        published by the Association for Molecular Pathology, the American Society of Clinical Oncology, and the College of American Pathologists (AMP/ASCO/CAP).
                        </p>
                        <p className='faq-left-content-img'>
                        <img width ={450} src={require('../../../common/image/image2.png')} />
                        </p>
                        <p className="faq-left-content-text">
                        These guidelines are compatible with the existing evidence levels of this knowledgebases. We have mapped the definitions of the levels of evidence within each knowledge base to the AMP/ASCO/CAP definitions, which have been manually reviewed. In addition, Level E consists of the evidence that is not clearly defined in the knowledgebase which is integrated by PreMedKB, 
                        and the undirected evidence obtained by computational extrapolation for PreMedKB-POI. Evidence levels mapping to knowledgebase-specific evidence codes are described below.
                        </p>
                        <p className='faq-left-content-img'>
                            <img width ={500} src={require('../../../common/image/image3.png')} />
                        </p>
                        <p className="faq-left-content-text">

                        </p>
                        <a id="intr8">8. How does PreMedKB-POI work in pharmacogenomics and deciphering drug responses?</a>
                        <p className="faq-left-content-text">
                        Genomic mutations do affect the drug response and the wide interindividual variability in drug response due to different genetic backgrounds. When we collaborate the genomic information and drug response, it calls pharmacogenomics. Pharmacogenomics (sometimes called pharmacogenetics) is a field of research that studies how a person's 
                        genome affects how he or she responds to medications. The response is mostly about the efficacy and adverse drug reactions. The genomic information, as a general rule, is about genotype.
                        </p>
                        <p className="faq-left-content-text">
                        PreMedKB gathers the pharmacogenomics knowledge between genotype and drug response from <b>PharmGKB</b> and <b>CIViC</b>. POI utilize sequencing result (usually in VCF format) to phase genotype, then give the recommendation.
                        </p>
                        <p className="faq-left-content-text">
                        There are two types of genotype, one called <b>single-site genotype</b>, the other called <b>diplotype</b>. Diplotype, popularly known as star (*) alleles, is defined by Groups of variants that are inherited together on both chromosomes and provide a basis for phenotype prediction and treatment decisions during pharmacogenomic implementation. To phase genotype, POI firstly detects the genotype of every single site, 
                        then utilizes a population frequency rank-based algorithm to detect the diplotype based on PharmVar and the Pharmacogenomics Knowledgebase (PharmGKB) star allele catalogs automatically.
                        </p>
                        <p className='faq-left-content-img'>
                        <img width ={450} src={require('../../../common/image/image4.png')} />
                        </p>
                        <a id="intr9">9. How does PreMedKB-POI contribute to transcriptomic therapeutics?</a>
                        <p className="faq-left-content-text">
                        PreMedKB-POI interprets transcriptomic profile with the compatibility of both Tumor Only and Tumor-Normal Paired data. 
                        All input HTSeq-Counts files will be preprocessed by the following steps: 1) Gene ID Transfer, 2) Gene Filter by Duplicated IDs, 3) Gene Filter by Count, 4) TPM calculation and 5) Gene Filter by TPM. 
                        </p><p className="faq-left-content-text">If your input profiles are generated from both tumor tissue and normal tissue of one case (which are <b>Tumor-Normal Paired)</b>, a WINTER Score will be calculated; 
                        else, an input file with only tumor tissue information of one case (which is <b>Tumor Only</b>), will be Z-score normalized across all genes, and then compared to the quantiles of relative expression levels in the reference population. 
                        </p><p className="faq-left-content-text">Finally, with a higher or lower score (WINTER Score or Z-score), the case will obtain a therapeutic report at expression levels according to therapy-related knowledge in PreMedKB v2. </p>
                        <p className='faq-left-content-img'>
                        <img width ={500} src={require('../../../common/image/image5.png')} />
                        </p>
                        <a id="intr10">10. How does indirect evidence (drug repurposing) be provided?</a>
                        <p className="faq-left-content-text">
                        The MSK-IMPACT study (Nat Med. 2017) showed that in the search for tumour-targeting drugs based on somatic cell variants, approximately 60% of patients had difficulty finding drugs with clinical evidence from a 
                        single database, e.g., OncoKB. Therefore, we fused transcriptomic information based on genomic variants in the hope of providing dosing advice to patients.
                        </p>
                        <p className="faq-left-content-text">
                        However, the expression-related therapeutic biomarker covers a limited number of target genes and cancer types, users do not always have expression profiles, and the transcriptome is not quantified with sufficient precision. We also look at the genomic level to first determine potentially abnormal variants (genes) and then combine this with Hallmark gene pathway information to determine whether these abnormal 
                        genes are enriched in the same pathway as the drug targets in PreMedKB. If they are in the same pathway, then we consider that the drug corresponding to that target is likely to be effective.
                        </p>
                        <p className='faq-left-content-img'>
                        <img width ={500} src={require('../../../common/image/image6.png')} />
                        </p>
                    </div>
                    <div className="faq-left-subtitle">
                        <a id="usab">Usability</a>
                    </div>
                    <div className="faq-left-content">
                        <a id="usab1">1. Are all data in PreMedKB-POI accessible to the community?</a>
                        <p className="faq-left-content-text">
                        Our data and algorithms used for analysis are deposited at <a>https://github.com/</a>, to the point of advancing the entire community. 
                        In addition, data uploaded by users are automatically deleted every seven days and will not be shared according to the privacy policy.</p>
                        <a id="usab2">2. How to submit your own task in PreMedKB-POI?</a>
                        <p className="faq-left-content-text">
                        You can submit your own task with personalized settings by either click "<b>Get Started</b>" on the Home page or directly going to the <b>Query</b> page. 
                        Then fill in all parameters, and the requirements for each are described in detail behind the followed <b>question mark</b>.</p>
                        <a id="usab3">3. Why is it necessary to specify a disease type and a reference population?</a>
                        <p className="faq-left-content-text">
                        A personalized therapy may be disturbed by the ambiguity of the diagnosis as well as great differences in the genetic background. 
                        When the disease type and the belonged population of the case are specified, a therapeutic report <b>with precision and proper will be provided</b>.</p>
                        
                        <a id="usab4">4. Is TMB-H and MSI required to specify?</a>
                        <p className="faq-left-content-text">
                        In the current version, we need users to determine the status of the TMB and MSI themselves in advance.
                        </p>
                        <a id="usab5">5. How to check the task status?</a>
                        <p className="faq-left-content-text">
                        After your task is submitted, the interface will turn to show you the status of your tasks running in real-time, including "<b>waiting</b>", "<b>running</b>", "<b>success</b>", "<b>failed</b>", etc. 
                        Your therapeutic report will be displayed only when the task status has changed to "<b>success</b>".</p>
                        <a id="usab6">6. Where can I find the final therapeutic report?</a>
                        <p className="faq-left-content-text">
                        The final therapeutic report can be viewed on the Report page. What's more, the report can be downloaded directly in PDF format for local viewing.</p>
                        <a id="usab7">7. What information does the Example page and Statistics page deliver?</a>
                        <p className="faq-left-content-text">
                        The <b>Example</b> page <b>gives exemplary reports</b> generated by PreMedKB-POI from the input personal omics data, 
                        and it can help you quickly associate your own study with our work. 
                        </p>
                        <p className="faq-left-content-text">
                        The Statistics page <b>displays general information of multi-sourced data</b> integrated with PreMedKB2.0 by dynamically visualizing the type,
                         the amount, and the source of the data, thus depicting a comprehensive scene in molecular alterations and clinical decisions. 
                        </p>
                        <a id="usab8">8. Are my analyses and results privately in PreMedKB-POI?</a>
                        <p className="faq-left-content-text">
                        Yes, individual results could only be queried by the random ID generated when the task was submitted. If you have not shared the ID with others, 
                        only you can be accessible to view the results.
                        </p>
                        <a id="usab9">9. What happens if the provided data mismatches with the Meta database?</a>
                        <p className="faq-left-content-text">
                        There will be a <b>check</b> before you submit your own task, and the task will fail to be submitted if the data you provide does not match the format in the database. The report will not be provided for you until the format of the data you submit matches the system requirements.
                        </p>
                        <a id="usab10">10. How to achieve multi-sample analyses in PreMedKB-POI?</a>
                        <p className="faq-left-content-text">
                        We will provide the <b>command-line tool</b> implementation in the next phase. In the short term, if you need analyses for bulk samples, please feel free to contact us.
                        </p>
                    </div>
                    <div className="faq-left-subtitle">
                        <a id="io">Input and output</a>
                    </div>
                    <div className="faq-left-content">
                        <a id="io1">1. What is the input of PreMedKB-POI?</a>
                        <p id="io11" className="faq-left-content-sub"><b>Basic Information</b></p>
                        <p className="faq-left-content-text">
                            <b>Title: required. </b>Title is used as a unique id and from which the report link is generated. Note: please do not use duplicated titles to submit tasks.
                        </p>
                        <p className="faq-left-content-text">
                            <b>Tumor Type: required. </b>Selecting a definite tumour type will help the PreMedKB-POI to invoke more accurate therapeutic knowledge. Besides, if you would like to use a tumor-only RNA expression profile to obtain drug recommendations, PreMedKB-POI will make inferences based on the profiles of the corresponding tissue and tumour type in the TCGA cohort.
                        </p>
                        <p className="faq-left-content-text">
                            <b>Reference Population: required. </b>PreMedKB-POI predicts gene diplotypes based on allele frequencies of germline mutations in a given reference population. Gene diplotypes will be further used for the analysis of drug response. 
                        </p>
                        <p id="io12" className="faq-left-content-sub"><b>Somatic Variation</b></p>
                        <p className="faq-left-content-text">If the user wishes PreMedKB-POI to do analysis based on somatic variations, please provide the following information.  </p>
                        <p className="faq-left-content-text">Somatic Variation and relative information should be filled in here. </p>
                        <p className="faq-left-content-text">
                            <b>Germline VCF: required.</b>Germline VCF is the standard VCF file containing germline mutation information
                        </p>
                        <p className="faq-left-content-text">
                            <b>Bed File: optional.</b>The required fields for the Bed file include "chrom", "chromStart" and "chromEnd".
                        </p>
                        <p className="faq-left-content-text">
                            <b>Reference Genome: required.</b>Please select. It is the reference genome version used in the variant calling process.
                        </p>
                        <p id="io13" className="faq-left-content-sub"><b>Germine Variation</b></p>
                        <p className="faq-left-content-text">If the user wishes PreMedKB-POI to do analysis based on germline variations, please provide the following information.  </p>
                        <p className="faq-left-content-text">Germline Variation and relative information should be filled in here. </p>
                        <p className="faq-left-content-text">
                            <b>Germline VCF: required.</b>Germline VCF is the standard VCF file containing germline mutation information
                        </p>
                        <p className="faq-left-content-text">
                            <b>Bed File: optional.</b>The required fields for the Bed file include "chrom", "chromStart" and "chromEnd".
                        </p>
                        <p className="faq-left-content-text">
                            <b>Reference Genome: required.</b>Please select. It is the reference genome version used in the variant calling process.
                        </p>
                        <p id="io14" className="faq-left-content-sub"><b>Copy Number Variation</b></p>
                        <p className="faq-left-content-text">If the user wishes PreMedKB-POI to do analysis based on copy numer varations, please provide the following information. </p>
                        <p className="faq-left-content-text">Copy number variation (CNV) is defined as a copy number change involving a DNA segment that is 1kb or larger.</p>
                        <p className="faq-left-content-text">
                            <b>CNV File: required. </b>The CNV file could be a tab-separated file (*.tsv) or a comma-separated file (*.csv), which includes the column of "gene symbol" and "estimation" at least for PreMedKB-POI (the estimation includes "gain", 
                            "loss" and "neutral"). The CNV common process reference can be found at GDC CNV pipeline.
                        </p>
                        <p id="io15" className="faq-left-content-sub"><b>Gene Fusion</b></p>
                        <p className="faq-left-content-text">If the user wishes PreMedKB-POI to do analysis based on gene fusions, please provide the following information. </p>
                        <p className="faq-left-content-text">Gene fusion means a gene made by joining parts of two different genes.</p>
                        <p className="faq-left-content-text">
                            <b>Gene Fusion File: required.</b>The gene fusion file is a tab-separated file (*.tsv) or a comma-separated file (*.csv). 
                            The two columns named "fusion gene A" and "fusion gene B" are required. (the gene symbol should be annotated instead of gene id).
                        </p>
                        <p id="io16" className="faq-left-content-sub"><b>Tumor Mutational Burden</b></p>
                        <p className="faq-left-content-text">If the user wishes PreMedKB-POI to do analysis based on tumor mutation burden, please provide the following information. </p>
                        <p className="faq-left-content-text">Tumor Mutational Burden is the total number of mutations (changes) found in the DNA of cancer cells.</p>
                        <p className="faq-left-content-text">
                            <b>TMB-H: required.</b>The detail could be seen on the Help Page.
                        </p>
                        <p id="io17" className="faq-left-content-sub"><b>Microsatellite Instability</b></p>
                        <p className="faq-left-content-text">If the user wishes PreMedKB-POI to do analysis based on microsatellite instability, please provide the following information. </p>
                        <p className="faq-left-content-text">Microsatellite Instability is the change that occurs in certain cells (such as cancer cells) in which the number of repeated DNA bases in a microsatellite (a short,
                         repeated sequence of DNA) is different from what it was when the microsatellite was inherited.</p>
                        <p className="faq-left-content-text">
                            <b>MSI-H: required.</b> The detail could be seen on the Help Page.
                        </p>
                        <p id="io18" className="faq-left-content-sub"><b>Expression Profile</b></p>
                        <p className="faq-left-content-text">If the user wishes PreMedKB-POI to do analysis based on expression profiles, please provide the following information.</p>
                        <p className="faq-left-content-text">Expression Profile is the gene count file obtained from the mRNA Analysis Pipeline.</p>
                        <p className="faq-left-content-text"><b>Tumor File: required.  Normal File: optional.</b></p>
                        <p className="faq-left-content-text">
                        Users can upload a gene count matrix, which is a tab-separated file (*.tsv) or a comma-separated file (*.csv). The first column should be gene IDs based on Ensembl annotation (ids those start with ENSG) or HGNC gene symbols. 
                        The second column should be the gene count of each gene. Note, only the first two columns are used in PreMedKB-POI. 
                        </p>
                        <p className="faq-left-content-text">
                        If the normal file is provided, PreMedKB-POI will use fold change of tumor and normal files for further analysis. If the normal file is missing, PreMedKB-POI will automatically use 
                        the expression intervals in the TCGA cohort, using a given tumor type in "Basic information". See detailed information on the Help page.
                        </p>
                        <a id="io2">2. What are data formatting requirements?</a>
                        <p className="faq-left-content-text">PreMedKB-POI can analyze data in VCF or TXT format. Users can download example input files on the "example" page to confirm data formatting requirements. </p>
                        <a id="io3">3. What is the output of PreMedKB-POI?</a>
                        <p className="faq-left-content-text">
                        When PreMedKB-POI is run, its results are provided via interactive reports. These web reports can be interactively browsed by the user. An overview of the report is shown below.
                        </p>
                        <p className='faq-left-content-img'>
                        <img width ={450} src={require('../../../common/image/image7.png')} />
                        </p>
                        <p id="io31" className="faq-left-content-sub"><b>Submission Infomation</b></p>
                        <p className="faq-left-content-text">The general information that users submit.</p>
                        <p id="io32" className="faq-left-content-sub"><b>Summary</b></p>
                        <p className="faq-left-content-text">
                        The summary section is oriented towards providing <b>the most straightforward recommended therapies</b> outcome. The drugs obtained based on the interpretation 
                        of personal omics data are ranked according to the level of evidence defined by the PreMedKB-POI. 
                         Drugs that were identified as having the potential to make patients resistant or have adverse reactions, 
                        as well as drugs with conflicting clinical significance between different knowledge bases, were specifically flagged.
                        </p>
                        <p id="io33" className="faq-left-content-sub"><b>Detail</b></p>
                        <p className="faq-left-content-text">
                        The detail section consists of two main modules: <b>Therapeutic</b> and <b>Biomarker</b>. Of these, <b>Therapeutic</b> contains three modules: <b>Direct Evidence</b>, <b>Indirect Evidence</b>, and <b>Drug Response</b>. 
                        </p>
                        <p className="faq-left-content-text">
                            <b>1. Therapeutic - Direct Evidence</b> contains targeted drugs according to distinct levels of clinical relevance, 
                            based on somatic variants，germline variants, and gene expression profiles. The integrative therapeutic knowledge was used.
                        </p>
                        <p className='faq-left-content-img'>
                        <img width ={700} src={require('../../../common/image/image8.png')} />
                        </p>
                        <p className="faq-left-content-text">
                            <b>Therapeutic - Indirect Evidence</b> contains inferential drug recommendations according to indirect evidence. Building on the therapeutic regimens with clinical evidence integrated into PreMedKB, we combine biological context information, i.e., 
                            pathway networks and population mutation frequencies to provide drug repurposing regimens for the person who does not have any therapeutic biomarker.
                        </p>
                        <p className='faq-left-content-img'>
                        <img width ={700} src={require('../../../common/image/image9.png')} />
                        </p>
                        <p className="faq-left-content-text">
                            <b>3. Therapeutic - Drug Response</b> contains information about a patient’s 
                            risk of medication side effects and drug efficacy with cancer medications based on genetic variations uploaded by users in the "germline variation" session. 
                        </p>
                        <p className='faq-left-content-img'>
                        <img width ={700} src={require('../../../common/image/image10.png')} />
                        </p>
                        <p className="faq-left-content-text">
                            <b>4. Biomarker Page</b> contains the putative biomarkers of drug recommendations.
                        </p>
                        <p className='faq-left-content-img'>
                        <img width ={700} src={require('../../../common/image/image11.png')} />
                        </p>
                        <a id="io4">4. Can users download reports of PreMedKB-POI?</a>
                        <p className="faq-left-content-text">Yes. Users can download reports by clicking "Download Report" on the report page. </p>
                    </div>
                    <div className="faq-left-subtitle">
                        <a id="avai">Availability</a>
                    </div>
                    <div className="faq-left-content">
                        <a id="avai1">1. What are the terms of use for PreMedKB-POI?</a>
                        <p className="faq-left-content-text">
                        <span className="b">The report</span> incorporates analyses of peer-reviewed studies and other publicly available information identified by <span className="b">PreMedKB-POI</span> by State Key Laboratory of Genetic Engineering from the School of Life Sciences and Human Phenome Institute, 
                        Fudan University, Shanghai, China. These analyses and information may include associations between a molecular alteration (or lack of alteration) and one or more drugs with potential clinical benefit (or potential lack of clinical benefit), including drug candidates that are being studied in clinical research.
                        </p><p className="faq-left-content-text"><span className="b">Note:</span> A finding of biomarker alteration does not necessarily indicate pharmacologic effectiveness (or lack thereof) of any drug or treatment regimen; 
                        a finding of no biomarker alteration does not necessarily indicate lack of pharmacologic effectiveness (or effectiveness) of any drug or treatment regimen.
                        </p><p className="faq-left-content-text"><span className="b">No Guarantee of Clinical Benefit:</span> This Report makes no promises or guarantees that a particular drug will be effective in the treatment of disease in any patient. 
                        This report also makes no promises or guarantees that a drug with a potential lack of clinical benefit will provide no clinical benefit.
                        </p><p className="faq-left-content-text"><span className="b">Treatment Decisions are Responsibility of Physician:</span> Drugs referenced in this report may not be suitable for a particular patient. The selection of any, all, or none of the drugs associated with potential clinical benefit (or potential lack of clinical benefit) resides entirely within the discretion of the treating physician. Indeed, the information in this report must be considered in conjunction with all other relevant information regarding a particular patient, before the patient's treating physician recommends a course of treatment. 
                        Decisions on patient care and treatment must be based on the independent medical judgment of the treating physician, taking into consideration all applicable information concerning the patient's condition, such as patient and family history, physical examinations, information from other diagnostic tests, and patient preferences, 
                        following the standard of care in a given community. A treating physician's decisions should not be based on a single test, such as this test or the information contained in this report.
                        </p><p className="faq-left-content-text">When using results obtained from <span className="b">PreMedKB-POI</span>, you agree to cite <span className="b">PreMedKB-POI</span>.</p>
                        <a id="avai2">2. How to cite PreMedKB-POI?</a>
                        <p className="faq-left-content-text-last">
                        Yaqing Liu, et al. PreMedKB-POI. <Link to="/homepage">https://premedkb.org/dist/#/homepage.</Link>
                        </p>
                    </div>
                        <br />
                        <br />
                        <br />
                </div>
                <div className="faq-right">
                    <div className="faq-right-div">
                        <div className="faq-right-content">
                            <div className="faq-right-content-title">
                            　  <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr')}>Introduction</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr1')}>1. What is PreMedKB-POI?</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr2')}>2. Why users shall choose PreMedKB-POI for drug recommendations? </a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr3')}>3. What types of omics data can be used for drug recommendations in </a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr4')}>4. Why does PreMedKB-POI use not only genomic information but also </a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr5')}>5. What is the relationship between PreMedKB-POI and previous PreMedKB? </a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr6')}>6. How does PreMedKB-POI provide drug recommendations?</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr7')}>7. How are evidence levels defined in PreMedKB-POI?</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr8')}>8. How does PreMedKB-POI work in pharmacogenomics and deciphering drug </a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr9')}>9. How does PreMedKB-POI contribute to transcriptomic therapeutics?</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'intr10')}>10. How does indirect evidence (drug repurposing) be provided?</a>
                                </div>
                            </div>
                            <div className="faq-right-content-title">
                            　  <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'usab')}>Usability</a>
                                </div>
                            </div>
                            <div>
                                <div className="faq-right-content-subtitle">
                                    <div className="faq-right-content-inner">
                                        <a onClick={this.scrollToAnchor.bind(this,'usab1')}>1. Are all data in PreMedKB-POI accessible to the community?</a>
                                    </div>
                                </div>
                                <div className="faq-right-content-subtitle">
                                    <div className="faq-right-content-inner">
                                        <a onClick={this.scrollToAnchor.bind(this,'usab2')}>2. How to submit your own task in PreMedKB-POI?</a>
                                    </div>
                                </div>
                                <div className="faq-right-content-subtitle">
                                    <div className="faq-right-content-inner">
                                        <a onClick={this.scrollToAnchor.bind(this,'usab3')}>3. Why is it necessary to specify a disease type and a reference</a>
                                    </div>
                                </div>
                                <div className="faq-right-content-subtitle">
                                    <div className="faq-right-content-inner">
                                        <a onClick={this.scrollToAnchor.bind(this,'usab4')}>4. Is TMB-H and MSI required to specify?</a>
                                    </div>
                                </div>
                                <div className="faq-right-content-subtitle">
                                    <div className="faq-right-content-inner">
                                        <a onClick={this.scrollToAnchor.bind(this,'usab5')}>5. How to check the task status?</a>
                                    </div>
                                </div>
                                <div className="faq-right-content-subtitle">
                                    <div className="faq-right-content-inner">
                                        <a onClick={this.scrollToAnchor.bind(this,'usab6')}>6. Where can I find the final therapeutic report?</a>
                                    </div>
                                </div>
                                <div className="faq-right-content-subtitle">
                                    <div className="faq-right-content-inner">
                                        <a onClick={this.scrollToAnchor.bind(this,'usab7')}>7. What information does the Example page and Statistics page</a>
                                    </div>
                                </div>
                                <div className="faq-right-content-subtitle">
                                    <div className="faq-right-content-inner">
                                        <a onClick={this.scrollToAnchor.bind(this,'usab8')}>8. Are my analyses and results privately in PreMedKB-POI?</a>
                                    </div>
                                </div>
                                <div className="faq-right-content-subtitle">
                                    <div className="faq-right-content-inner">
                                        <a onClick={this.scrollToAnchor.bind(this,'usab9')}>9. What happens if the provided data mismatches with the Meta</a>
                                    </div>
                                </div>
                                <div className="faq-right-content-subtitle">
                                    <div className="faq-right-content-inner">
                                        <a onClick={this.scrollToAnchor.bind(this,'usab10')}>10. How to achieve multi-sample analyses in PreMedKB-POI?</a>
                                    </div>
                                </div>
                            </div>
                            <div className="faq-right-content-title">
                            　  <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'io')}>Input and output</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'io1')}>1. What is the input of PreMedKB-POI?</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io11')}>Basic Information</a>
                                </div>
                            </div><div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io12')}>Somatic Variation</a>
                                </div>
                            </div><div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io13')}>Germine Variation</a>
                                </div>
                            </div><div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io14')}>Copy Number Variation</a>
                                </div>
                            </div><div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io15')}>Gene Fusion</a>
                                </div>
                            </div><div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io16')}>Tumor Mutational Burden</a>
                                </div>
                            </div><div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io17')}>Microsatellite Instability</a>
                                </div>
                            </div><div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io18')}>Expression Profile</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'io2')}>2. What are data formatting requirements?</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'io3')}>3. What is the output of PreMedKB-POI?</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io31')}>Submission Information</a>
                                </div>
                            </div><div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io32')}>Summary</a>
                                </div>
                            </div><div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner-in">
                                    <a onClick={this.scrollToAnchor.bind(this,'io33')}>Detail</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'io4')}>4. Can users download reports of PreMedKB-POI?</a>
                                </div>
                            </div>
                            <div className="faq-right-content-title">
                            　   <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'avai')}>Availability</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'avai1')}>1. What are the terms of use for PreMedKB-POI?</a>
                                </div>
                            </div>
                            <div className="faq-right-content-subtitle">
                                <div className="faq-right-content-inner">
                                    <a onClick={this.scrollToAnchor.bind(this,'avai2')}>2. How to cite PreMedKB-POI?</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    	)
    }
}

export default Faq;