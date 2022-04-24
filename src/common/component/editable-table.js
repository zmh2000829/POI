import React, {Component} from 'react';
import {Form, Input} from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index,  ...props}) => {
    return (
        <EditableContext.Provider value={form}>
            <tr {...props}/>
        </EditableContext.Provider>
    );
};

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
    state = {
        editing: false
    }

    componentDidMount() {
        if(this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if(this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({editing}, () => {
            if(editing) {
                this.input.focus();
            }
        });
    }

    handleClickOutside = (e) => {
        const {editing} = this.state;
        if(editing && this.cell !== e.target && !this.cell.contains(e.target)) {
            this.save();
        }
    }

    save = () => {
        const {record, handleSave} = this.props;
        this.form.validateFields((error, values) => {
            if(error) {
                return;
            }
            this.toggleEdit();
            handleSave({...record, ...values});
        });
    }

    render() {
        const {editing} = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;

        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {
                    editable ? (
                        <EditableContext.Consumer>
                            {(form) => {
                                this.form = form;
                                return (
                                    editing ? (
                                        <FormItem>
                                            {form.getFieldDecorator(dataIndex, {
                                                initialValue: record[dataIndex]
                                            })(
                                                <Input ref={node => (this.input = node)} onPressEnter={this.save}/>
                                            )}
                                        </FormItem>
                                    ) : (
                                        <div className="editable-cell-value-wrap" onClick={this.toggleEdit}>
                                            {restProps.children}
                                        </div>
                                    )
                                );
                            }}
                        </EditableContext.Consumer>
                    ) : restProps.children
                }
            </td>
        );
    }
}

class EditableTable extends Component {

    handleSave = () => {

    }

    getComponents = () => {
        return {
            body: {
                row: EditableFormRow,
                cell: EditableCell
            }
        }
    }

    getFinalColumns = (columns) => {
        return columns.map((col) => {
            if(!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave
                })
            };
        });
    }
}

export default EditableTable;
