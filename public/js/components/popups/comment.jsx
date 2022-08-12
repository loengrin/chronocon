
var React = require('react');
import { saveComment, hidePopup } from '../../actions/actions';
import { connect } from 'react-redux'
import Select from '../custom_tags/select.jsx';

/**
  Component for unit description form
*/
class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errors: [], fields: {}};
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){
        var that = this;
        this.setState({
            alreadySent: false,
            fields: {
                email: props.user ? props.user.email : ''
            }
        });

    }
    
    setField(fieldName, fieldValue) {
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields: fields});
    }


    render() {

      return <div>
            {this.props.labels['Email'] } ({this.props.labels['If you need response'] }):<br />
            <div>
                <input className='without-table' style={{width:'35em'}} value={ this.state.fields.email }
                onChange={(e)=>{this.setField('email',e.target.value)}}/><br />
            </div><br />
            {this.props.labels['Subject'] }:<br />
            <Select
                options={{
                    'NONE':this.props.labels['Select subject...'],
                    'INCORRECT':this.props.labels['Notify about incorrect data'],
                    'BUG':this.props.labels['Notify about bug on the site'],
                    'JOIN':this.props.labels['Want to join to map creation'],
                    'OTHER':this.props.labels['Other']
                    }}
                selectedOption={this.state.fields.subject}
                callback={(subject) => {this.setField('subject', subject)}}
            /><br /><br />
             
            {this.props.labels['Message'] }:<br />
            <textarea className='without-table' rows="5" cols="60"  value={ this.state.fields.message }
                      onChange={(e)=>{this.setField('message',e.target.value)}}/><br /><br />
            <a className="b-button b-save-button" onClick={()=>{this.saveComment()}}>
                {this.props.labels['Save'] }
            </a>
             &nbsp;&nbsp;<a href='#' className="b-cancel" onClick={()=>{this.props.goBack()}}>{this.props.labels['Cancel']}</a>
       </div>;
    }
    
    saveComment() {
        this.props.saveComment(this.state.fields.email, this.state.fields.subject, this.state.fields.message);
    }
}

export default connect((state, ownProps) => {
        return {
            user: state.user,
            labels: state.labels
        }},
    (dispatch, ownProps) => {
        return {
            saveComment: (email, subject, message) => {
                dispatch(saveComment(email, subject, message));

            },
            goBack: () => {
                dispatch(hidePopup());
            }
        }
    }
)(Comment);
