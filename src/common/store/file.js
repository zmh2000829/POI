import {action, runInAction, extendObservable} from 'mobx';
import * as api from 'common/service/file';

// 不可观察属性
const UNOBSERVABLE = {
    uploader       : null
}

// 可观察属性
const OBSERVABLE = {
    loading      : false,
    files_end    : [],
    files_ing    : [],
    active_sys   : 'file_sys',
    active_pjt   : '',
    projects     : [
        {
            id: "5a66beed8a2674ee68813659",
            projectName: "YangYenan",
            description: "RNA-seq",
            createTime: 1516682988718,
            createrName: "侯湾湾",
            ownername: "侯湾湾",
            state: "In-preparation"
        },
        {
            id: "5a5c0f1a8a26864ba3261831",
            projectName: "WES_from_TJ_medical_college",
            description: "在此填写项目描述",
            createTime: 1515982618357,
            createrName: "李项南",
            ownername: "李项南",
            state: "In-preparation"
        },
        {
            id: "5a4b1f088a26864ba326176b",
            projectName: "Genomic_DNA",
            description: "在此填写项目描述",
            createTime: 1514872583988,
            createrName: "李项南",
            ownername: "李项南",
            state: "In-preparation"
        }
    ]
};

class File {
    constructor() {
        this.reset();
    }

    @action.bound reset() {
        Object.assign(this, _.cloneDeep(UNOBSERVABLE));
        extendObservable(this, {
            ...OBSERVABLE
        });
    }

    @action.bound update(data) {
        Object.assign(this, data);
    }

    @action.bound getFiles() {
        this.loading = true;
        const system = this.active_sys;
        if(!system || system === 'file_sys') {
            api.getFiles({listing: true}).then((res) => {
                runInAction(() => {
                    this.loading = false;
                    this.files_end = _.get(res, 'children', []);
                });
            });
        } else {
            this.loading = false;
            this.files_end = [];
        }
    }

    @action.bound getPjtFiles() {
        const pjtId = this.active_pjt;
        if(pjtId === '5a66beed8a2674ee68813659') {
            this.files_end = [];
        }
        else if(pjtId === '5a5c0f1a8a26864ba3261831') {
            this.files_end = [
                {
                    id:0,
                    pathOrName: "fastq_screen.conf",
                    dataSize: 4274,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc28a26864ba3261841/fastq_screen.conf",
                    folder: false
                },
                {
                    id: 1,
                    pathOrName: "A68_screen.txt",
                    dataSize: 960,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc28a26864ba3261841/A68/A68_screen.txt",
                    folder: false
                },
                {
                    id: 2,
                    pathOrName: "A68_screen.png",
                    dataSize: 6554,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc28a26864ba3261841/A68/A68_screen.png",
                    folder: false
                },
                {
                    id: 3,
                    pathOrName: "A68_screen.html",
                    dataSize: 308813,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc28a26864ba3261841/A68/A68_screen.html",
                    folder: false
                },
                {
                    id: 4,
                    pathOrName: "A68",
                    dataSize: -1,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc28a26864ba3261841/A68",
                    folder: true
                },
                {
                    id: 5,
                    pathOrName: "A67_screen.txt",
                    dataSize: 975,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc28a26864ba3261841/A67/A67_screen.txt",
                    folder: false
                },
                {
                    id: 6,
                    pathOrName: "A67_screen.png",
                    dataSize: 6521,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc28a26864ba3261841/A67/A67_screen.png",
                    folder: false
                },
                {
                    id: 7,
                    pathOrName: "A67_screen.html",
                    dataSize: 308828,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc28a26864ba3261841/A67/A67_screen.html",
                    folder: false
                },
                {
                    id: 8,
                    pathOrName: "A67",
                    dataSize: -1,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc28a26864ba3261841/A67",
                    folder: true
                },
                {
                    id: 9,
                    pathOrName: "A68.1_fastqc.zip",
                    dataSize: 364690,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc98a26864ba3261842/fastqczip/A68.1_fastqc.zip",
                    folder: false
                },
                {
                    id: 10,
                    pathOrName: "A68.1_fastqc.html",
                    dataSize: 296662,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a5c0f1a8a26864ba3261831/task_5a5dadc98a26864ba3261842/fastqczip/A68.1_fastqc.html",
                    folder: false
                }
            ]
        }
        else if(pjtId === '5a4b1f088a26864ba326176b') {
            this.files_end = [
                {
                    id:100,
                    pathOrName: "RZ_0_01PCT_1.P.1.fq.gz",
                    dataSize: 1287773502,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a4b1f088a26864ba326176b/task_5a55afda8a26864ba3261828/RZ_0_01PCT_1.P.1.fq.gz",
                    folder: false
                },
                {
                    id: 101,
                    pathOrName: "RZ_0_01PCT_3.U.1.fq.gz",
                    dataSize: 51369054,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a4b1f088a26864ba326176b/task_5a55afda8a26864ba3261828/RZ_0_01PCT_3.U.1.fq.gz",
                    folder: false
                },
                {
                    id: 102,
                    pathOrName: "Poly_A_10_pg_2.P.1.fq.gz",
                    dataSize: 1191692402,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a4b1f088a26864ba326176b/task_5a55afda8a26864ba3261828/Poly_A_10_pg_2.P.1.fq.gz",
                    folder: false
                },
                {
                    id: 103,
                    pathOrName: "RZ_0_01PCT_3.U.2.fq.gz",
                    dataSize: 11240548,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a4b1f088a26864ba326176b/task_5a55afda8a26864ba3261828/RZ_0_01PCT_3.U.2.fq.gz",
                    folder: false
                },
                {
                    id: 104,
                    pathOrName: "Poly_A_10_pg_2.U.2.fq.gz",
                    dataSize: 10689444,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a4b1f088a26864ba326176b/task_5a55afda8a26864ba3261828/Poly_A_10_pg_2.U.2.fq.gz",
                    folder: false
                },
                {
                    id: 105,
                    pathOrName: "RZ_0_01PCT_3.P.2.fq.gz",
                    dataSize: 1215204173,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a4b1f088a26864ba326176b/task_5a55afda8a26864ba3261828/RZ_0_01PCT_3.P.2.fq.gz",
                    folder: false
                },
                {
                    id: 106,
                    pathOrName: "RZ_10PCT_1.U.1.fq.gz",
                    dataSize: 57598709,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a4b1f088a26864ba326176b/task_5a55afda8a26864ba3261828/RZ_10PCT_1.U.1.fq.gz",
                    folder: false
                },
                {
                    id: 107,
                    pathOrName: "RZ_0_01PCT_3.P.1.fq.gz",
                    dataSize: 1181787163,
                    savePathAndName: "/media/nbfs/project/@2018/@2018-01/project_5a4b1f088a26864ba326176b/task_5a55afda8a26864ba3261828/RZ_0_01PCT_3.P.1.fq.gz",
                    folder: false
                }
            ];
        }
    }

    @action.bound deleteFile(params) {
        api.deleteFile(params).then((res) => {
            this.getFiles();
        });
    }
}

export default new File();
