const express = require('express');
const Mock = require('mockjs');

const router = express.Router();

router.get('/file', function(req, res, next) {
    res.json({
        id: 456,
        name: 'test',
        age: '18'
    });
});


module.exports = router;
