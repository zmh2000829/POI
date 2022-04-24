import {action, runInAction, extendObservable} from 'mobx';
import Cookie from 'js-cookie';
import * as api from 'common/service';
import {CACHE_TOKEN, CACHE_USER} from 'common/constant';

// 过期时间
const expires = 7;

// 可观察属性
const OBSERVABLE = {
    loading    : false,
    user       : Cookie.getJSON(CACHE_USER) || {}
};

class Glbl {
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

    @action.bound doLogin(params) {
        this.loading = true;
        Cookie.remove(CACHE_TOKEN);
        api.login(params).then((res) => {
            Cookie.set(CACHE_TOKEN, 'JWT ' + res.token, {expires});
            return api.getCurrentUser();
        }).then((res) => {
            const user = res.data;
            Cookie.set(CACHE_USER, user, {expires});
            runInAction(() => {
                this.loading = false;
                this.user = user;
            });
        });
    }

    @action.bound doLogout() {
        Cookie.remove(CACHE_TOKEN);
        Cookie.remove(CACHE_USER);
        this.reset();
    }
}

export default new Glbl();
