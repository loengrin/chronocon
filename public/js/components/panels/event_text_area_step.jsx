var React = require('react');
import { connect } from 'react-redux'
import { rewindToEvent} from '../../actions/actions'
import { DateFormatter } from '../../libs/date_formatter';

class StepBlock extends React.Component {
    render() {
         var formatter = new DateFormatter(this.props.labels, this.props.lang, this.props.time.getCalendar().getMode());
         var dateLabel = formatter.getDateLabel(this.props.time.getCalendar().getDateByStep(this.props.currentStep));
    
        var events = this.props.time.getIndexStore().getEventsByStep(this.props.currentStep);
        var eventBlocks = [];
        for(let i=0;i<events.length; i++){
            let event = events[i];
           
            eventBlocks.push(
                <span className="b-textpanel-article__li"
                   onClick={()=>this.props.rewindToEvent(event, null)}
                   key = {i}>
                   {(i+1)+". "}{event.getField('name')}  
                   
                   
                </span>);
        }
        return <div className="b-textpanel-article-content">
            {eventBlocks}
        </div>
    }
}
export default connect((state, ownProps) => {
        return {
            currentStep: state.currentStep,
            time: state.time,
            labels: state.labels,
        }},
    (dispatch, ownProps) => {
        return {
            rewindToEvent: (event, chainId) => {
                dispatch(rewindToEvent(event, chainId))
            },
        }
    }
)(StepBlock);


