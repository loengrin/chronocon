var React = require('react');
import { connect } from 'react-redux'
import {rewindToEvent, playToEvent, rewind, showList, showChain, setIndexMode} from '../../actions/actions'
import { DateFormatter } from '../../libs/date_formatter';

/**
Component for event navigation buttons which located below text of current event
*/
class EventTextAreaButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){
     
        var that = this;
        
        if(props.chainId && props.event && props.mapLoaded) {
            var indexStore = props.time.getIndexStore();
            that.setState({
                countInChain:  indexStore.getEventsOfChain(props.chainId).length,
                currentNumber: indexStore.getEventPosition(props.event.getId(), props.chainId),
            });       
        }
    
    }
    
    render(){
        console.log(this.props);
        if(!this.props.mapLoaded){
            return false;
        } 
        
        var buttons = [];
        if(!this.props.listShowed) {
            buttons = this.getButtons();
        }
     
        return <div>
            {!this.props.isMobile && false &&
                <div className="index-mode-select" >
                    <span className='index-mode-select-inner'  onClick={()=>this.props.setIndexMode(this.props.indexMode == 'dates' ? 'chains' : 'dates')}
                        title={this.props.indexMode == 'dates' ? this.props.labels['Enable navigation by stories'] : this.props.labels['Enable navigation by dates']}>
                        {this.props.indexMode == 'dates' ? this.props.labels['By dates'] : this.props.labels['By stories']}
                    </span>
                </div>
            } 
            {!this.props.isMobile && !this.props.listShowed && 
            <div className="index-mode-select" >
                <span className='index-mode-select-inner'  onClick={()=>this.props.showList()}
                    title={this.props.labels['Contents']}>
                    {this.props.labels['Contents']}
                </span>
            </div>
            }
            {this.props.listShowed && 
            <div className={this.props.indexMode == 'dates' ? 'index-mode-tabs-d' : 'index-mode-tabs-c'}>
                <span className={this.props.indexMode == 'chains' ? 'index-mode-tab-active' : 'index-mode-tab'} onClick={()=>this.props.setIndexMode('chains')}
                    title={this.props.labels['By stories']}>
                    {this.props.labels['By stories']}
                </span>
                <span className={this.props.indexMode == 'dates' ? 'index-mode-tab-active' : 'index-mode-tab'} onClick={()=>this.props.setIndexMode('dates')}
                    title={this.props.labels['By dates']}>
                    {this.props.labels['By dates']}
                </span>
            </div>
            }
            {buttons}
         </div>;

    }
    
    getButtons() {
        var buttons = [];
        var formatter = new DateFormatter(this.props.labels, this.props.lang, this.props.time.getCalendar().getMode());
        var allChains = this.props.time.getIndexStore().getAllChains();
         
        if(this.props.indexMode == 'chains' && this.props.hasChainsMode && false) {
            buttons.push(<EventTextAreaButton key="cl"
                    fixedButton = {true}
                    middleLabel = {{label: allChains[this.props.currentChain] ? allChains[this.props.currentChain].name : ''}}
                    goToList = {()=>{this.props.showList()}}
                    middleTitle ={this.props.labels['List of stories']}
                />);
        }
        
        if((this.props.indexMode == 'chains') && this.props.event) {
            
            var label = (allChains[this.props.currentChain] ? allChains[this.props.currentChain].name : '')+' ';
                     //+this.props.labels['Event']
            
            var counter = this.props.time.getIndexStore().getEventPosition(this.props.currentEvent.getId(), this.props.currentChain)
                    +"/"+this.props.time.getIndexStore().getEventsOfChain(this.props.currentChain).length;
             buttons.push(<EventTextAreaButton key="ce"
                    displayBackButton = {!this.props.time.getIndexStore().isFirst(this.props.event.getId(), this.props.chainId, this.props.indexMode )}
                    displayForwardButton = {!this.props.time.getIndexStore().isLast(this.props.event.getId(), this.props.chainId, this.props.indexMode)}
                    middleLabel = {{label: label, counter: counter}}
                    goToPrevious = {()=>{     
                        var newEventAndChain =  this.props.time.getIndexStore().getPrevious(this.props.indexMode , this.props.event, this.props.chainId);
                        this.props.rewindToEvent(newEventAndChain.event, newEventAndChain.chainId);
                     }}
                    goToNext = {()=>{this.nextEventInChainsMode()}}
                    goToList = {()=>{this.props.showChain(this.props.chainId)}}
                    middleTitle ={this.props.labels['List of story events']}
                    prevTitle ={this.props.labels['Previous event']}
                    nextTitle ={this.props.labels['Next event']}
                />);
        }
        //this.props.showList()
        if(this.props.indexMode == 'dates'  && !this.props.event ) {
            buttons.push(<EventTextAreaButton key="dl"
                    displayBackButton = {this.props.currentStep > 0}
                    displayForwardButton = {this.props.currentStep < this.props.time.getCountSteps()-1}
                    middleLabel = {{label: this.props.currentDate ? formatter.getDateLabel(this.props.currentDate): ''}}
                    goToPrevious = {()=>{ this.props.rewind(this.props.currentStep <= 0 ? 0: this.props.currentStep-1,'prev'); }}
                    goToNext = {()=>{  
                        this.props.rewind(this.props.currentStep >= this.props.time.getCountSteps()-1 ?
                            this.props.time.getCountSteps()-1: this.props.currentStep+1,'next');
                    }}
                    goToList = {()=>{}}
                    middleTitle ={this.props.labels['List of dates']}
                    prevTitle ={this.props.labels['Previous date']}
                    nextTitle ={this.props.labels['Next date']}
                />);
        }
        
        if(this.props.indexMode == 'dates' && this.props.event) {
            var label = (this.props.currentDate ? formatter.getDateLabel(this.props.currentDate): '')+' ';
            //this.props.labels['Event']
            var counter = this.props.time.getIndexStore().getEventPositionOfStep(this.props.currentEvent.getId(), this.props.currentStep)
                    +"/"+this.props.time.getIndexStore().getCountEventsOfStep( this.props.currentStep)
        
            buttons.push(<EventTextAreaButton key="de"
                    displayBackButton = {!this.props.time.getIndexStore().isFirst(this.props.event.getId(), null, this.props.indexMode )}
                    displayForwardButton = {!this.props.time.getIndexStore().isLast(this.props.event.getId(), null, this.props.indexMode)}
                    middleLabel = {{label: label, counter: counter}}
                    goToPrevious = {()=>{     
                        var newEventAndChain = this.props.time.getIndexStore().getPrevious(this.props.indexMode , this.props.event);
                        this.props.rewindToEvent(newEventAndChain.event,null);
                    }}
                    goToNext = {()=>{
                        var newEventAndChain = this.props.time.getIndexStore().getNext(this.props.indexMode , this.props.event);
                        this.props.rewindToEvent(newEventAndChain.event,null);
                    
                    }}
                    goToList = {()=>{this.props.rewind(this.props.currentStep,'up')}}
                    middleTitle ={this.props.labels['List of date events']}
                    prevTitle ={this.props.labels['Previous event']}
                    nextTitle ={this.props.labels['Next event']}
                />);
        }
        return buttons;
    }
    
    nextEventInChainsMode(){
        var newEventAndChain = this.props.time.getIndexStore().getNext(this.props.indexMode , this.props.event, this.props.chainId);
        var animation = this.props.time.getTimeObjectById('MAIN').getField('animation');
        if(animation && !newEventAndChain.event.getField('disableAnimation')) {
            this.props.playToEvent(newEventAndChain.event, newEventAndChain.chainId);
        }
        else {
            this.props.rewindToEvent(newEventAndChain.event, newEventAndChain.chainId);
        }   
    }
    
    goToEventList(){
        if(this.props.indexMode=='chains') {
            this.props.showChain(this.props.chainId);
        } 
        else {
            this.props.rewind(this.props.currentStep,'up');
        }
    }
    
    displayBackButton() {
        var indexStore = this.props.time.getIndexStore();
        if(this.props.listShowed){
            return false;
        }
        if(this.props.indexMode == 'dates') {
            return this.props.currentStep > 0;
        }
        if(this.props.indexMode == 'chains' && this.props.currentEvent) {
          return this.props.event && !indexStore.isFirst(this.props.event.getId(), this.props.chainId, this.props.indexMode )
        }
        return false;
    }
    
    displayForwardButton() {
        var indexStore = this.props.time.getIndexStore();
        if(this.props.listShowed){
            return false;
        }
        if(this.props.indexMode == 'dates') {
            return this.props.currentStep < this.props.time.getCountSteps()-1;
        }
        if(this.props.indexMode == 'chains' && this.props.currentEvent) {
          return this.props.event && !indexStore.isLast(this.props.event.getId(), this.props.chainId, this.props.indexMode )
        }
        return false;
    }
    
    displayUpLabel() {
        return this.props.currentEvent != null && !this.props.listShowed;
                //|| this.props.indexMode == 'dates' && !this.props.listShowed;
    }
    
    getUpLabel() {
        var formatter = new DateFormatter(this.props.labels, this.props.lang, this.props.time.getCalendar().getMode());
        
        if(this.props.currentEvent && this.props.indexMode == 'dates') {
              return formatter.getDateLabel(this.props.currentDate);          
        }
        if(this.props.currentEvent && this.props.indexMode == 'chains') {
            var allChains = this.props.time.getIndexStore().getAllChains();
            return allChains[this.props.currentChain].name;         
        }       
    }
    
    displayUpButton() {
       return this.props.indexMode != null;
    }
    
    getMiddleLabel() {
        var formatter = new DateFormatter(this.props.labels, this.props.lang, this.props.time.getCalendar().getMode());
        var indexStore = this.props.time.getIndexStore();
       
        if(this.props.indexMode == 'dates' && !this.props.currentEvent) {
            var dateLabel = this.props.currentDate ? formatter.getDateLabel(this.props.currentDate): '';
            return {label: dateLabel, counter: ''};
        }
        if(this.props.indexMode == 'dates' && this.props.currentEvent) {
            return {
                label: this.props.labels['Event'],
                counter: indexStore.getEventPositionOfStep(this.props.currentEvent.getId(), this.props.currentStep)
                    +"/"+indexStore.getCountEventsOfStep( this.props.currentStep)
            };
        }
        if(this.props.indexMode == 'chains' && this.props.currentEvent) {
            return {
                label: this.props.labels['Event'],
                counter: indexStore.getEventPosition(this.props.currentEvent.getId(), this.props.currentChain)
                    +"/"+indexStore.getEventsOfChain(this.props.currentChain).length
  
            };
         }     
    }
    
    
    
    previousEvent(){
        if(this.props.indexMode == 'dates') {
            if(this.props.currentEvent) {
                var newEventAndChain = this.props.time.getIndexStore().getPrevious(this.props.indexMode , this.props.event);
                this.props.rewindToEvent(newEventAndChain.event,null);
            }
            else {
                this.props.rewind(this.props.currentStep <= 0 ? 0: this.props.currentStep-1,'prev');
            }
        }        
        else {
            var newEventAndChain =  this.props.time.getIndexStore().getPrevious(this.props.indexMode , this.props.event, this.props.chainId);
            this.props.rewindToEvent(newEventAndChain.event, newEventAndChain.chainId);
        }
    }
    nextEvent(){
        if(this.props.indexMode == 'dates') {
            if(this.props.currentEvent) {
                var newEventAndChain = this.props.time.getIndexStore().getNext(this.props.indexMode , this.props.event);
                this.props.rewindToEvent(newEventAndChain.event,null);
            }
            else {
                this.props.rewind(this.props.currentStep >= this.props.time.getCountSteps()-1 ?
                    this.props.time.getCountSteps()-1: this.props.currentStep+1,'next');
            }
        }
        else {
            var newEventAndChain = this.props.time.getIndexStore().getNext(this.props.indexMode , this.props.event, this.props.chainId);
            var animation = this.props.time.getTimeObjectById('MAIN').getField('animation');
            if(animation && !newEventAndChain.event.getField('disableAnimation')) {
                this.props.playToEvent(newEventAndChain.event, newEventAndChain.chainId);
            }
            else {
                this.props.rewindToEvent(newEventAndChain.event, newEventAndChain.chainId);
            }
        }
    }
    
    goUp(){
        if(this.props.listShowed) {
            this.props.setIndexMode(null)
        }
        else if(!this.props.event) {
            this.props.showList();
        }
        else if(this.props.indexMode=='chains') {
            this.props.showChain(this.props.chainId)
        } 
        else {
            this.props.rewind(this.props.currentStep,'up')
        }
    }
}


