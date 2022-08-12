/**
 * Class for converting between date and step in year mode
 */
export class YearConverter
{
    constructor(countYears) {
        this.countYears = countYears;
    }
    
    getStepByDate(dateBegin, date) {    
    //  var shift = dateBegin.year < 0 && parseInt(date.year) > 0 ? 1 : 0; 
      return Math.floor((parseInt(date.year) - parseInt(dateBegin.year))/this.countYears);    
    };

    getDateByStep(dateBegin, step) {
      var date = {year:parseInt(dateBegin.year) + step*this.countYears};
    //  date.year += dateBegin.year < 0 && parseInt(date.year) >= 0 ? 1 : 0;
      return date ;
    };
}
