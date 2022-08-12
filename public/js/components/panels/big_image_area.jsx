var React = require('react');
import { connect } from 'react-redux'
import * as popup_types from '../../actions/popup_types';
import { hideBigImage } from '../../actions/actions';


/**
 Component for image which became visible when user clicks on image in description popup.
*/
class BigImageArea extends React.Component {
    constructor(props) {
        super(props);
   }

    render() {
        return <div className={'b-popup-frame'}>
            <div className="b-popup-frame-top">
                <div className="b-popup-frame-top__right-corner" onClick={() => this.props.hideImage()}></div>
            </div>
            <img src={this.props.bigImageOpened}/>
        </div>
    }
}



export default connect((state, ownProps) => ({
        bigImageOpened: state.bigImageOpened,
    }),
    (dispatch, ownProps) => {
        return {
            hideImage: () => {
                dispatch(hideBigImage());
            }
        }
    }

)(BigImageArea);