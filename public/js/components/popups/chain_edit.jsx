var React = require('react');
import { connect } from 'react-redux'
import { showPopup, saveChain } from '../../actions/actions'
import * as popup_types from '../../actions/popup_types';
import { FormValidator } from '../../libs/form_validator';

/**
  Component for event chain form
*/
class ChainForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errors:[], fields:{}};
    }

    componentWillMount() {
        this.setStateByProps(this.props);
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    setStateByProps(props){
        this.setState({
            fields:{
                name: props.isNew ? '' : props.chain.name
            }
        });
    }

    render(){
        return <div>
            <table className="show_object_table">
                <tbody>
                <tr>
                    <td>{ this.props.labels['Name']}</td>
                    <td>
                        <input className="b-text-input" value={ this.state.fields.name }
                               onChange={this.handleChange.bind(this, "name")}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            <a className="b-button b-save-button js-submit" onClick={()=>{this.save()}}>
                { this.props.labels['Save']}
            </a>
            &nbsp;&nbsp;
            <a href='#' className="b-cancel" onClick={()=>{this.props.cancel()}}>{ this.props.labels['Cancel']}</a>
            <span className="b-error-span js-error">{this.state.errors.join(", ")}</span>
        </div>
    }

    handleChange(field, e){
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({fields:fields});
    }

    save(){
        var fields = this.state.fields;
        var validators = {
            'name': {'type':'NOT_EMPTY','errorLabel':this.props.labels['Empty name']}
        }

        var validator = new FormValidator();
        var errors = validator.validate({fields:fields, validators:validators});

        if(errors.length){
            this.setState({errors:errors});
        }
        else {
            this.props.save(fields);
        }
    }

}

export default connect((state, ownProps) => ({
        labels: ownProps.labels,
        time: ownProps.time,
        chain: ownProps.chain,
        isNew: ownProps.isNew,
    }),
    (dispatch, ownProps) => {
        return {
            cancel: () => {
                dispatch(showPopup(popup_types.EVENT_LIST, {indexMode:'chains'}));
            },
            save: (fields) => {
                dispatch(saveChain(ownProps.isNew ? null : ownProps.chain.id, fields, ownProps.isNew));
                dispatch(showPopup(popup_types.EVENT_LIST, {indexMode:'chains'}));
            }
        }
    }
)(ChainForm);


