var React = require('react');
import { connect } from 'react-redux'
import MainMenu from '../panels/main_menu.jsx';
import { enableEditMode, disableEditMode, showPopup, zoomPlus, zoomMinus, setIndexMode, showPospup, hidePopup, changeMapType,showMessage } from '../../actions/actions'
import * as popup_types from '../../actions/popup_types';


class MainMenuArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {fullScreenEnabled: false, isMainMenuDisplayed:props.isOpened, isOpened:props.isOpened};
        
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    
    render() {
        
        return <div className="b-main-menu-area" ref={this.setWrapperRef}>     
            <div className="b-main-menu-buttons">
                <div className="b-main-menu-button b-button"
                    title={this.props.labels['Show menu']}
                    onClick={()=>{this.toggleMainMenu()}} >
                </div>
                <div className='map-name'><div className='name-label'>{this.props.chronomapName}</div></div>
                { this.props.isMobile == 1 && 
                    <div className={'b-button '+ 'b-date-mode-button-chains'}
                        onClick={()=>{this.toggleDateMode()}} >
                    </div>
                }
            </div>
            
            { this.state.isMainMenuDisplayed && 
                <MainMenu/>
            }
        </div>          
    }
    
    toggleMainMenu() {
         //this.setState({isMainMenuDisplayed: !this.state.isMainMenuDisplayed});
         if (!this.props.isPopupOpened || this.props.popupType != popup_types.MAIN_MENU) {
            this.props.showMenu();
         }
         else {
            this.props.hidePopup();
         }
    }
    
    toggleTwoLayers() {
      if (this.props.mapTypeId=='ROADMAP') {
        this.props.changeMapType('SATELLITE');
      }
      else {
        this.props.changeMapType('ROADMAP');
        this.props.showMessage(this.props.labels["Modern map layer enabled"]);
      }
    }
    
    toggleEditMode() {
        if(this.props.editMode) {
            this.props.disableEditMode();
        }
        else {
            if(this.props.isMobile) {
                this.props.showNoEditMessage();
            }
            else {
                this.props.enableEditMode();
            }              
        }
    }
    
     toggleDateMode() {
        if(this.props.indexMode == 'chains') {
            this.props.setIndexMode('dates');
        }
        else {
            this.props.setIndexMode('chains'); 
        }
    }
    
    canFullScreen() {
        var elems = document.getElementsByClassName("b-page-content");
        if(!elems || !elems[0]) {
            return false;
        }
        var elem = elems[0];
        return elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen;
    }
    
    toggleFullScreen() {
        var elems = document.getElementsByClassName("b-page-content");
        var elem = elems[0];
        if(!this.state.fullScreenEnabled) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
             this.setState({fullScreenEnabled: true});
             this.props.zoomMinus();
             //this.props.fullScreen();
        }
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
            this.setState({fullScreenEnabled: false});
            this.props.zoomPlus();
        }
    }
    
  
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if(this.state.isOpened) {
        return;
    }
  
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({isMainMenuDisplayed: false});
    }
  }

}      
           

export default connect(
    (state, ownProps) => ({
        labels: state.labels,
        editMode: state.editMode,
        indexMode: state.indexMode,
        isMobile: state.isMobile,
        zoomButtons: ownProps.zoomButtons,
        isPopupOpened: state.isPopupOpened,
        popupType:  state.popupType,
        mapTypeId: state.mapTypeId,
        chronomapName: state.time && state.time.getTimeObjectById('MAIN') ? state.time.getTimeObjectById('MAIN').getField('name') : '',
      
    }),
    (dispatch, ownProps) => {
        return {
            enableEditMode: () => {
                dispatch(enableEditMode())
            },
            disableEditMode: () => {
                dispatch(disableEditMode())
            },
            setIndexMode: (indexMode) => {
                dispatch(setIndexMode(indexMode))
            },
            showMenu: () => {
                dispatch(showPopup(popup_types.MAIN_MENU))
            },
            showNoEditMessage: () => {
                dispatch(showPopup(popup_types.MESSAGE, {message: "Sorry, you can edit map only in desktop version"}))
            },
            hidePopup: () => {
                dispatch(hidePopup());
            },
            changeMapType: (mapTypeId) => {
                dispatch(changeMapType(mapTypeId));
            },
            zoomPlus: () => {
                dispatch(zoomPlus(0.3));
            },
            zoomMinus: () => {
                dispatch(zoomMinus(0.3));
            },
            showMessage: (message) => {
                dispatch(showMessage(message));
            },
            showCommentPopup: () => {
                dispatch(showPopup(popup_types.COMMENT, {}))
            },
            
        }
    }
)(MainMenuArea);


