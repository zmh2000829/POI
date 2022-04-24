import {FILE_URL_PREFIX} from 'common/config';
import {FILE_VIRTUAL_PATH} from 'common/constant';

const authorization = 'Basic cGd4Omxyb2NrMTg2MTg2MTg2';

export function getFiles(params) {
    // return request(`/irods-rest/rest/collection${FILE_VIRTUAL_PATH}`, {
    //     method: 'get',
    //     data: params,
    //     authorization,
    //     baseURL: FILE_URL_PREFIX
    // });
    return request(`http://127.0.0.1:5001/select_diseaseid`, {
        method: 'get'
    });
}

export function deleteFile(params) {
    return request(`/irods-rest/rest/dataObject${FILE_VIRTUAL_PATH}/${params.name}`, {
        method: 'delete',
        authorization,
        baseURL: FILE_URL_PREFIX
    });
}
