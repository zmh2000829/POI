import React, {Component} from 'react';

class JsonEditor extends Component {
    initEditor = () => {
        const {mode = 'code', search = false, data = {}} = this.props;
        this.editor = new JSONEditor(
            this.refs['json-editor'],
            {
                mode,
                search
            },
            data
        );
    }

    setJson = (data) => {
        if(this.editor) {
            this.editor.set(data);
        }
    }

    getJson = () => {
        const {mode} = this.props;
        if(this.editor) {
            return this.editor.get();
        }
        return {};
    }

    componentDidMount() {
        Jt.loader.loadSheets(['static/jsoneditor/jsoneditor.min.css']);
        Jt.loader.loadScripts(['static/jsoneditor/jsoneditor.min.js'], this.initEditor);
    }

    componentWillReceiveProps(nextProps) {
        this.setJson(nextProps.data);
    }

    componentWillUnmount() {
        if(this.editor) {
            this.editor.destroy();
        }
    }

    render() {
        return (
            <div ref="json-editor" style={{width: '100%', height: '100%'}}>

            </div>
        );
    }
}

export default JsonEditor;
