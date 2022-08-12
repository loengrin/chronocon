var React = require('react');
import { connect } from 'react-redux'
import { rewind, setIndexMode } from '../../actions/actions';
import { DateFormatter } from '../../libs/date_formatter';

/**
Component for line with dates under the map
*/
class Timeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {lineWidth:0, lineOffset:0, lineOffsetTop:0, 
            formatter: new DateFormatter(props.labels, props.lang, props.time.getCalendar().getMode())
        };
    }

    componentWillMount() {
        this.setStateByProps(this.props);
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    setStateByProps(props) {
      this.setState({
          labels:this.initTimeLabels(props.time),
          formatter: new DateFormatter(props.labels, props.lang, props.time.getCalendar().getMode())
      });
    }

    componentDidMount() {
        var that = this;
        that.updateBounds();
        window.addEventListener('resize', () => {
            that.updateBounds();
        })
    }

    updateBounds() {
        var bounds = this.refs.timeline.parentNode.getBoundingClientRect();
        this.setState({lineWidth:bounds.width, lineOffset: bounds.left, lineOffsetTop: bounds.top});
        this.setState({labels:this.initTimeLabels(this.props.time) });
    }


    render(){
        var labels = [];
        for(var i=0;i < this.state.labels.length; i++){
            var label = this.state.labels[i];

            if(label.left <= 0 ) {
                        //labels.push(<span key={'separator0'} className="b-timeline-line__separator" style={{left:0}}></span>);
            }

            labels.push(<span key={'label'+i} className="b-timeline-line__date"
                              style={{
                                  left:label.left,
                                  right: label.right,
                                  fontSize:Math.floor(this.state.lineWidth/100),
                                  width:(label.right- label.left),
                              }}>
                  {(label.right-label.left) < 20 ? "" : label.label}
                </span>
            );
            if(i != this.state.labels.length-1){
                labels.push(<span key={'separator'+(i+1)} className="b-timeline-line__separator" style={{left:label.right}}></span>);
            }
        }

        return <div ref="timeline">
            {this.state.tip &&
                <div className="b-timeline-tip"
                     style={{left: this.state.tip.left, right: this.state.tip.right}}>
                    {this.state.tip.label}
                </div>
            }
            <div className="b-timeline-line"
                 onClick={(e)=>{this.lineClick(e)}}
                 onMouseMove={(e)=>{this.lineMouseover(e)}}
                 onMouseLeave={(e)=>{this.setState({tip:null})}}>
                <div className="b-timeline-line__elapsed-line" style={{width:this._convertStepToXPoint(this.props.currentStep+1, this.props.time)}}></div>
                {labels}
            </div>
        </div>
    }

    lineClick(e){
        if(this.props.indexMode == 'chains') {
            this.props.setIndexMode('dates');
        }
    
        var step = this._convertXPointToStep(e.pageX);
        if(step < 0 || step >= this.props.time.getCountSteps() ) return;

        this.props.rewind(step);
    };

    lineMouseover(e){
        var mapInfo = this.props.time.getTimeObjectById('MAIN');
        if(!mapInfo) return;
        var step = this._convertXPointToStep(e.pageX);
        var calendar = this.props.time.getCalendar();
        if(step < 0 || step >= this.props.time.getCountSteps() ) return;
        this.setState({tip:{
            left:(e.pageX - this.state.lineOffset+10),
            top:(e.pageY - this.state.lineOffsetTop-10),
            label: this.state.formatter.getDateLabel(calendar.getDateByStep(step))
        }});
    }

    initTimeLabels(time){
      var mapInfo = time.getTimeObjectById('MAIN');

      if(!mapInfo) return [];

      var startYear = parseInt(mapInfo.getDateBegin().year);
      var endYear = parseInt(mapInfo.getDateEnd().year);

      var labels = [];
      if(time.getCalendar().getMode() =='hour'){
          labels = this.initHoursLabels(mapInfo, time);
      }
      else if(endYear-startYear < 2){
          labels = this.initMonthsLabels(mapInfo, time);
      }
      else if(time.getCalendar().getMode() == 'series'){
          labels = this.initYearLabels(mapInfo, time, 10, this.state.formatter.getSeasonLabel, true);
      }
      else if(endYear-startYear > 3000){
          labels = this.initYearLabels(mapInfo, time, 1000, this.state.formatter.getMilleniumLabel);
      }
      else if(endYear-startYear > 300){
          labels = this.initYearLabels(mapInfo, time, 100, this.state.formatter.getAgeLabelShort);
      }
      else if(endYear-startYear > 30){
          labels = this.initYearLabels(mapInfo, time, 10, this.state.formatter.getDecadeLabel);
      }
      else{
          labels = this.initYearLabels(mapInfo, time, 1, this.state.formatter.getYearLabelShort);
      }
      return labels;
    };


    initYearLabels(mapInfo, time, yearsStep, formatFunction, shift){

      var startYear = parseInt(mapInfo.getDateBegin().year);
      var endYear = parseInt(mapInfo.getDateEnd().year);
      var calendar = time.getCalendar();
      var year = parseInt(startYear);
      var labels = [];
      while(year <= parseInt(endYear)) {
         
          var nextYear = Math.floor((year+yearsStep)/yearsStep)*yearsStep +(shift ? 1 : 0);
          //work around for GOT
          if(shift && year == 61) {
              nextYear = 68;
          }
          if(shift && year == 68) {
              nextYear = 74;
          }
    //    nextYear += startYear < 0 && nextYear == 0 ? 1 : 0; //ZERO YEAR SHIFT
          var labelDate = year === startYear ? mapInfo.getDateBegin() : {month:1, year:year, day:1};
          var nextLabelDate = year === endYear ||  nextYear > endYear? calendar.getNextDate(mapInfo.getDateEnd())
              : {month:1, year:nextYear, day:1};
              
            
          var left = this._convertStepToXPoint(calendar.getStepByDate(labelDate),time);
          var right = this._convertStepToXPoint(calendar.getStepByDate(nextLabelDate),time);
          labels.push({
              left: left,
              right: right,
              label: formatFunction.call(this.state.formatter, year)
          })
          year = nextYear;
      }
      return labels;
    }


    initMonthsLabels(mapInfo, time){
        var startYear = parseInt(mapInfo.getDateBegin().year);
        var endYear = parseInt(mapInfo.getDateEnd().year);
        var calendar = time.getCalendar();
        var year = parseInt(startYear);
        var labels = [];

        while(year <= parseInt(endYear)){
            var startMonth = (year === parseInt(startYear)) ? mapInfo.getDateBegin().month : 1;
            var endMonth = (year === parseInt(endYear)) ? mapInfo.getDateEnd().month : 12;

            var month = parseInt(startMonth);
            while(month <= parseInt(endMonth)){
                var labelDate = (year === startYear) && (month === startMonth) ?
                    mapInfo.getDateBegin() : {month:month, year:year, day:1};
                var nextLabelDate = {month:(month === 12 ? 1 : month+1), year:(month === 12 ? year+1 : year), day:1};

                var left = this._convertStepToXPoint(calendar.getStepByDate(labelDate), time);
                var right = this._convertStepToXPoint(calendar.getStepByDate(nextLabelDate), time);
                labels.push({
                    left: left,
                    right: right,
                    label: this.state.formatter.getMonthName(month)+" "+this.state.formatter.getYearLabelShort(year)
                })
                month++;
            }
            year++;
        }
        return labels;
    }

    initHoursLabels (mapInfo, time){
        var calendar = time.getCalendar();
        var startStep  = calendar.getStepByDate(mapInfo.getDateBegin());
        var endStep  = calendar.getStepByDate(mapInfo.getDateEnd());
        var labels = [];
        for(var step = startStep; step <= endStep;step++){
            var labelDate = calendar.getDateByStep(step);
            var nextLabelDate = calendar.getDateByStep(step+1);
            var left = this._convertStepToXPoint(calendar.getStepByDate(labelDate), time);
            var right = this._convertStepToXPoint(calendar.getStepByDate(nextLabelDate), time);
            labels.push({
                left: left,
                right: right,
                label: this.state.formatter.getHourLabel(labelDate.hour)
            })
        }
        return labels;
    }

    _convertXPointToStep(xpoint,noFloor){
        var relX = (xpoint-this.state.lineOffset)/(this.state.lineWidth);
        return noFloor ? relX*(this.props.time.getCountSteps())-1 : Math.ceil(relX*(this.props.time.getCountSteps()))-1;
    };

    _convertStepToXPoint(step, time){
        if(!time.getCountSteps()){
            return 0;
        }
        var relX = (step) / (time.getCountSteps());
        return relX * (this.state.lineWidth);
    };

}


export default connect((state, ownProps) => {
    return {
        currentStep: state.currentStep,
        indexMode: state.indexMode,
        time: state.time,
        labels: state.labels,
        lang: state.lang,
    }},
    (dispatch, ownProps) => {
        return {
            rewind: (step) => {
                dispatch(rewind(step,'timeline'))
            },
            setIndexMode: (indexMode) => {
                dispatch(setIndexMode(indexMode))
            },
        }
    }
)(Timeline);
