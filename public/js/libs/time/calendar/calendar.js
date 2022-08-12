import { ConverterFactory } from './date_converters/converter_factory.js'
import { AbstractCalendar } from './abstract_calendar.js'

/**
 * Class for convertation date to step and vice versa via DateConverter
 */
export class Calendar extends AbstractCalendar
{
    constructor(mode, dateBegin) {
        super();
        this.dateBegin = dateBegin ? dateBegin : {month:null, year:null};
        this.mode = mode ? mode :'month';
        var converterFactory = new ConverterFactory();
        this.converter = converterFactory.getConverter(this.mode)
    }
    
    getDateByStep(step) {   
        return this.converter.getDateByStep(this.dateBegin, step)
    };

    getStepByDate(date) {
        return this.converter.getStepByDate(this.dateBegin, date)
    };

    setDateBegin(newDateBegin){
      this.dateBegin.month  = newDateBegin.month;
      this.dateBegin.year  = newDateBegin.year;
      this.dateBegin.day  = newDateBegin.day;
      this.dateBegin.hour  = newDateBegin.hour;
    };

    setMode(newMode){
      this.mode  = newMode;
      var converterFactory = new ConverterFactory();
      this.converter = converterFactory.getConverter(this.mode)
    };

    getMode(){
      return this.mode;
    };
}
