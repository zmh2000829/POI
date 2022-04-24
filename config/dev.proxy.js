
// const base_prefix = 'http://10.157.72.40:8080';
// const file_prefix = 'http://10.157.72.40:2013';
// const chart_prefix = 'http://10.157.72.40:2000';
const base_prefix = 'http://139.224.117.98';
const ensg2t_prefix = 'http://139.224.117.98';
const level4_prefix = 'http://139.224.117.98';

const urls = [
    '/factdata.php',
    '/ontology.php',
    '/ontologyinfo.php',
    '/clinicaltrials.php',
    '/publication.php',
    '/gene.php',
    '/variation.php',
    '/drug.php',
    '/disease.php',
    '/api/meta/gene',
    '/api/search',
    '/filter.php',
    '/filter_variant.php',
    '/filter_disease.php',
    '/filter_drug.php',
    '/filter_gene.php',
    '/filter_in_simple.php',
    '/filter_in_simple_in_id.php',
    '/vcfupload.php',
    '/variation.php',
    '/gene.php',
    '/drug.php',
    '/select_diseaseid.php',
    '/disease.php',
    '/jsmol',
    '/ensg2t',
    '/irods-rest/rest',
    '/APP1',
    '/APP1/input.php',
    '/level4data/api/v1/projects',
    '/advancedSearch.php'
];

const proxy = {};

urls.forEach(url => {
    let prefix = base_prefix;
    if(url.indexOf('/level4') !== -1) {
        prefix = level4_prefix;
    } else if(url.indexOf('/ensg2t') !== -1) {
        prefix = ensg2t_prefix;
    }
    proxy[url] = {
        target: prefix + url,
        changeOrigin: true,
        pathRewrite: {
            ['^' + url]: ''
        }
    };
});

module.exports = proxy;
