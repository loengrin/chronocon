var React = require('react');
import { connect } from 'react-redux'
import { saveDynamicStyle } from '../../actions/actions';
import ImageBlock from '../custom_tags/image_block.jsx';

/**
  Component for unit icon form
*/
class UnitIconForm extends React.Component {
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
            icon: timeObjectField.getValue().icon,
        };

        this.setState({
            fields: fields,
        });
    }

    render() {

        return <div className="b-unit-form">
            <ImageBlock
                icon={this.state.fields.icon}
                icons={this.state.icons}
                labels={this.props.labels}
                unitType={this.props.unit.getType()}
                callback={(icon) => {console.log(icon); this.setField('icon', icon)}}
            />
            <a className="b-button b-save-button js-submit" onClick={()=>{this.save()}}>{this.props.labels['Save']}</a>
            <span className="b-error-span js-error">{this.state.errors.join(", ")}</span>
        </div>
    }


    setField(fieldName, fieldValue) {
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields: fields});
    }

    save() {
        var fields = this.state.fields;
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
)(UnitIconForm);
