import dev from './dev';
import prod from './prod';

let cfg = {};
const node_env = process.env.NODE_ENV;
if(node_env === 'production') {
    cfg = prod;
} else {
    cfg = dev;
}

module.exports = cfg;
