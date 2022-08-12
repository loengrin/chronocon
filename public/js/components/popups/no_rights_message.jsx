var React = require('react');
import { connect } from 'react-redux'
import { showMapSavePopup } from '../../actions/actions'

/**
  Component for message about abcence of edit rights
*/
class NoRightsMessage extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        return <div className='t-no-right-message'>
            {this.props.labels['You have no right to change this map. You can write to info@chronocon.org or ']}
            <a className='b-copy_link' href='#' onClick={()=>{this.props.showCopyPopup()}}>
                {this.props.labels['save copy of map']}
                </a>
        </div>
    }
}
export default connect(
    (state, ownProps) => ({
        labels: state.labels
     }),
    (dispatch, ownProps) => {
        return {
            showCopyPopup: () =>{
                dispatch(showMapSavePopup(true));
            }
        }
    }
)(NoRightsMessage);


