var React = require('react');
import { connect } from 'react-redux'
import { saveDynamicStyle } from '../../actions/actions';
import Select from '../custom_tags/select.jsx';

/**
  Component for unit color form
*/
class UnitColorForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errors: [], fields: {}};
    }

    componentWillMount() {
     this.setStateByProps(this.props);
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }
    
    setStateByProps(props){
        var timeObjectField = props.unit.getTimeObjectFieldContainsDate('dynamicStyle',props.currentDate);
        var fields = {
            color: timeObjectField.getValue().color,
            opacity:timeObjectField.getValue().opacity,
        };
        fields.opacity = 100 - fields.opacity;
      
        this.setState({
            fields: fields,
        });
    }

    render() {

        return <div className="b-unit-form">
            <table className="show_object_table">
                <tbody>
                    <tr>
                        <td>{this.props.labels['Color']}</td>
                        <td>
                            <input className='js-unit-color' type="color" value={ this.state.fields.color }
                                   onChange={(e) => {this.setField('color', e.target.value)}}/>
                        </td>
                    </tr>
                    <tr>
                        <td>{this.props.labels['Transparent']}</td>
                        <td className='js-unit-transparent'>
                            <Select
                                options={this.getOpacityOptions()}
                                selectedOption={this.state.fields.opacity}
                                callback={(opacity) => {this.setField('opacity', opacity)}}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <a className="b-button b-save-button js-submit" onClick={()=>{this.save()}}>{this.props.labels['Save']}</a>
            <span className="b-error-span js-error">{this.state.errors.join(", ")}</span>
        </div>
    }

    getOpacityOptions() {
        var transparentArr = {};
        for(var i = 0;i<=100;i+=10) {
            transparentArr[i] = i+"%";
        }
        return transparentArr;
    }

    setField(fieldName, fieldValue) {
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields: fields});
    }

    save() {
        var fields = this.state.fields;
        fields.opacity = 100 - fields.opacity;
        this.props.saveDynamicStyle(fields);
    }
}

export default connect((state, ownProps) => ({
        labels: ownProps.labels,
        currentDate: ownProps.currentDate,
        unit: ownProps.unit,
    }),
    (dispatch, ownProps) => {
        return {
            saveDynamicStyle: (style) => {
                dispatch(saveDynamicStyle(ownProps.unit, style, ownProps.isNew));
            },
        }
    }

)(UnitColorForm);


