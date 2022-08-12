var $ = require("jquery");
import ParamTable from '../custom_tags/param_table.jsx';

var React = require('react');
import { connect } from 'react-redux'
import * as popup_types from '../../actions/popup_types';
import { showPopup, saveUnitTable } from '../../actions/actions';
import CommonLib from '../../libs/common/common_lib.js';

/**
  Component for unit table  form
*/
class UnitTableForm extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){
      var table = props.isStatic ?
            (props.unit.getField('staticTable') ? props.unit.getField('staticTable') : []) :
            props.isNew ? props.unit.getTimeObjectFieldContainsDate('dynamicTable', props.currentDate).getValue() : props.dynamicTable.getValue();

      var templates = props.time.getTimeObjectById('MAIN').getField('unitTableTemplates');
      this.setState({table:CommonLib.clone(table), templates: templates});
    }

    render() {
        return <div className='b-edit-table-popup'>
          <ParamTable parameters={this.state.table}
                      templates = {this.state.templates}
                      labels={this.props.labels}
                      handleChange = {(table)=>{this.handleChange(table)}}
                      oneColumnMode = {false}/>
          <a className="b-button b-save-button js-submit"
                  onClick={()=>{this.save()}}>{ this.props.labels['Save']}</a>
          &nbsp;&nbsp;
          <a href='#' className="b-cancel" onClick={()=>{this.props.goBack()}}>{ this.props.labels['Cancel']}</a>
        </div>
    }

    save(){
        this.props.saveUnitTable(this.state.table);
        this.props.goBack()
    }

    handleChange(table){
        this.setState({'table':table});
    }
}

export default connect((state, ownProps) => {
        console.log(state, ownProps);
        return {
            unit: ownProps.unit,
            dynamicTable: ownProps.dynamicTable,
            isNew: ownProps.isNew,
            isStatic: ownProps.isStatic,
            currentDate: state.currentDate,
            time: state.time,
        }},
    (dispatch, ownProps) => {
        return {
            saveUnitTable: (table) => {
                dispatch(saveUnitTable(
                    ownProps.unit.getId(),
                    {table: table},
                    ownProps.isStatic,
                    ownProps.dynamicTable ? ownProps.dynamicTable.getId() : null,
                    ownProps.isNew
                ));
            },
            goBack: () => {
                dispatch(showPopup(popup_types.UNIT_INFO, {
                    unit: ownProps.unit,
                    dynamicTable: ownProps.dynamicTable,
                }));

            }
        }
    }
)(UnitTableForm);
