var React = require('react');
import { connect } from 'react-redux'
import UnitTable from '../custom_tags/unit_table.jsx';
import { DateFormatter } from '../../libs/date_formatter';

/**
Component for information block about unit. This block bacame visible on mouseover event on unit
*/
class UnitTip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatter = new DateFormatter(props.labels, props.lang, props.time.getCalendar().getMode());
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){
        if(!props.isTipDisplayed){
            //return false;
        }
        var formatter =  new DateFormatter(props.labels, props.lang, props.time.getCalendar().getMode());
       
        var unit = props.time.getTimeObjectById(props.unitId);
        if(!unit) {
            return false;
        }

        var dateMode = props.time.getCalendar().getMode();
        var table = [];
        if(unit.getType() != 'event') {
            var dynamicField = unit.getTimeObjectFieldContainsDate('dynamicTable', props.currentDate);
            if(!dynamicField) {
                return;
            }
            var dynamicTable = dynamicField.getValue();
            table = dynamicTable.concat(unit.getField('staticTable') ? unit.getField('staticTable') : []);
        }
        this.setState({
            table: table,
            name: unit.getField('name'),
            isFog: unit.getType() == 'fog',
            isUp: unit.getType() == 'city' || unit.getType() == 'event' || unit.getType() == 'army'
        });

        if(!props.editMode || (unit.getType() != 'region' && unit.getType() != 'line')){
            return;
        }

        var dynamicTerritory = unit.getTimeObjectFieldContainsDate('dynamicTerritory',props.currentDate);
        var dateLabel = null;
        if(dynamicTerritory){
            var fullTimelineLife = props.time.calendar.eQ(dynamicTerritory.getDateBegin(), props.time.getDateBegin()) &&
                props.time.calendar.eQ(dynamicTerritory.getDateEnd(), props.time.getDateEnd());
            if(!fullTimelineLife){
                if(props.time.calendar.eQ(dynamicTerritory.getDateBegin(), dynamicTerritory.getDateEnd())){
                    dateLabel =  formatter.getDateLabel(dynamicTerritory.getDateBegin());
                }
                else{
                    dateLabel =  formatter.getDateLabel(dynamicTerritory.getDateBegin())+"-"+
                        formatter.getDateLabel(dynamicTerritory.getDateEnd());
                }
            }
        }
        this.setState({dateLabel: dateLabel, formatter: formatter});
    }


    render(){
        
        if(!this.props.isTipDisplayed){
            //return false;
        }
        if(this.state.isFog){
            return false;
        }


        var position = this.props.mousePosition;
        if(!position) {
            return false;
        }

        return <div className={this.state.isUp ? 'b-unit-tip-up' : 'b-unit-tip'} style={{left:position.x,top:position.y}}>
            <div className='b-unit-tip-title'>{this.state.name}</div>
            <UnitTable
                parameters={this.state.table}
                dateLabel={this.state.dateLabel}
            />
        </div>
    }


}
export default connect(
    (state, ownProps) => ({
        mousePosition: state.isTipDisplayed ? state.tipParams.mousePosition : null,
        unitId: state.isTipDisplayed ? state.tipParams.unitId : null,
        isTipDisplayed: state.isTipDisplayed,
        time: state.time,
        currentDate: state.currentDate,
        editMode: state.editMode,
        labels: state.labels,
        lang: state.lang,
    }),
    (dispatch, ownProps) => {
        return {

        }
    }
)(UnitTip);


