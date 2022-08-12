var React = require('react');
import { connect } from 'react-redux'
import { changeMapSetting, showPopup, hidePopup, zoomPlus, zoomMinus, showMyMapsPopup, showMyDataPopup, signout, setIndexMode, rewindToEvent } from '../../actions/actions';
import * as popup_types from '../../actions/popup_types';


class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errors:[], fields:{}};
    }
    
    getXXageMenuItems() {
        var items = [];

        items.push(<a key='editor' onClick={()=>{this.props.showAbout()}} href="#">
            {this.props.labels['About'] }
        </a>);
        items.push(<span key='delim2'/>); 
        
        items.push(<a key='disvk' onClick={()=>{this.props.goToDiscussVk()}} href="#">
           Обсудить в Vkontakte
        </a>);
        items.push(<a key='disfb' onClick={()=>{this.props.goToDiscussFb()}} href="#">
           Обсудить в Facebook
        </a>);
        items.push(<span key='delim3'/>); 
        
        items.push(<a key='ss' onClick={()=>{this.props.showSettings()}}  href="#" href="#">
               {this.props.labels['Settings']}
            </a>);
        items.push(<span key='delim4'/>);  
        items.push(<a key='close' onClick={()=>{this.props.hidePopup()}} href="#">
                {this.props.labels['Close'] }
            </a>);
        
        return items;
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
             
        if(!this.props.isMobile){
            items.push(<a key='cm' onClick={()=>{this.props.showNewMapForm()}}  href="#" href="#">
                {this.props.labels['Create map']}
            </a>);
        }
        items.push(<a key='htcm' href={"/"+this.props.lang+"/docs"}>
            {this.props.labels['How to create a map']}
        </a>);
        if(!this.props.isMainPage) {
            items.push(<span key='delim6'/>); 
        
            items.push(<a key='sd' onClick={()=>{this.props.showDescription()}}  href="#" href="#">
                {this.props.labels['Map Description']}
            </a>);
            items.push(<a key='ss' onClick={()=>{this.props.showSettings()}}  href="#" href="#">
               {this.props.labels['Settings']}
            </a>);
            if(this.props.isMobile) {
                items.push(<a key='message' onClick={()=>{this.props.showCommentPopup()}} href="#">
                    {this.props.labels['Message'] }
                </a>);
            }
            items.push(<span key='delim2'/>);        
        }
            
        if(!this.props.isMobile){
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
        if(!this.props.isMainPage || this.props.isMobile) {
            items.push(<span key='delim5'/>);  
            items.push(<a key='close' onClick={()=>{this.props.hidePopup()}} href="#">
                    {this.props.labels['Close'] }
                </a>);
        }
        return items;
        
    }


    render(){
       var items = this.props.isXXage ? this.getXXageMenuItems() : this.getMenuItems();
        return <div className="b-main-menu-popup">
               {items}
        </div>
    }

  

}

export default connect((state, ownProps) => ({
        labels: state.labels,
        lang: state.lang,
        isMobile: state.isMobile,
        isAuth: state.user !== null,
        hreflangs: state.hreflangs,
        isXXage: state.isXXage,
        isMainPage: state.mapId == null,
        time: state.time,
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
            showSettings: () => {
                dispatch(showPopup(popup_types.SETTINGS_MENU))
            },
            showCommentPopup: () => {
                dispatch(showPopup(popup_types.COMMENT, {}))
            },
            showDescription: () => {
                dispatch(showPopup(popup_types.MAP_INFO))
            },
            showNoEditMessage: () => {
                dispatch(showPopup(popup_types.MESSAGE, {message: "Sorry, you can create new map only in desktop version"}))
            },
            showNoEditMessage: () => {
                dispatch(showPopup(popup_types.MESSAGE, {message: "Sorry, you can create new map only in desktop version"}))
            },
            zoomPlus: (eventId) => {
                dispatch(zoomPlus());
            },
            zoomMinus: (eventId) => {
                dispatch(zoomMinus());
            },
            hidePopup: () => {
                dispatch(hidePopup())
            },
            setIndexMode: (indexMode, time) => {
                
                dispatch(hidePopup())
                dispatch(setIndexMode(indexMode))
       
            },
            showAbout:() => {
                dispatch(showPopup(popup_types.MESSAGE, {message: "Интерактивная историческая карта XX века.<br>Цель карты - помочь в понимании контекста исторических событий.<br>Для широкой аудитории. <br>Тексты взяты из вики. <br><br>Карта сделана с помощью редактора исторических карт <a target='_blank' href='https://chronocon.org/ru'>Хронокон</a>. Редактор открытый, с его помощью подобную карту произвольного исторического периода может сделать любой желающий."}))
            },
            
            goToDiscussFb:() => {
                 window.open('https://www.facebook.com/profile.php?id=100008615445547', '_blank').focus();
            },
            
            goToDiscussVk:() => {
                 window.open('https://www.facebook.com/profile.php?id=100008615445547', '_blank').focus();
            },
           
        }
    }
)(MainMenu);


