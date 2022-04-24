export function getReports(params) {
    return request('/report', {
        method: 'get'
    });
}

export function getDetail(id) {
    return request(`/APP1/output.php/taskid/${id}`, {
        method: 'get',
    });
}
