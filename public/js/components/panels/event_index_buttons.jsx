var React = require('react');
import { connect } from 'react-redux'
import { setIndexMode, showPopup } from '../../actions/actions'
import * as popup_types from '../../actions/popup_types';

/**
  Component for buttons above event index panel
*/
class EventIndexButtons extends React.Component {
    render() {
        var datesClass  = this.props.indexMode == 'dates' && !this.props.editMode ? 'active-index-mode' : '';
        var chainsClass = this.props.indexMode == 'chains' && !this.props.editMode ? 'active-index-mode' : '';

        return <div>
            <a href="#" className={`index-mode-button ${ chainsClass }`}
               onClick={this.indexByStories.bind(this)}>{this.props.labels['By stories']}</a>
            <span> | </span>
            <a href="#" className={`index-mode-button ${ datesClass }`}
               onClick={this.indexByDates.bind(this)}>{this.props.labels['By dates']}</a>
        </div>
    }

    indexByStories(){
        this.props.setIndexMode('chains');
    }

    indexByDates(){
        this.props.setIndexMode('dates');
    }

}

export default connect((state, ownProps) => {
     return {
        indexMode: state.indexMode,
        labels: state.labels
     }},
    (dispatch, ownProps) => {
        return {
            setIndexMode: (indexMode) => {
                dispatch(setIndexMode(indexMode))
            },
        }
    }
)(EventIndexButtons);