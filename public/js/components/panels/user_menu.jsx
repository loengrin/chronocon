import { connect } from 'react-redux'
var React = require('react');
import {showPopup, signout, showMyDataPopup, showMyMapsPopup} from '../../actions/actions'
import * as popup_types from '../../actions/popup_types';

/**
    Component for menu on top of map page
*/
class UserMenu extends React.Component {
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
            itemElements.push(<span key={items[i].label} className="b-menu__link" onClick={items[i].callback}>
                {this.props.labels[items[i].label]}
            </span>);
        }

        return <div className="b-menu">
            {itemElements}
            <span className="b-menu__delimiter">|</span>
            <a className="b-menu__link" href={"/"+this.props.lang+"/about"}>
                {this.props.labels['About project']}
            </a>
            <a className="b-menu__link" href={"/"+this.props.lang+"/docs"}>
                 {this.props.labels['How to create a map']}
            </a>
            <a className="b-menu__link" href= {"/"+this.props.lang+"/donate"} >
                {this.props.labels['Donate']}
            </a>
            <a className="b-menu__link" href={this.props.lang == 'ru' ? "http://vk.com/chronocon" :"https://www.facebook.com/Chronoconorg-587682765063207"} >
                {this.props.labels['Discuss']}
            </a>
        </div>
    }
}

export default connect((state, ownProps) => ({
    isAuth: state.user !== null,
    labels: state.labels,
    lang: state.lang,
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
)(UserMenu);

