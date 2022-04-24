import {action, extendObservable} from 'mobx';

// 可观察属性
const OBSERVABLE = {
    fold_sidebar : false
};

class Layout {

    constructor() {
        this.reset();
    }

    @action reset() {
        extendObservable(this, {
            ...OBSERVABLE
        });
    }

    @action update(data) {
        Object.assign(this, data);
    }
}

export default new Layout();
