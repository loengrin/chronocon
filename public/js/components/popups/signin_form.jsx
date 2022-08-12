var React = require('react');
import { connect } from 'react-redux'
import { signin} from '../../actions/actions';
import { FormValidator } from '../../libs/form_validator';

/**
  Component for user signin window
*/
class  SigninForm extends React.Component {
    constructor(props) {
        super(props);
        var that = this;
        window.uLoginCallback = function (token) {
            that.signinSocial(token)
        }
    }

    componentWillMount() {
        this.setState({errorMessage:'', fields:{login:'',password:''}});
    }

    componentWillReceiveProps(newProps){
        this.setState({errorMessage:'', fields:{login:'',password:''}});
    }

    handleChange(fieldName, e){
        this.setField(fieldName, e.target.value);

    }

    setField(fieldName, fieldValue){
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields:fields});
    }

    render() {

        var socialHtml = '<a id="uLogin" href="#"'+
            'data-ulogin="display=window;theme=classic;fields=nickname,first_name,last_name,'+
            'email;providers=;hidden=;redirect_uri=;callback=uLoginCallback;mobilebuttons=0;">'+
            '<img width="187" height="30" src="https://ulogin.ru/img/button.png?version=img.2.0.0" />'+
            '</a>';

        return <div className="b-signin-form">
            <table className="show_object_table">
                <tbody>
                <tr>
                    <td>{this.props.labels['Login']}</td>
                    <td>
                        <input className="b-text-input"
                               value={this.state.fields.login}
                               onChange={(e)=>{this.handleChange('login',e)}}
                        />
                    </td>
                </tr>
                <tr>
                    <td>{this.props.labels['Password']}</td>
                    <td>
                        <input className="b-text-input"
                               value={this.state.fields.password}
                               type="password"
                               onChange={(e)=>{this.handleChange('password',e)}}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            <a className="b-button b-save-button js-submit" onClick={()=>{this.send()}}>{this.props.labels['Send']}</a>
            <span className="b-error-span js-error">{this.state ? this.state.errorMessage : ''}</span>
            <div className='social-login' dangerouslySetInnerHTML={{__html: socialHtml}} />
        </div>
    }

    send(){
        var that = this;
        var validator = new FormValidator();
      
        var errors = validator.validate({
            fields: this.state.fields,
            validators: {
                'login': {'type': 'NOT_EMPTY', 'errorLabel': this.props.labels['Empty login']},
                'password': {'type': 'NOT_EMPTY', 'errorLabel': this.props.labels['Empty password']},
            },
        });

        if(errors.length){
            this.setState({errorMessage:errors[0]});
        }
        else{
            this.props.signin(this.state.fields, function () {
                that.setState({errorMessage:that.props.labels['Wrong login or password']});
            }, this.props.authCallback);
        }
    }

   
    signinSocial(token){
        var that = this;
        this.props.signin({token:token}, function () {
            that.setState({errorMessage:that.props.labels['Authentication error']});
        })
     };
}

export default connect((state, ownProps) => ({
        authCallback: ownProps.callback
    }),
    (dispatch, ownProps) => {
        return {
            signin: (fields, nonAuthCallback, authCallback) => {
                dispatch(signin(fields, nonAuthCallback, authCallback))
            }
        }
    }

)(SigninForm);
