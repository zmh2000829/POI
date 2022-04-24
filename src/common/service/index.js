import {LEVEL4_URL_PREFIX} from 'common/config';

export function login(params) {
    return request('/api/v1/api-token-auth', {
        method: 'post',
        data: params
    });
}

export function getCurrentUser() {
    return request('/api/v1/accounts/current-user', {
        method: 'get'
    });
}

export function getProjects() {
    return request('/pgx-level4/level4data/api/v1/projects', {
        method: 'get',
        baseURL: LEVEL4_URL_PREFIX,
        data: {
            show_analysis_program: true
        }
    });
}
