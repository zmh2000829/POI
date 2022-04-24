// import {action, runInAction, extendObservable} from 'mobx';
// import snw from 'common/store/snw';
// import * as api from 'pgi/service/report';

// const Jt_B = Jt.base;

// // 可观察属性
// const OBSERVABLE = {
//     loading      : false,
//     // report summary
//     rs           : {},
//     // therapeutic implication
//     ti           : {},
//     // PD1 inhibitor detail
//     pd1          : {},
//     // PARP inhibitor detail
//     parp         : {},
//     wc           : {show_data_view: false, data: []}
// };

// class Report {
//     constructor() {
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

//     @action.bound getDetail(id) {
//         this.loading = true;
//         api.getDetail(id).then((res) => {
//             runInAction(() => {
//                 this.loading = false;
//                 this.rs = _.get(res, 'data.reportSummary') || {};
//                 const ti = {summary: [], detail: []};
//                 ti.summary = _.get(res, 'data.TherapeuticImplicationSummary') || [];
//                 ti.detail = _.get(res, 'data.TherapeuticImplicationDetail') || [];
//                 this.ti = ti;
//                 const pd1 = {summary: [], detail: []};
//                 pd1.summary = _.get(res, 'data.PD1InhibitorSummary') || [];
//                 pd1.detail = _.get(res, 'data.PD1InhibitorDetail') || [];
//                 if(pd1.summary.length) {
//                     pd1.summary.forEach((item, index) => {
//                         item.index = index;
//                     });
//                 }
//                 if(pd1.detail.length) {
//                     pd1.detail.forEach((item, index) => {
//                         item.index = index;
//                     });
//                 }
//                 this.pd1 = pd1;
//                 const parp = {summary: [], detail: []};
//                 parp.summary = _.get(res, 'data.PARPInhibitorSummary') || [];
//                 parp.detail = _.get(res, 'data.PARPInhibitorDetail') || [];
//                 if(parp.summary.length) {
//                     parp.summary.forEach((item, index) => {
//                         item.index = index;
//                     });
//                 }
//                 if(parp.detail.length) {
//                     parp.detail.forEach((item, index) => {
//                         item.index = index;
//                     });
//                 }
//                 this.parp = parp;
//                 this.wc.data = _.get(res, 'data.wordcloud.english') || [];
//                 snw.reload(_.get(res, 'data.nodes') || [], _.get(res, 'data.links') || []);
//             });
//         });
//     }
// }

// export default new Report();
