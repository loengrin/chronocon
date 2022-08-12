var React = require('react');
import { connect } from 'react-redux'
import { rewind} from '../../actions/actions'
import { DateFormatter } from '../../libs/date_formatter';

class StepsBlock extends React.Component {
    render() {
        var index = this.props.time.getIndexStore().getIndexByDates(true);
        var dateBlocks = [];
        for(let step=0;step<index.length; step++){
             dateBlocks.push(
                     <span className="b-textpanel-article__chains" key = {step} onClick={()=>this.props.rewind(step)}>
                        {index[step].title} 
                        <span className="b-textpanel-date-label">{index[step].events && index[step].events.length ? "("+index[step].events.length+" "+this.props.labels['events']+")" : ""}</span>
                     </span>);                
        }
        
        return <div className="b-textpanel-article-content">
            {dateBlocks}
        </div>
    }
}

export default connect((state, ownProps) => {
        return {
            time: state.time,
            labels: state.labels,
        }},
    (dispatch, ownProps) => {
        return {
            rewind: (step) => {
                dispatch(rewind(step))
            },
        }
    }
)(StepsBlock);


