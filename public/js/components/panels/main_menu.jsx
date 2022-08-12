var React = require('react');
import { connect } from 'react-redux'
import { changeMapSetting, showPopup, zoomPlus, zoomMinus, showMyMapsPopup, showMyDataPopup, signout } from '../../actions/actions';
import * as popup_types from '../../actions/popup_types';



class MainMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }
   
    setStateByProps(props){
    }

    render(){
        var items = this.getMenuItems();
        return <div className="b-main-menu-popup">
               {items}
        </div>
    }

    getMenuItems() {
        var items = [];
        items.push(<a key='maps' href={"/"+this.props.lang+"/"}>
            {this.props.labels['Maps']}
        </a>);
        items.push(<span key='delim4'/>); 
        items.push(<a key='ap' href={"/"+this.props.lang+"/about"}>
            {this.props.labels['About project']}
        </a>);
        items.push(<a key='cm' onClick={()=>{this.showNewMapForm()}}  href="#" href="#">
            {this.props.labels['Create map']}
        </a>);
        items.push(<a key='htcm' href={"/"+this.props.lang+"/docs"}>
            {this.props.labels['How to create a map']}
        </a>);
        
        items.push(<span key='delim2'/>);        
        
            
         
        if(this.props.isAuth){
            items.push(<a key='md' onClick={()=>{this.props.showMyData()}} href="#">
                {this.props.labels['My data'] }
            </a>);
            items.push(<a key='mm' onClick={()=>{this.props.showMyMaps()}} href="#">
                {this.props.labels['My maps'] }
            </a>);
            items.push(<a key='so' onClick={()=>{this.props.signout()}} href="#">
                {this.props.labels['Signout'] }
            </a>);
        }
        else {
            items.push(<a key='si' onClick={()=>{this.props.signin()}} href="#">
                {this.props.labels['Signin'] }
            </a>);
            items.push(<a key='reg' onClick={()=>{this.props.register()}} href="#">
                {this.props.labels['Register'] }
            </a>);
        }
        if(this.props.hreflangs) {
            var langs = [];
            var labels = {'en':'English','ru':'Russian'};
            for(var lang in this.props.hreflangs) {
                if(this.props.lang != lang) {
                    langs.push(<a key={lang} href={this.props.hreflangs[lang]}>{labels[lang]}</a>);
                }
            }
            items.push(<div key='langs'>
                { langs.length > 0 && 
                 <span key='delim3'/>
                }
               {langs}
            </div>);
        }
        
           
      
//      <a href="/en" className={this.props.lang == 'en' ? 'active' : ''}>en</a>
//            <span>|</span>
//            <a href="/ru" className={this.props.lang == 'ru' ? 'active' : ''}>ru</a>
//            
        return items;
    }

    showNewMapForm() {
        
        console.log(this.props);
        if(this.props.isMobile) {
            this.props.showNoEditMessage();
        }
        else {
            this.props.showNewMapForm();
        }       
    }

}

export default connect(
    (state, ownProps) => ({
        labels: state.labels,
        lang: state.lang,
        isMobile: state.isMobile,
        isAuth: state.user !== null,
        hreflangs: state.hreflangs
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
            },
            showNewMapForm: () => {
                dispatch(showPopup(popup_types.MAP_FORM, {newMapMode: true}))
            },
            zoomPlus: (eventId) => {
                dispatch(zoomPlus());
            },
            zoomMinus: (eventId) => {
                dispatch(zoomMinus());
            },
        }
    }
)(MainMenu);


