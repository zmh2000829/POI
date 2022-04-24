// import {action, runInAction, extendObservable} from 'mobx';
// import {PAGINATION} from 'common/constant';
// import * as api from 'pgi/service/task';

// // 可观察属性
// const OBSERVABLE = {
//     // 视图类型(1:card; 2:list)
//     view_type         : 1,
//     // 数据加载状态
//     loading           : false,
//     // 数据集合
//     records           : [],
//     // 分页参数
//     pagination        : {...PAGINATION}
// };

// class Task {
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

//     @action.bound getTasks(params) {
//         this.loading = true;
//         api.getTasks().then(({code, data}) => {
//             runInAction(() => {
//                 this.loading = false;
//                 this.records = data || [];
//             });
//         });
//     }
// }

// export default new Task();
