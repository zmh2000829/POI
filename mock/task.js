const express = require('express');
const Mock = require('mockjs');

const router = express.Router();

const tasks = Mock.mock({
    'list|8': [
        {
            'id|+1': 1,
            'no': /TASK-\d{8}/,
            'name': /TASK-\w{12}/,
            'reportNum|0-10': 1,
            'status|1-4': 1,
            'database': /database-\d{2}/,
            'version|1': [1.1, 2.1],
            'startTime': '@date("yyyy-MM-dd HH:mm:ss")',
            'progress': function() {
                const status = this.status;
                let percent;
                if(status !== 4) {
                    percent = Mock.Random.integer(10, 90)
                } else {
                    percent = 100;
                }
                return percent;
            }
        }
    ]
});

router.get('/task', function(req, res, next) {
    res.json({
        code: 0,
        data: {
            list: tasks.list
        }
    });
});

module.exports = router;
