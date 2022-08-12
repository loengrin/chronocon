var React = require('react');
var $ = require("jquery");
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux'
import * as popup_types from '../../actions/popup_types';
import { DateFormatter } from '../../libs/date_formatter';
import ChainsBlock from '../panels/event_text_area_chains.jsx';
import ChainBlock from '../panels/event_text_area_chain.jsx';
import StepBlock from '../panels/event_text_area_step.jsx';
import StepsBlock from '../panels/event_text_area_steps.jsx';
import EventBlock from '../panels/event_text_area_event.jsx';
import IndexModeListBlock from '../panels/event_text_area_index_mode.jsx';
import { showPopup } from '../../actions/actions'

/**
  Component for current eevnt text block on the left top part of map page
*/
class EventTextArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    
    
    render(){
        if(!this.props.mapLoaded){
            return false;
        }
        var formatter = new DateFormatter(this.props.labels, this.props.lang, this.props.time.getCalendar().getMode());
        var dateLabel = formatter.getDateLabel(this.props.currentDate);
    
        if (this.props.playToEventInProcess) {
            return  <div className="b-textpanel-article">
                <div className="b-textpanel-article-content">
                    <span className="b-textpanel-article__title">{this.props.labels['Loading...']}</span>
                </div>
            </div>
        }
        
        var mode;
        if(this.props.indexMode == null) {
            mode = 'navigation';
        } else if(this.props.currentEvent != null) {
            mode= 'event';
        } else if(this.props.indexMode == 'chains') {
            mode = this.props.listShowed ? 'chains' : 'chain';
        } else if(this.props.indexMode == 'dates') {
            mode = this.props.listShowed ? 'steps' : 'step';
        } else {
            mode = 'navigation';
        }
        console.log(this.props, mode);
        


        return  <div style={{height: '100%' }} >
            <div className="b-textpanel-article">
                {this.props.editMode && 
                    <div className="b-header-container">
                        <span className="b-button b-events-list" onClick={()=>{this.props.showEventList() }}></span>
                        <span className="b-button b-event-add" onClick={()=>{ this.props.addEvent() }}></span>
                    </div>
                }
                
                {mode == 'navigation' &&
                    <IndexModeListBlock />
                }
                {mode == 'chains' &&
                    <ChainsBlock />
                }
                {mode == 'chain' &&
                    <ChainBlock currentChain={this.props.currentChain}/>
                }
                {mode == 'steps' &&
                    <StepsBlock/>
                }
                {mode == 'step' &&
                    <StepBlock/>
                }
                {mode == 'event' &&
                    <EventBlock />
                }
                
           
          </div>
      </div>;
    }

}



export default connect((state, ownProps) => {
        return {
            currentEvent: state.currentEvent,
            currentStep: state.currentStep,
            currentDate: state.currentDate,
            currentChain: state.currentChain,
            listShowed: state.listShowed,
            mapLoaded: state.mapLoaded,
            editMode: state.editMode,
            indexMode: state.indexMode,
            labels: state.labels,
            lang: state.lang,
            isMobile: state.isMobile,
            time: state.time
           
        }},
    (dispatch, ownProps) => {
        return {
            showEventList: () => {
                dispatch(showPopup(popup_types.EVENT_LIST))
            },
            addEvent: () => {
                dispatch(showPopup(popup_types.EDIT_EVENT, {event: null, isNew: true}));
            },
        }
    }
)(EventTextArea);


