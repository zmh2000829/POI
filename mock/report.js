const express = require('express');
const Mock = require('mockjs');

const router = express.Router();

const reports = Mock.mock({
    'list|8': [
        {
            'id|+1': 1,
            'no': /REPOET-\d{8}/,
            'name': /REPORT-\w{12}/,
            'moduleNum|1-8': 1,
            'createTime': '@date("yyyy-MM-dd HH:mm:ss")'
        }
    ]
});

router.get('/report', function(req, res, next) {
    res.json({
        code: 0,
        data: {
            list: reports.list
        }
    });
});

module.exports = router;
