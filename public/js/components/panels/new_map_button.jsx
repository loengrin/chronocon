import { connect } from 'react-redux'
var React = require('react');
import { showPopup } from '../../actions/actions'
import * as popup_types from '../../actions/popup_types';

/**
  Compoennt for new map button on main page
*/
class NewMapButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return <ul className="b-menu-list b-menu__ul">
            <li className="b-new-map__link" onClick={()=>{this.props.showNewMapForm()}}>
                {this.props.labels['Create map']}
            </li>
        </ul>
    }
}

export default connect((state, ownProps) => ({
        labels: state.labels,
    }),
    (dispatch, ownProps) => {
        return {
            showNewMapForm: () => {
                dispatch(showPopup(popup_types.MAP_FORM, {newMapMode: true}))
            },
        }
    }

)(NewMapButton);

