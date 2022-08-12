var React = require('react');
import { connect } from 'react-redux'

/**
  Component for message about abcence of edit rights
*/
class Message extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        return <div dangerouslySetInnerHTML={{__html: this.props.labels[this.props.message] ? this.props.labels[this.props.message] : this.props.message }} className='t-no-right-message'>
           
         </div>
    }
}
export default connect(
    (state, ownProps) => ({
        labels: state.labels
     }),
    (dispatch, ownProps) => {
        return {}
    }
)(Message);


