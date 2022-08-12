var React = require('react');
import { register, saveMyData} from '../../actions/actions';
import { FormValidator } from '../../libs/form_validator';
import { connect } from 'react-redux'

/**
  Component for user registration form
*/
class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setDataToState(this.props);
    }

    componentWillReceiveProps(newProps){
        this.setDataToState(newProps)
    }

    setDataToState(props){
        console.log(props);
        var fields = {
            login: props.myDataMode ? props.myData.login : '',
            name: props.myDataMode ? props.myData.name : '',
            email: props.myDataMode ? props.myData.email : '',
            about: props.myDataMode ? props.myData.about : '',
            is_subscribed: props.myDataMode ? props.myData.is_subscribed : '1'
        };
        this.setState({fields:fields});
    }

    handleChange(fieldName, e){
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setField(fieldName, value);
    }

    setField(fieldName, fieldValue){
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields:fields});
    }

    render() {
        return <div className="b-register-form">
            <table className="show_object_table">
                <tbody>
                <tr><td>{this.props.labels['Login']}</td><td>
                    {this.props.myDataMode &&
                        <span>{this.state.fields.login}</span>
                    }
                    {!this.props.myDataMode &&
                        <input className="b-text-input" value={this.state.fields.login} onChange={(e)=>{this.handleChange('login',e)}}/>
                    }
                </td></tr>
                <tr>
                    <td>{this.props.labels['Your name']}</td>
                    <td><input className="b-text-input" value={this.state.fields.name} onChange={(e)=>{this.handleChange('name',e)}}/></td>
                </tr>
                <tr>
                    <td>{this.props.labels['Password']}</td>
                    <td><input className="b-text-input" type="password" onChange={(e)=>{this.handleChange('password',e)}}/></td>
                </tr>
                <tr>
                    <td>{this.props.labels['Password again']}</td>
                    <td><input className="b-text-input" type="password" onChange={(e)=>{this.handleChange('passwordAgain',e)}}/></td>
                </tr>
                <tr>
                    <td>{this.props.labels['Email']}</td>
                    <td><input className="b-text-input" value={this.state.fields.email} onChange={(e)=>{this.handleChange('email',e)}}/></td></tr>
                <tr>
                    <td>{this.props.labels['About me']}</td>
                    <td><textarea className="b-descr-textarea" onChange={(e)=>{this.handleChange('about',e)}} value={this.state.fields.about} /></td></tr>
                <tr>
                    <td>
                        {this.props.labels['I want to receive e-mail newsletters']}
                        <input type='checkbox' checked={this.state.fields.is_subscribed}  onChange={(e)=>{this.handleChange('is_subscribed',e)}}/>
                    </td>
                </tr>
                </tbody>
            </table>
            <a className="b-button b-save-button" onClick={()=>{this.save()}}>{this.props.labels['Send']}</a>
            <span className="b-error-span js-error">{this.state.errorMessage}</span>
        </div>
    }

    save(){
        var that = this;

        var validators = {
            'login': {'type':'NOT_EMPTY','errorLabel':this.props.labels['Empty login']},
            'email': {'type':'NOT_EMPTY','errorLabel':this.props.labels['Empty email']},
            'passwordAgain': {'type':'EQUAL_FIELD','secondField':'password','errorLabel':this.props.labels['Passwords are not equal']},
        };

        if(!this.props.myDataMode){
            validators['password'] = {'type':'NOT_EMPTY','errorLabel':this.props.labels['Empty password']};
        }
        
        var validator = new FormValidator();
        var errors = validator.validate({fields:this.state.fields, validators:validators});

        if(errors.length){
            this.setState({errorMessage:errors[0]});
        }
        else {
            if(this.props.myDataMode){
                this.props.saveMyData(this.state.fields);
            }
            else{
                this.props.register(this.state.fields, function () {
                    that.setState({errorMessage:that.props.labels['Login already exist']});
                }, this.props.authCallback)
            }
        }
    }

}

export default connect((state, ownProps) => ({
        myDataMode: ownProps.myDataMode,
        labels: state.labels,
        myData: ownProps.myData,
        authCallback: ownProps.callback
    }),
    (dispatch, ownProps) => {
        return {
            register: (fields, nonRegisterCallback, authCallback) => {
                dispatch(register(fields, nonRegisterCallback, authCallback))
            },
            saveMyData: (fields) => {
                dispatch(saveMyData(fields))
            }
        }
    }

)(RegisterForm);

