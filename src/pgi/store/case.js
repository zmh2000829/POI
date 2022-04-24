// import {action, runInAction, extendObservable} from 'mobx';
// import {PAGINATION} from 'common/constant';
// import * as fileApi from 'common/service/file';
// import * as caseApi from 'pgi/service/case';

// // 可观察属性
// const OBSERVABLE = {
//     files               : [],
//     diseases            : [],
//     loading_disease     : false,
//     pagination_disease  : {
//         ...PAGINATION,
//         size: 'small',
//         pageSize: 20,
//         showTotal: () => null
//     }
// };
// class Case {
//     constructor(props) {
//         this.reset();
//     }

//     @action.bound reset() {
//         extendObservable(this, {
//             ...OBSERVABLE
//         });
//     }

//     @action.bound update(data) {
//         Object.assign(this, data);
//     }

//     @action.bound getFiles() {
//         fileApi.getFiles({listing: true}).then((res) => {
//             runInAction(() => {
//                 this.files = _.get(res, 'children', []);
//             });
//         });
//     }

//     @action.bound getDiseases(params = {}) {
//         this.loading_disease = true;
//         caseApi.getDiseases(params).then((res) => {
//             this.loading_disease = false;
//             this.diseases = res.data || [];
//             this.pagination_disease = {
//                 ...this.pagination_disease,
//                 current: +res.current,
//                 total: +res.totalNo
//             }
//         });
//     }

//     @action.bound createCase(params, cb) {
//         caseApi.createCase(params).then((res) => {
//             cb();
//         });
//     }
// }

// export default new Case();
