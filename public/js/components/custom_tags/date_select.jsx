var React = require('react');
import CommonLib from '../../libs/common/common_lib.js';
import { DateFormatter } from '../../libs/date_formatter';

/**
 * Component for date selection. It depends on date mode.
 */
class DateSelectContainer extends React.Component {
    
    constructor(props) {
        super(props);
        this.formatter = new DateFormatter(props.labels, props.lang, this.props.calendar.getMode());
    }
    
    componentWillMount(){
        this.setState({ currentDate: this.props.currentDate });
    }

    render(){
        var that = this;
        var itemBlocks = [];

        var blocks = this.getBlocks();
        for(var i=0; i < blocks.length; i++){
            var block = blocks[i];

            if(this.isBlockRequired(block, that.props.mode)){
                if(block == 'year' && that.props.noYearLimits){
                    itemBlocks.push(<DateInputBlock
                        key={block}
                        currentLabel={that.state.currentDate[block]}
                        selectCallback={this.getCallbackByBlock(block)}
                    />);
                }
                else {
                    itemBlocks.push(<DateSelectBlock
                        key={block}
                        currentLabel={that.getLabelByBlock(block, that.state.currentDate[block])}
                        items={that.getItemsByBlock(block, that.props.mode)}
                        selectCallback={this.getCallbackByBlock(block)}
                    />);
                }
            }
        }

        return <div>
            {itemBlocks}
        </div>
    }

    getLabelByBlock(block, value){
        switch(block){
            case 'year': return this.formatter.getYearLabel(value);
            case 'month':return this.formatter.getMonthName(value);
            case 'day': return value;
            case 'hour': return this.formatter.getHourLabel(value);
        }
    }

    getItemsByBlock(block, mode){
        switch(block){
            case 'year': return this.getYearItems(this.getYearIncrementByMode(mode));
            case 'month': return this.getMonthItems();
            case 'day': return this.getDayItems();
            case 'hour': return this.getHourItems();
        }
    }

    getBlocks(){
        return  ['year','month','day','hour'];
    }

    getCallbackByBlock(block){
        var that = this;
        var calendar = this.props.calendar;

        return function (newValue) {
            var currentDate = that.state.currentDate;
            currentDate[block] = newValue;
            if(!that.props.noYearLimits) {
                if (calendar.gT(that.props.dateBegin, currentDate)) {
                    currentDate = CommonLib.clone(that.props.dateBegin);
                }
                else if (calendar.lT(that.props.dateEnd, currentDate)) {
                    currentDate = CommonLib.clone(that.props.dateEnd);
                }
            }

            that.setState({ currentDate: currentDate });
            that.props.callbackFunction(currentDate);
        }
    }

    isBlockRequired(block, mode){
        var config = {
            'century':  ['year'],
            'decade':   ['year'],
            'year':     ['year'],
            'month':    ['year','month'],
            'day':      ['year','month','day'],
            'hour':     ['year','month','day','hour'],
            'series':   ['year'],
        }
        return config[mode].indexOf(block) !== -1;
    }

    getYearIncrementByMode(mode){
        switch (mode){
            case 'century': return 100;
            case 'decade': return 10;
            default: return 1;
        }
    }

    getYearItems(yearIncrement){
        var startYear = parseInt(this.props.dateBegin.year);
        var endYear = parseInt(this.props.dateEnd.year);
        var year = startYear;
        var items = [];
        while(year <= endYear){
            items.push({
                label: this.getLabelByBlock('year',year),
                value: year
            });
            year += yearIncrement;
        }
        return items;
    }

    getMonthItems(){
        var items = [];
        var dateBegin = this.props.dateBegin;
        var dateEnd = this.props.dateEnd;
        var currentYear = this.state.currentDate.year;

        for(var monthNumber=1; monthNumber <= 12; monthNumber++){
            if(!this.props.noYearLimits && (currentYear == dateBegin.year) && (monthNumber < dateBegin.month)) continue;
            if(!this.props.noYearLimits && (currentYear == dateEnd.year) && (monthNumber > dateEnd.month)) continue;

            items.push({
                label: this.getLabelByBlock('month',monthNumber),
                value: monthNumber
            });
        }
        return items;
    }

