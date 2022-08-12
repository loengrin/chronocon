var React = require('react');
import { connect } from 'react-redux'
import { rewindToEvent} from '../../actions/actions'
import { DateFormatter } from '../../libs/date_formatter';

class ChainBlock extends React.Component {
    render() {
        var events = this.props.time.getIndexStore().getEventsOfChain(this.props.currentChain)
        var eventBlocks = [];
        var formatter = new DateFormatter(this.props.labels, this.props.lang, this.props.time.getCalendar().getMode());
        var allChains = this.props.time.getIndexStore().getAllChains();
        for(let i=0;i<events.length; i++){
            let event = events[i];
            var dateLabel = formatter.getDateLabel(event.getDateBegin());
    
            eventBlocks.push(
                <span className="b-textpanel-article__li"
                   onClick={()=>this.props.rewindToEvent(event, this.props.currentChain)}
                   key = {i}>
                   {(i+1)+". "}{event.getField('name')}  
                   <br />
                   <span className="b-textpanel-date-label">({dateLabel})</span>
                </span>);
        }
        return <div className="b-textpanel-article-content">
            {eventBlocks}
        </div>
    }
}

export default connect((state, ownProps) => {
        return {
            currentChain: ownProps.currentChain,
            time: state.time,
            labels: state.labels,
            hasChainsMode:  state.time.getIndexStore().hasChainsMode()
        }},
    (dispatch, ownProps) => {
        return {
            rewindToEvent: (event, chainId) => {
                dispatch(rewindToEvent(event, chainId))
            },
        }
    }
)(ChainBlock);


