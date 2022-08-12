var React = require('react');
import { connect } from 'react-redux'
import { rewind, setIndexMode, rewindToEvent, playToEvent } from '../../actions/actions'
import { DateFormatter } from '../../libs/date_formatter';

/**
  Component for navidation buttons in the left bottom corner of map page.
*/
class NavigationPanel extends React.Component {

    render(){
        if(!this.props.mapLoaded){
            return false;
        }
        var formatter = new DateFormatter(this.props.labels, this.props.lang, this.props.time.getCalendar().getMode());
 
        var dateLabel = formatter.getDateLabel(
                this.props.time.getCalendar().getDateByStep(this.props.currentStep));
        var datesClass  = this.props.indexMode == 'dates' && !this.props.editMode ? 'active-index-mode' : '';
        var chainsClass = this.props.indexMode == 'chains' && !this.props.editMode ? 'active-index-mode' : '';
        var indexStore = this.props.time.getIndexStore();
        var allChains = this.props.time.getIndexStore().getAllChains();
        
        
        return <div className="navigation_panel_new">
           
            { this.props.indexMode == 'dates' &&
                <div className="date">
                    <span onClick={() => this.previousStep()}
                            style={{visibility:(this.props.currentStep == 0 ? 'hidden' : 'visible')}}>
                                {"<--"}
                    </span>
                    { dateLabel }
                    <span onClick={() => this.nextStep()}
                            style={{visibility:(this.props.currentStep == this.props.time.getCountSteps()-1 ? 'hidden' : 'visible')}}>
                    {"-->"}
                    </span>
                </div>
            }
            { this.props.currentEvent && this.props.indexMode == 'dates' &&
            <div className="date">
                <span onClick={() => this.previousEvent()}
                        style={{visibility:(!this.displayBackButton() ? 'hidden' : 'visible')}}>
                            {"<--"}
                </span>
                { this.props.labels['Event']} {indexStore.getEventPositionOfStep(this.props.currentEvent.getId(), this.props.currentStep)} of  {indexStore.getCountEventsOfStep( this.props.currentStep) }
                <span onClick={() => this.nextEvent()}
                        style={{visibility:(!this.displayForwardButton()  ? 'hidden' : 'visible')}}>
                {"-->"}
                </span>
            </div>  
            }
           
            { this.props.indexMode == 'chains' && this.props.currentChain &&
                 <div className="date">{allChains[this.props.currentChain].name}</div>   
            }
            
            { this.props.currentEvent && this.props.indexMode == 'chains' &&
            <div className="date">
                <span onClick={() => this.previousEvent()}
                        style={{visibility:(!this.displayBackButton() ? 'hidden' : 'visible')}}>
                            {"<--"}
                </span>
                { this.props.labels['Event']} {indexStore.getEventPosition(this.props.currentEvent.getId(), this.props.currentChain)} of  {indexStore.getEventsOfChain(this.props.currentChain).length }
                <span onClick={() => this.nextEvent()}
                        style={{visibility:(!this.displayForwardButton()  ? 'hidden' : 'visible')}}>
                {"-->"}
                </span>
            </div>  
            }
       
            
        </div>
    }
    previousStep(){
        this.props.rewind(this.props.currentStep <= 0 ? 0: this.props.currentStep-1);
    }
    
    nextStep(){
        this.props.rewind(this.props.currentStep >= this.props.time.getCountSteps()-1 ?
            this.props.time.getCountSteps()-1: this.props.currentStep+1);
    }
    
    indexByStories(){
        this.props.setIndexMode('chains');
    }

    indexByDates(){
        this.props.setIndexMode('dates');
    }
    
    previousEvent(){
        if(this.props.indexMode == 'dates') {
            if(this.props.currentEvent) {
                var newEventAndChain = this.props.time.getIndexStore().getPrevious(this.props.indexMode , this.props.currentEvent);
                this.props.rewindToEvent(newEventAndChain.event,null);
            }
            else {
                this.props.rewind(this.props.currentStep <= 0 ? 0: this.props.currentStep-1);
            }
        }        
        else {
            var newEventAndChain =  this.props.time.getIndexStore().getPrevious(this.props.indexMode , this.props.currentEvent, this.props.currentChain);
            this.props.rewindToEvent(newEventAndChain.event, newEventAndChain.chainId);
        }
    }
    
    nextEvent(){
        if(this.props.indexMode == 'dates') {
            if(this.props.currentEvent) {
                var newEventAndChain = this.props.time.getIndexStore().getNext(this.props.indexMode , this.props.currentEvent);
                this.props.rewindToEvent(newEventAndChain.event,null);
            }
            else {
                this.props.rewind(this.props.currentStep >= this.props.time.getCountSteps()-1 ?
                    this.props.time.getCountSteps()-1: this.props.currentStep+1);
            }
        }
        else {
            var newEventAndChain = this.props.time.getIndexStore().getNext(this.props.indexMode , this.props.currentEvent, this.props.currentChain);
            var animation = this.props.time.getTimeObjectById('MAIN').getField('animation');
            if(animation && !newEventAndChain.event.getField('disableAnimation')) {
                this.props.playToEvent(newEventAndChain.event, newEventAndChain.chainId);
            }
            else {
                this.props.rewindToEvent(newEventAndChain.event, newEventAndChain.chainId);
            }
        }
    }
    
    displayBackButton() {
        var indexStore = this.props.time.getIndexStore();
        if(this.props.listShowed){
            return false;
        }
        if(this.props.indexMode == 'dates') {
            return !indexStore.isFirstOfStep(this.props.currentEvent.getId(), this.props.currentStep);
        }
        if(this.props.indexMode == 'chains' && this.props.currentEvent) {
          return this.props.currentEvent && !indexStore.isFirst(this.props.currentEvent.getId(), this.props.currentChain, this.props.indexMode )
        }
        return false;
    }
    
    displayForwardButton() {
        var indexStore = this.props.time.getIndexStore();
        if(this.props.listShowed){
            return false;
        }
        if(this.props.indexMode == 'dates') {
             return !indexStore.isLastOfStep(this.props.currentEvent.getId(), this.props.currentStep);
        }
        if(this.props.indexMode == 'chains' && this.props.currentEvent) {
          return this.props.currentEvent && !indexStore.isLast(this.props.currentEvent.getId(), this.props.currentChain, this.props.indexMode )
        }
        return false;
    }
    
    
}

export default connect((state, ownProps) => ({
        time: state.time,
        currentStep: state.currentStep,
        mapLoaded: state.mapLoaded,
        labels: state.labels,
        lang: state.lang,
        indexMode: state.indexMode,
        currentEvent: state.currentEvent,
        currentChain: state.currentChain,
    }),
    (dispatch, ownProps) => {
        return {
            rewind: (step) => {
                dispatch(rewind(step));
            },
            setIndexMode: (indexMode) => {
                dispatch(setIndexMode(indexMode))
            },
            rewindToEvent: (event, chainId) => {
                dispatch(rewindToEvent(event, chainId))
            },
            playToEvent: (event, chainId) => {
                dispatch(playToEvent(event, chainId))
            },

        }
    }
)(NavigationPanel);




