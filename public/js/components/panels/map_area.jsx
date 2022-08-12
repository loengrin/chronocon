var React = require('react');
import { connect } from 'react-redux'
import { enableEditMode, disableEditMode, showPopup, zoomPlus, zoomMinus, setIndexMode, showPospup, hidePopup, changeMapType,showMessage } from '../../actions/actions'
import * as popup_types from '../../actions/popup_types';

import MapSearch from '../panels/map_search.jsx';
import DateNavigationButtons from '../panels/date_navigation_panel.jsx';
import MapZoomBlock from '../panels/map_zoom_panel.jsx';

import UnitTip from '../panels/unit_tip.jsx';
import UnitMenu from '../panels/unit_menu.jsx';

var $ = require("jquery");


/**
  Main component container for map page
*/
class MapArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {fullScreenEnabled: false};
     
    }

    render(){
        return <div className={"b-map-frame "}>
                
                { this.props.message && !this.props.isLoading &&
                    <div className="b-message">
                        {this.props.message}
                    </div>
                }
                { this.props.message && this.props.isLoading &&
                    <div>
                        <div className="b-loader-outer"><div></div></div>
                        <div className="b-loader-inner"><div>{this.props.message}</div></div>
                    </div>
                }
               <div className="b-search-area">
                    <MapSearch />
                </div>
                <div className="b-unit-tip_area">
                    <UnitTip />
                </div>
                <div className="b-unit-menu-area">
                    <UnitMenu />
                </div>
                <div className="b-map-frame-inner">
                    <div className={"b-map "+(this.props.mobileEmulate ? 'b-map-mobile-emulate' : '')}></div>
                </div>
                <DateNavigationButtons />
                <MapZoomBlock />
                {!this.props.isXXage &&
                <button className='b-message-button b-button'
                        title={this.props.labels['Message']}
                        onClick={()=>{this.props.showCommentPopup()}} >
                </button>
                }
                { this.canFullScreen() && 
                    <button className={this.state.fullScreenEnabled ? 'b-full-screen-exit-button b-button' : 'b-full-screen-button b-button'}
                        title={this.state.fullScreenEnabled ? this.props.labels['Exit full screen'] : this.props.labels['Full screen']}
                        onClick={()=>{this.toggleFullScreen()}} >
                    </button>
                }
                { this.props.time.getTimeObjectById('MAIN') && this.props.time.getTimeObjectById('MAIN').getField('mapType') != 'FILE' &&
                    <button className={this.props.mapTypeId=='ROADMAP' ? 'b-two-layers-exit-button b-button' : 'b-two-layers-button b-button'}
                        title={this.props.mapTypeId=='ROADMAP' ? this.props.labels['Hide modern map'] : this.props.labels['Show modern map']}
                        onClick={()=>{this.toggleTwoLayers()}} >
                    </button>
                }
                { !this.props.isMobile && !this.props.isXXage &&
                    <button className={this.props.editMode ? 'b-edit-mode-exit-button b-button' : 'b-edit-mode-button b-button'}
                        title={this.props.editMode ? this.props.labels['View mode'] : this.props.labels['Edit mode']}
                        onClick={()=>{this.toggleEditMode()}} >
                    </button>
                }
                
            </div>
            
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
    
   

}

export default connect((state, ownProps) => ({
        labels: state.labels,
        chronomapName: state.time.getTimeObjectById('MAIN') ? state.time.getTimeObjectById('MAIN').getField('name') : '',
        lang: state.lang,
        currentStep: state.currentStep,
        currentEvent: state.currentEvent,
        currentChain: state.currentChain,
        playToEventInProcess: state.playToEventInProcess,
        screenZoom: state.screenZoom,
        mobileEmulate: state.mapSettings.mobileEmulate,
        editMode: state.editMode,
        indexMode: state.indexMode,
        mapLoaded:  state.mapLoaded,
        message: state.message,
        isLoading: state.isLoading,
        time: state.time,
        url: state.url,
        isMobile: state.isMobile,
        isXXage: state.isXXage,
        isPopupOpened: state.isPopupOpened,
        bigImageOpened: state.bigImageOpened,
        mapTypeId: state.mapTypeId,
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
)(MapArea);


