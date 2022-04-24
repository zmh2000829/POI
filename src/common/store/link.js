import {action, runInAction, extendObservable} from 'mobx';
import {PAGINATION} from 'common/constant';
import * as api from 'common/service';

// 可观察属性
const OBSERVABLE = {
    visible             : false,
    active_link         : {},
    details             : [],
    pagination_detail   : {...PAGINATION},
    loading_detail      : false,
    trials              : [],
    pagination_trial    : {...PAGINATION},
    loading_trial       : false,
    pubs                : [],
    pagination_pub      : {...PAGINATION},
    loading_pub         : false
};

class Link {
    constructor() {
        this.reset();
    }

    @action.bound reset() {
        extendObservable(this, {
            ...OBSERVABLE
        });
    }

    @action.bound update(data) {
        Object.assign(this, data);
    }

    @action.bound getData() {
        const query = {
            otid: this.active_link.otid,
            pageNum: 1
        };
        this.getDetails(query);
        this.getTrials(query);
        this.getPubs(query);
    }

    @action.bound getDetails(query) {
        this.loading_detail = true;
        api.getLinkDetails(query).then(
            ({code, data = {}}) => {
                runInAction(() => {
                    this.loading_detail = false;
                    this.details = data.list || [];
                    this.pagination_detail = {
                        ...this.pagination_detail,
                        total: data.total || 0,
                        current: data.current || 1
                    };
                });
            }
        );
    }

    @action.bound getTrials(query) {
        this.loading_trial = true;
        api.getLinkTrials(query).then(
            ({code, data = {}}) => {
                runInAction(() => {
                    this.loading_trial = false;
                    this.trials = data.list || [];
                    this.pagination_trial = {
                        ...this.pagination_trial,
                        total: data.total || 0,
                        current: data.current || 1
                    };
                });
            }
        );
    }

    @action getPubs(query) {
        this.loading_pub = true;
        api.getLinkPubs(query).then(
            ({code, data = {}}) => {
                runInAction(() => {
                    this.loading_pub = false;
                    this.pubs = data.list || [];
                    this.pagination_pub = {
                        ...this.pagination_pub,
                        total: data.total || 0,
                        current: data.current || 1
                    };
                });
            }
        );
    }
}

export default new Link();
