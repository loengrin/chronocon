var React = require('react');
import RegisterForm from './register_form.jsx';
import SigninForm from './signin_form.jsx';

import { connect } from 'react-redux'

/**
  Component with user registration form and signin form
*/
class SigninOrRegisterForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <table className="">
            <tbody>
            <tr>
                <th className='b-login-register-table-td'>{this.props.labels['Signin']}:</th>
                <th className='b-login-register-table-td'>{this.props.labels['Registration']}:</th>
            </tr>
            <tr>
                <td className='b-login-register-table-td'><SigninForm labels={this.props.labels} callback={this.props.callback}/></td>
                <td className='b-login-register-table-td'><RegisterForm labels={this.props.labels} myDataMode={false} callback={this.props.callback}/></td>
            </tr>
            </tbody>
        </table>
    }
}

export default connect((state, ownProps) => {
    return {
        callback: ownProps.callback
    }},
    (dispatch, ownProps) => { return {}}
)(SigninOrRegisterForm);

