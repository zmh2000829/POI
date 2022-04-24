import WebStorageCache from 'web-storage-cache';

const Jt = {};

Jt.cache = new WebStorageCache();

Jt.base = {
    isObject(val) {
        return val && (val.constructor === Object || Object.prototype.toString.call(val) === '[object Object]');
    },
    isArray(val) {
        return val && (val.constructor === Array || Object.prototype.toString.call(val) === '[object Array]');
    }
};

Jt.number = {
    toQfw(val) {
        return (val || 0).toString().replace(/(?=(?!(\b))(\d{3})+$)/g, ',');
    }
}

Jt.array = {
    isArray(val) {
        return Object.prototype.toString.call(val) === '[object Array]'
    }
}

Jt.dateFormat = function(date){
    function add0(m) { return m < 10 ? '0' + m : m }
    var time = new Date(parseInt(date));
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm);
}

Jt.file = {
    formatSize(size, pointLength, units) {
        let unit;
        units = units || [ 'B', 'K', 'M', 'G', 'TB' ];
        while ( (unit = units.shift()) && size > 1024 ) {
            size = size / 1024;
        }
        return (unit === 'B' ? size : size.toFixed( pointLength || 2 )) + unit;
    }
};

Jt.loader = {
    fileIsExist(tag, url) {
        let exist = false;
        const files = document.getElementsByTagName(tag);
        const type = tag === 'script' ? 'src' : 'href';
        for(let i = 0, len = files.length; i < len; i++) {
            if(files[i].getAttribute(type) === url) {
                exist = true;
                break;
            }
        }
        return exist;
    },

    removeExistFiles(tag, urls) {
        const files = document.getElementsByTagName(tag);
        const type = tag === 'script' ? 'src' : 'href';
        const paths = [];
        for(let i = 0, len = files.length; i < len; i++) {
            paths.push(files[i].getAttribute(type));
        }
        return _.difference(urls, paths);
    },

    loadSheets(sheets, parent = 'head') {
        sheets = Jt.loader.removeExistFiles('link', sheets);
        if(sheets.length === 0) {
            return;
        }
        parent = document.getElementsByTagName(parent)[0] || document.documentElement;
        for(let i = 0, len = sheets.length; i < len; i++) {
            let node = document.createElement('link');
            node.rel = 'stylesheet';
            node.type = 'text/css';
            node.href = sheets[i];
            parent.appendChild(node);
        }
    },

    loadScripts(scripts, callback, parent = 'head') {
        scripts = Jt.loader.removeExistFiles('script', scripts);
        if(scripts.length === 0) {
            callback && callback();
            return;
        }
        parent = document.getElementsByTagName(parent)[0] || document.documentElement;
        let loaded = 0;
        for(let i = 0, len = scripts.length; i < len; i++) {
            let node = document.createElement('script');
            node.onload = node.onreadystatechange = function() {
                const rs = this.readyState;
                if('undefined' === typeof rs || 'loaded' === rs || 'complete' === rs) {
                    loaded++;
                    this.onload = this.onreadystatechange = null;
                    node = null;
                    if(loaded === scripts.length) {
                        callback && callback();
                    }
                }
            }
            node.src = scripts[i];
            parent.appendChild(node);
        }
    }
}

module.exports = exports = Jt;
