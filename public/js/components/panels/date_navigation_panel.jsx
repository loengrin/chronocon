var React = require('react');
import { connect } from 'react-redux'
import { rewind } from '../../actions/actions'
import { DateFormatter } from '../../libs/date_formatter';

/**
  Component for navidation buttons in the left bottom corner of map page.
*/
class DateNavigationButtons extends React.Component {

    render(){
        //return false;
        if(!this.props.mapLoaded){
            return false;
        }
        var formatter = new DateFormatter(this.props.labels, this.props.lang, this.props.time.getCalendar().getMode());
 
        var dateLabel = formatter.getDateLabel(
                this.props.time.getCalendar().getDateByStep(this.props.step));

        return <div className="b-date-navigation">
            <div className="date">{ dateLabel }</div>   
          </div>
    }
    previousStep(){
        this.props.rewind(this.props.step <= 0 ? 0: this.props.step-1);
    }
    nextStep(){
        this.props.rewind(this.props.step >= this.props.time.getCountSteps()-1 ?
            this.props.time.getCountSteps()-1: this.props.step+1);
    }
}

export default connect((state, ownProps) => ({
        time: state.time,
        step: state.currentStep,
        indexMode: state.indexMode,
        mapLoaded: state.mapLoaded,
        labels: state.labels,
        lang: state.lang,
    }),
    (dispatch, ownProps) => {
        return {
            rewind: (step) => {
                dispatch(rewind(step));
            },

        }
    }
)(DateNavigationButtons);




