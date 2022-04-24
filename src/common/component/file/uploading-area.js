import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {message, Icon} from 'antd';
import {FILE_URL_PREFIX} from 'common/config';
import {FILE_VIRTUAL_PATH} from 'common/constant';

@inject('file')
@observer
class UploadingArea extends Component {
    initUploader = () => {
        const fileStore = this.props.file;
        const uploader = WebUploader.create({
            auto: false,
            dnd: this.refs['uploading-area'],
            swf: '/static/webuploader/Uploader.swf',
            pick: {
                id: this.refs['uploading-area']
            },
            accept: {
                // title: 'VCF',
                // extensions: 'vcf',
                // mimeTypes: 'text/x-vcard'
            },
            headers: {Authorization: 'Basic cGd4Omxyb2NrMTg2MTg2MTg2'},
            fileVal: 'uploadFile',
            fileSingleSizeLimit: 100 * 1024 * 1024
        });
        fileStore.uploader = uploader;
        uploader.onError = (code) => {
            if(code === 'Q_TYPE_DENIED') {
                message.error('Please upload the file in VCF or BED format');
            } else {
                message.error(code);
            }
        };
        uploader.onFileQueued = (file) => {
            fileStore.files_ing.splice(0, 0, {
                id: file.id,
                name: file.name,
                size: WebUploader.formatSize(file.size),
                status: 1,
                percent: 0
            });
        };
        uploader.onUploadStart = (file) => {
            uploader.option('server', `${FILE_URL_PREFIX}/irods-rest/rest/fileContents${FILE_VIRTUAL_PATH}/${file.name}`);
        };
        uploader.onUploadProgress = (file, percentage) => {
            const files = fileStore.files_ing;
            for(let i = 0, len = files.length; i < len; i++) {
                if(file.id === files[i].id) {
                    files[i].percent = (percentage * 100).toFixed(2);
                    break;
                }
            }
        };
        uploader.onUploadError = (file, reason) => {
            const files = fileStore.files_ing;
            let index;
            for(let i = 0, len = files.length; i < len; i++) {
                if(file.id === files[i].id) {
                    files[i].status = 3;
                    index = i;
                    break;
                }
            }
        };
        uploader.onUploadSuccess = (file, response) => {
            const files = fileStore.files_ing;
            let index;
            for(let i = 0, len = files.length; i < len; i++) {
                if(file.id === files[i].id) {
                    files[i].status = 4;
                    index = i;
                    break;
                }
            }
        };

    }

    componentDidMount() {
        Jt.loader.loadScripts(['static/webuploader/webuploader.js'], this.initUploader);
    }

    render() {
        return (
            <div className="uploading-area" ref="uploading-area">
                <p className="icon">
                    <Icon type="file-add"/>
                </p>
                <p className="text">
                    Click or drag file to this area to upload(VCF)
                </p>
            </div>
        );
    }
}

export default UploadingArea;
