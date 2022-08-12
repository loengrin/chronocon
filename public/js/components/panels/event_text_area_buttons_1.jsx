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
        if(!this.props.mapLoaded){
            return false;
        } 
       
        var formatter = new DateFormatter(this.props.labels, this.props.lang, this.props.time.getCalendar().getMode());
        var dateLabel = this.props.currentDate ? formatter.getDateLabel(this.props.currentDate): '';
       
        var buttons = [];
        if(this.displayBackButton()){
            buttons.push(<button className="textpanel-button-back b-button"
                                 onClick={this.previousEvent.bind(this)}
                                 key="back">   
                </button>
            )
        }
        
        if(this.displayUpButton()){
            buttons.push(<button className="textpanel-button-index b-button"
                                 onClick={()=>this.goUp()}
                                 key="up">
                        </button>
            )
        }
        

        if(this.displayForwardButton()){
            buttons.push(<button className="textpanel-button-forward b-button"
                                 onClick={this.nextEvent.bind(this)}
                                 key="forward">   
                </button>
            )
        }

        return <div>
            {buttons}
        </div>;
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
        console.log(this.props.indexMode, this.props.listShowed, this.props.currentEvent, this.props.indexMode == 'dates' && !this.props.currentEvent,this.props.indexMode == 'chains' && this.props.currentEvent );
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
    
     displayUpButton() {
       return this.props.indexMode != null;
    }
    
    
    
    previousEvent(){
        if(this.props.indexMode == 'dates') {
            if(this.props.currentEvent) {
                var newEventAndChain = this.props.time.getIndexStore().getPrevious(this.props.indexMode , this.props.event);
                this.props.rewindToEvent(newEventAndChain.event,null);
            }
            else {
                this.props.rewind(this.props.currentStep <= 0 ? 0: this.props.currentStep-1);
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
                    this.props.time.getCountSteps()-1: this.props.currentStep+1);
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
    console.log(this.props);
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
            this.props.rewind(this.props.currentStep)
        }
    }
}

export default connect((state, ownProps) => {
        return {
            event: state.currentEvent,
            chainId: state.currentChain,
            currentDate: state.currentDate,
            currentEvent: state.currentEvent,
            currentStep: state.currentStep,
            indexMode: state.indexMode,
            listShowed: state.listShowed,
            labels: state.labels,
            time: state.time,
            mapLoaded: state.mapLoaded,
            hasChainsMode:  state.time.getIndexStore().hasChainsMode()
        }},
    (dispatch, ownProps) => {
        return {
            rewindToEvent: (event, chainId) => {
                dispatch(rewindToEvent(event, chainId))
            },
            rewind: (step) => {
                dispatch(rewind(step))
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

