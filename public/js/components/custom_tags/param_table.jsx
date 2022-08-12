var React = require('react');

/**
  Component for unit tale editing (or unit tale template editing)
*/

class ParamTable extends React.Component {

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){
        
        var countColumns = props.oneColumnMode ? 1 :
            (props.parameters.length && props.parameters[0].value2 !== undefined ? 3 : 2);

        this.setState({
            parameters: props.parameters,
            countColumns: countColumns
        });
    }

    render() {
        var paramRows = [];
        for(var i=0;i<this.props.parameters.length; i++){
            paramRows.push(<ParamTableRow key={i} index={i}
                                          isFirst = {i == 0}
                                          isLast = {i == this.props.parameters.length-1}
                                          param={this.state.parameters[i]}
                                          countColumns={this.state.countColumns}
                                          handleChange={(index, fieldName, fieldValue) => this.handleChange(index, fieldName, fieldValue)}
                                          handleDelete={(index) => this.handleDelete(index)}
                                          handleMoveUp={(index) => this.handleMoveUp(index)}
                                          handleMoveDown={(index) => this.handleMoveDown(index)}/>);
        }

        var templateButtons = [];
        if(this.props.templates) {
            for (let i = 0; i < this.props.templates.length; i++) {
                templateButtons.push(<span key={i} className="b-button" onClick={() => this.handleApplyTemplate(i)}>
                {this.props.labels['Use template'] + ' "' + this.props.templates[i].name + '"'}<br />
                </span>
                );
            }
        }

        return <div className="b-edit-table-container">
            <table className="edit_params_table info_table b-edit-table-container__table">
                <thead>
                <tr>
                    <th className="name_header">{ this.props.labels['Name'] }</th>
                    {this.state.countColumns > 1 &&
                        <th className="value_header">{ this.props.labels['Value'] }</th>
                    }
                    {this.state.countColumns > 2 &&
                        <th className="value2_header">{ this.props.labels['Value'] + '2' }</th>
                    }
                </tr>
                </thead>
                <tbody>
                    {paramRows}
                </tbody>
            </table>
            <br />
            <span className="b-button" onClick={() => this.handleAdd()}>{this.props.labels['Add row']}</span><br />
            {this.state.countColumns != 1 &&
                <span className="b-button" onClick={() => this.handleChangeCountColumns()}>
                    {this.props.labels['Use']+' '+(this.state.countColumns == 2 ? 3 : 2)+' '+this.props.labels['columns']}
                <br /></span>
            }
            {templateButtons}
        </div>
    }

    handleChange(index, fieldName, fieldValue){
        let parameters = this.state.parameters;
        parameters[index][fieldName] = fieldValue;
        this.saveTable(parameters);
    }

    handleDelete(index){
        let parameters = this.state.parameters;
        parameters.splice(index, 1);
        this.saveTable(parameters);
    }

    handleMoveUp(index){
        let parameters = this.state.parameters;
        let tempParam = parameters[index];
        parameters[index] = parameters[index-1];
        parameters[index-1] = tempParam;
        this.saveTable(parameters);
    }

    handleMoveDown(index){
        let parameters = this.state.parameters;
        let tempParam = parameters[index];
        parameters[index] = parameters[index+1];
        parameters[index+1] = tempParam;
        this.saveTable(parameters);
    }

    handleAdd(){
        let parameters = this.state.parameters ? this.state.parameters : [];
        parameters.push({name:"",value:""});
        this.setState({parameters:parameters});
    }

    handleApplyTemplate(templateNumber){
        let template = this.props.templates[templateNumber];
        let parameters = this.state.parameters;
        for(var j=0;j<template.values.length;j++){
            var field = template.values[j].name;
            var found = false;
            for(var k=0;k<parameters.length;k++){
                if(field === parameters[k].name){
                    found = true;
                }
            }
            if(!found){
                parameters.push({name:field,value:""});
            }
        }
        this.saveTable(parameters);
    }

    handleChangeCountColumns(){
        let countColumns = this.state.countColumns == 2 ? 3 : 2;
        this.setState({countColumns:countColumns});
    }

    saveTable(parameters){
        this.setState({parameters:parameters});
        this.props.handleChange(parameters)
    }
}

class ParamTableRow extends React.Component {

    render() {
        return <tr>
                <td className="info_table_td_name">
                    <input className="info_table_name_input" value={this.props.param.name}
                           onChange={this.handleChange.bind(this, "name")}/>
                </td>
                {this.props.countColumns > 1 &&
                <td><input className="info_table_value_input" value={this.props.param.value}
                           onChange={this.handleChange.bind(this, "value")}/>
                </td>
                }
                {this.props.countColumns > 2 &&
                <td><input className="info_table_value2_input" value={this.props.param.value2}
                           onChange={this.handleChange.bind(this, "value2")}/>
                </td>
                }
                <td><button className="b-button_del b-button" onClick={() => this.deleteRow()}/></td>
                <td>
                    {!this.props.isFirst &&
                        <button className="b-textpanel__button-up b-button" onClick={() => this.moveUp()}/>
                    }
                </td>
                <td>
                    {!this.props.isLast &&
                        <button className="b-textpanel__button-down b-button" onClick={() => this.moveDown()}/>
                    }
                </td>
            </tr>
    }

    handleChange(fieldName, e){
        this.props.handleChange(this.props.index, fieldName, e.target.value);
    }

    deleteRow(){
        this.props.handleDelete(this.props.index);
    }

    moveUp(){
        this.props.handleMoveUp(this.props.index);
    }

    moveDown(){
        this.props.handleMoveDown(this.props.index);
    }
}
export default ParamTable;