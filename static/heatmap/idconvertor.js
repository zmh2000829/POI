var axios = require("axios");

function getRequest(ensgID, apiPrefixUrl) {
    var apiUrl = apiPrefixUrl + '?ensg=' + ensgID
    return axios.get(apiUrl);
}

function getENSTID(response) {
    return _.get(response, 'data.data.HumanEnsemblTranscriptID[0]');
}

module.exports = {
	getENSTID: getENSTID,
  	getRequest: getRequest
}
