var React = require('react');
import { connect } from 'react-redux'
import { saveUnitCoordinates } from '../../actions/actions';
import { FormValidator } from '../../libs/form_validator';

/**
  Component for unit coordinates form
*/
class UnitCoordinates extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {errors: [], fields: {}};
    }

    componentWillMount() {
     this.setStateByProps(this.props);
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }
    
    setStateByProps(props){
        var timeObjectField = this.props.unit.getTimeObjectFieldContainsDate('dynamicTerritory',this.props.currentDate);
        var territoryValue = timeObjectField.getValue();
        var coordinates = this.props.unit.getType() == 'region' ? territoryValue.polygons : (territoryValue.points ? [territoryValue.points] : territoryValue.branchs);
        if(this.props.path !== undefined){
            coordinates = coordinates[this.props.path];
        }

        var fields = {
            coordinates: JSON.stringify(coordinates),
        };

        this.setState({
            fields: fields,
        });
    }

    render() {

        return <div className='b-unit-coordinates-form'>
            <table className="show_object_table">
                <tbody>
                <tr>
                    <td>{this.props.labels['Coordinates']}</td>
                    <td><textarea className='b-coordinates-textarea js-unit-coordinates'
                                  value={this.state.fields.coordinates}
                                  onChange={(e) => {this.setField('coordinates', e.target.value)}}
                    /></td>
                </tr>
                </tbody>
            </table>
            <a className="b-button b-save-button js-submit" onClick={()=>{this.save()}}>{this.props.labels['Save']}</a>
            <span className="b-error-span js-error"></span>
        </div>

    }


    setField(fieldName, fieldValue) {
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields: fields});
    }

    save() {
        var fields = this.state.fields;
        try {
            fields['coordinates'] = JSON.parse(fields['coordinates']);
        } catch (e) {
            fields['coordinates']  = '';
        }
        var validators = {
            'coordinates': {'type':'NOT_EMPTY','errorLabel':this.props.labels['Coordinates not valid']},
        }
        var validator = new FormValidator();
        var errors =  validator.validate({fields:fields, validators:validators}, true);
        if(errors.length){
            this.setState({errors:errors});
        }
        else {
            this.props.saveUnitCoordinates(fields['coordinates']);
        }
    }
}

export default connect((state, ownProps) => ({
        labels: ownProps.labels,
        currentDate: ownProps.currentDate,
        unit: ownProps.unit,
        path:  ownProps.path,
    }),
    (dispatch, ownProps) => {
        return {
            saveUnitCoordinates: (coordinates) => {
                dispatch(saveUnitCoordinates(ownProps.unit, coordinates, ownProps.segmentNumber));
            },

        }
    }
)(UnitCoordinates);


