import axios from 'axios';
import Cookie from 'js-cookie';
import {notification} from 'antd';
import {BASE_URL_PREFIX} from 'common/config';
import {CACHE_TOKEN} from 'common/constant';

function request(url, options) {
    const method = options.method.toLowerCase() || 'get';
    const opts = {
        url,
        method,
        baseURL: options.baseURL || BASE_URL_PREFIX,
        timeout: options.timeout || 5*60*1000,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: options.authorization || Cookie.get(CACHE_TOKEN)
        }
    };
    let data = options.data || {};
    method === 'get' ? (opts.params = data) : (opts.data = data);
    return axios(opts).then(({status, statusText, data}) => {
        if(status !== 200 && status !== 204) {
            notification.error({
                message: 'Error',
                description: statusText
            });
        }
        return data;
    }).catch((error) => {
        notification.error({
            message: 'Error',
            description: error.message
        });
        return {};
    });
}

module.exports = request;
