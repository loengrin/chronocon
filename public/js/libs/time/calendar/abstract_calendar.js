import { ConverterFactory } from './date_converters/converter_factory.js'

/**
 * Base class for calendar. Contains functions for date comparation.
 */
export class AbstractCalendar
{
    getDateByStep(step) {   
        
    };

    getStepByDate(date) {
       
    };

    compareDates(date1, date2){
      var stepDate1 = this.getStepByDate(date1);
      var stepDate2 = this.getStepByDate(date2);

      if(stepDate1 === stepDate2) return 0;
      if(stepDate1 > stepDate2) return 1;
      return -1;        
    };
    
    isEqual(date1, date2){
      return this.compareDates(date1, date2) === 0;
    };

    eQ(date1, date2){
      return this.compareDates(date1, date2) === 0;
    }

    nE(date1, date2){
      return this.compareDates(date1, date2) !== 0;
    }

    gT(date1, date2){
      return this.compareDates(date1, date2) === 1;
    }

    lT(date1, date2){
      return this.compareDates(date1, date2) === -1;
    }

    gE(date1, date2){
      return this.compareDates(date1, date2) !== -1;
    }

    lE(date1, date2){
      return this.compareDates(date1, date2) !== 1;
    }
    
    getPreviousDate(date){
      return this.getDateByStep(this.getStepByDate(date)-1);
    };

    getNextDate(date){
      return this.getDateByStep(this.getStepByDate(date)+1);
    };
}
