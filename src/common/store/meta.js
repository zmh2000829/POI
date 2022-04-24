import {action, runInAction, extendObservable} from 'mobx';
import * as api from 'common/service';

// 可观察属性
const OBSERVABLE = {
    visible                : false,
    active_meta            : {},
    variant                : {},
    disease                : {},
    drug                   : {},
    gene                   : {},
    projects_gene          : [],
    projects_transcript    : [],
    projects_mutation      : []
};

class Meta {
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

    @action.bound getMeta() {
        const query = {
            type: this.active_meta.type,
            id: this.active_meta.metaid
        };
        api.getMeta(query).then(
            ({code, data = {}}) => {
                if(code !== 0) {
                    return;
                }
                runInAction(() => {
                    this[query.type] = data;
                });
            }
        );
    }

    @action.bound getProjects() {
        api.getProjects().then(
            (res = {}) => {
                const data = res.data || [];
                const projects_gene = [], projects_transcript = [], projects_mutation = [];
                for(let i = 0; i < data.length; i++) {
                    if(data[i].data_type === 'GeneExpression') {
                        projects_gene.push(data[i]);
                    } else if(data[i].data_type === 'TranscriptExpression') {
                        projects_transcript.push(data[i]);
                    } else if(data[i].data_type === 'Mutation') {
                        projects_mutation.push(data[i]);
                    }
                }
                runInAction(() => {
                    this.projects_gene = projects_gene;
                    this.projects_transcript = projects_transcript;
                    this.projects_mutation = projects_mutation;
                });
            }
        );
    }
}

export default new Meta();