class EventTextAreaButton extends React.Component {
     render(){
      
        var elems = [];
        if(!this.props.displayBackButton && this.props.displayForwardButton || this.props.fixedButton){
            elems.push(<div key="left-e" className="left-button-es" ></div>)
        }
        if(this.props.displayBackButton){
            elems.push(<div className="left-button b-button"
                                 title={this.props.prevTitle}
                                 onClick={()=>this.props.goToPrevious()}
                                 key="back">   
                </div>
            )
            elems.push(<div  key="left-e2" className="left-button-e" ></div>)
        }
        
        if(this.props.displayBackButton || this.props.displayForwardButton || this.props.fixedButton){
            var labelArr = this.props.middleLabel;
            elems.push(<div key="back-e2" className="middle-block">
                    <div className="middle-label" onClick={()=>this.props.goToList()} title={this.props.middleTitle} >
                        {labelArr.label}
                        { labelArr.counter && 
                        <span className="label-counter">&nbsp;{labelArr.counter}</span>
                        }
                    </div>
                </div>)
        }
        if(this.props.displayForwardButton){
            elems.push(<div  key="forward-e" className="right-button-e" ></div>)
            elems.push(<div className="right-button b-button"
                                 onClick={()=>this.props.goToNext()}
                                 title={this.props.nextTitle}
                                 key="forward">   
                </div>
            )
        }
        if(!this.props.displayForwardButton && this.props.displayBackButton || this.props.fixedButton){
            elems.push(<div  key="forward-e2" className="right-button-es" ></div>)
        }

        return <div className='textarea-button'>
                {elems}
        </div>;
    }
}



export default connect((state, ownProps) => {
        return {
            event: state.currentEvent,
            chainId: state.currentChain,
            currentDate: state.currentDate,
            currentEvent: state.currentEvent,
            currentChain: state.currentChain,
            currentStep: state.currentStep,
            indexMode: state.indexMode,
            listShowed: state.listShowed,
            labels: state.labels,
            time: state.time,
            isMobile: state.isMobile,
            mapLoaded: state.mapLoaded,
            hasChainsMode:  state.time.getIndexStore().hasChainsMode()
        }},
    (dispatch, ownProps) => {
        return {
            rewindToEvent: (event, chainId) => {
                dispatch(rewindToEvent(event, chainId))
            },
            rewind: (step, source) => {
                dispatch(rewind(step, source))
            },
            showChain: (chainId) => {
                dispatch(showChain(chainId))
            },
            showList: () => {
               dispatch(showList())
            },
            setIndexMode: (indexMode) => {
                dispatch(setIndexMode(indexMode))
            },
            playToEvent: (event, chainId) => {
                dispatch(playToEvent(event, chainId))
            },
        }
    }
)(EventTextAreaButtons);

