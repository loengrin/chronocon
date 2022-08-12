/**
 * Class for converting between date and step in month mode
 */
export class MonthConverter
{
    getStepByDate(dateBegin, date) {    
      var month = date.month ? date.month : 1;
      var beginMonth = dateBegin.month ? dateBegin.month :1;
      return (parseInt(date.year) * 12 + parseInt(month)) - (parseInt(dateBegin.year) * 12 + parseInt(beginMonth));
    };

    getDateByStep(dateBegin, step) {
      var absMonth = (parseInt(dateBegin.year) * 12 + parseInt(dateBegin.month))+ step;
      var month = (absMonth % 12) > 0 ? (absMonth % 12) : (absMonth % 12)+12;
      var year = (absMonth-month)/12;
      var date = {month:month, year:year};
      return date ;
    };
}