    getDayItems(){
        var items = [];
        var currentYear = this.state.currentDate.year;
        var currentMonth = this.state.currentDate.month;
        var dateBegin = this.props.dateBegin;
        var dateEnd = this.props.dateEnd;

        var daysCount = this.getDaysCount(currentYear, currentMonth);
        for(var dayNumber = 1; dayNumber <= daysCount; dayNumber++){
            if(!this.props.noYearLimits &&
                (currentYear == dateBegin.year) &&
                (currentMonth == dateBegin.month) &&
                (dayNumber < dateBegin.day)) {
                continue;
            }
            if(!this.props.noYearLimits &&
                (currentYear == dateEnd.year) &&
                (currentMonth == dateEnd.month) &&
                (dayNumber > dateEnd.day)) {
                continue;
            }

            items.push({
                label: this.getLabelByBlock('day',dayNumber),
                value: dayNumber
            });
        }
        return items;
    }

    getHourItems(){
        var items = [];
        var currentYear = this.state.currentDate.year;
        var currentMonth = this.state.currentDate.month;
        var currentDay = this.state.currentDate.day;

        var dateBegin = this.props.dateBegin;
        var dateEnd = this.props.dateEnd;

        for(var hourNumber = 1; hourNumber <= 24; hourNumber++){
            if(!this.props.noYearLimits &&
                (currentYear == dateBegin.year) &&
                (currentMonth == dateBegin.month) &&
                (currentDay == dateBegin.day) &&
                (hourNumber < dateBegin.hour)) {
                continue;
            }
            if(!this.props.noYearLimits &&
                (currentYear == dateEnd.year) &&
                (currentMonth == dateEnd.month) &&
                (currentDay == dateEnd.day) &&
                (hourNumber > dateEnd.hour)) {
                continue;
            }

            items.push({
                label: this.getLabelByBlock('hour',hourNumber),
                value: hourNumber
            });
        }
        return items;
    }

    getDaysCount(year, month){
        var longMonth = [1, 3, 5, 7, 8, 10, 12];
        if (longMonth.indexOf(month) != -1) return 31;
        if (month == 2) {
            if (year % 400 == 0) return 29;
            if (year % 100 == 0) return 28;
            if (year % 4 == 0) return 29;
            return 28;
        }
        return 30;
    }
}

class DateSelectBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { menuOpened: false };
    }

    render(){
        var links = [];
        this.props.items.forEach((item,i)=> {
            links.push(<a href='#' key={i}
                          className="b-time-selector__link"
                          onClick={() => this.selectItem(item.value)
                          }>
                {item.label}
            </a>);
        });

        return <div className="b-time-selector__container" onMouseLeave={this.hideMenu.bind(this)}>
            <div className="b-time-selector__button" onMouseOver={this.showMenu.bind(this)}>{this.props.currentLabel}</div>
            <div className="b-time-selector__menu" style={{display: this.state.menuOpened ? 'block' :'none'}}>
                {links}
            </div>
        </div>
    }

    showMenu(){
        this.setState({ menuOpened: true });
    }

    hideMenu(){
        this.setState({ menuOpened: false });
    }

    selectItem(value){
        this.hideMenu();
        this.props.selectCallback(value);
    }
}

class DateInputBlock extends React.Component {
    componentWillReceiveProps(newProps){
        this.setState({currentLabel:newProps.currentLabel});
    }

    componentWillMount(){
        this.setState({currentLabel:this.props.currentLabel});
    }

    render(){
        return <div className="b-time-selector__container">
            <input className="b-time-selector__button"
                   onChange={this.inputChange.bind(this)}
                   onBlur={this.inputBlur.bind(this)}
                   value={this.state.currentLabel}>
            </input>
        </div>
    }

    inputChange(event){
        this.setState({currentLabel:event.target.value});
    }

    inputBlur(event){
        this.setState({currentLabel:event.target.value});
        this.props.selectCallback(event.target.value);
    }
}

export default DateSelectContainer;
