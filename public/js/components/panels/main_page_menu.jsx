import { connect } from 'react-redux'
var React = require('react');
import {showPopup, signout, showMyDataPopup, showMyMapsPopup} from '../../actions/actions'
import * as popup_types from '../../actions/popup_types';


class MainPageMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errors:[], fields:{}};
    }

    render(){
        var items = [];
        if(this.props.isAuth){
            items.push({label:'My data', callback:this.props.showMyData});
            items.push({label:'My maps', callback:this.props.showMyMaps});
            items.push({label:'Signout', callback:this.props.signout});
        }
        else{
            items.push({label:'Signin', callback:this.props.signin});
            items.push({label:'Register', callback:this.props.register});
        }

        var itemElements = [];
        for(var i =0;i < items.length; i++){
            itemElements.push(<li className="b-user-menu__link" key={items[i].label}>
                <span className="b-label" onClick={items[i].callback}>{this.props.labels[items[i].label]}</span>
            </li>);
        }

        return <div className="b-menu-list">
            {itemElements}
        </div>
    }
}

export default connect((state, ownProps) => ({
    isAuth: state.user !== null,
    labels: state.labels,
}),
    (dispatch, ownProps) => {
        return {
            signin: () => {
                dispatch(showPopup(popup_types.SIGNIN))
            },
            signout: () => {
                dispatch(signout())
            },
            register: () => {
                dispatch(showPopup(popup_types.REGISTER))
            },
            showMyData: () => {
                dispatch(showMyDataPopup())
            },
            showMyMaps: () => {
                dispatch(showMyMapsPopup())
            }
        }
    }
)(MainPageMenu);

