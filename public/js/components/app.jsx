var React = require('react');
import { connect } from 'react-redux'

import PopupArea from './panels/popup_area.jsx';
import Timeline from './panels/timeline.jsx';
import EditModePanel from './panels/edit_mode_panel.jsx';
import EventTextArea from './panels/event_text_area.jsx';
import EventTextAreaButtons from './panels/event_text_area_buttons.jsx';
import EventIndex from './panels/event_index.jsx';
import UnitMenu from './panels/unit_menu.jsx';
import MapSearch from './panels/map_search.jsx';
import DateNavigationButtons from './panels/date_navigation_panel.jsx';
import MapSettingsMenuArea from './panels/map_settings_menu.jsx';
import MainMenuArea from './panels/main_menu_area.jsx';
import UserMenu from './panels/user_menu.jsx';
import UnitTip from './panels/unit_tip.jsx';
import BigImageArea from './panels/big_image_area.jsx';
import MapArea from './panels/map_area.jsx';
import NavigationPanel from './panels/navigation_panel.jsx';
var $ = require("jquery");


/**
  Main component container for map page
*/
class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        this.setPageUrl();
        var indexStore = this.props.time.getIndexStore();
        var textPanelClassAdd = '';
         if(this.props.indexMode == 'dates' && !this.props.currentEvent) {
            textPanelClassAdd = 'block-scroll-wood-big';
        }
        if(this.props.listShowed) {
            textPanelClassAdd = 'block-scroll-wood-max';
        }
        if(!indexStore.hasChainsMode() && this.props.indexMode == 'chains') {
            textPanelClassAdd = this.props.currentEvent ? 'block-scroll-wood-big' : 'block-scroll-wood-max';
        }
       
        
        return <div className="content" style={{'fontSize': this.props.screenZoom + "em"}}>
            <MapArea />
            <PopupArea/>
            { !this.props.isMobile && 
                <div className={"b-timeline "+(this.props.editMode ? "b-timeline_exp" : "")} style={{'visibility': this.props.indexMode == 'dates' ? 'visible' : 'hidden'}}>
                    <Timeline/>  
                </div>
            }
            { this.props.editMode &&
                        <div className="b-timeline-buttons">
                            <EditModePanel />
                        </div>
             }
            <MainMenuArea/>

            <div className="textpanel-article">
                <div className="textpanel-wrapper">
                     
                    <div className="textpanel-buttons-new" style={{'display':'block'}}>
                        <EventTextAreaButtons indexMode={'dates'}/>
                    </div>
                    
                    <div className={'block-scroll-wood '+textPanelClassAdd}>
                            <EventTextArea
                                currentEvent={this.props.currentEvent}
                                playToEventInProcess={this.props.playToEventInProcess}
                                editMode={false}
                            />
                    </div>
                    {this.props.isMobile != 0 && false &&
                    <div className="textpanel-buttons-new" style={{'display':'block'}}>
                        <EventTextAreaButtons indexMode={'dates'}/>
                    </div>
                    }
              
                </div>
            </div>
        
            
        </div>
    }

    componentDidMount(){
        this.setAlertBeforeCloseWindow();
    }

    setAlertBeforeCloseWindow() {
        var that = this;
        $(window).bind('beforeunload', function () {
            var changedObjects = that.props.time.getChangedObjects();
            var newObjects = that.props.time.getNewObjects();
            var deletedObjects = that.props.time.getDeletedObjects();
            if (changedObjects.length || newObjects.length || deletedObjects.length) {
                return that.props.labels['You have unsaved changes.'];
            }
        });
    }

    setPageUrl(){
        history.replaceState({}, this.props.chronomapName, this.props.url);
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
        listShowed: state.listShowed,
        mapLoaded:  state.mapLoaded,
        message: state.message,
        time: state.time,
        url: state.url,
        isMobile: state.isMobile,
        isPopupOpened: state.isPopupOpened,
        bigImageOpened: state.bigImageOpened
    }),
    
)(App);


