/**
 * Class for converting between date and step in day mode
 */
export class DayConverter
{
    getStepByDate(dateBegin, date) {   
      var dateSeconds = new Date(date.year, date.month-1, date.day ? date.day : 1).getTime() / 1000;  
      var beginDateSeconds = new Date(dateBegin.year, dateBegin.month-1, dateBegin.day).getTime() / 1000;
      var days = (dateSeconds-beginDateSeconds)/60/60/24;
      return days;
    };

    getDateByStep(dateBegin, step) {
      var beginDateMilliSeconds = new Date(dateBegin.year, dateBegin.month-1, dateBegin.day).getTime();
      var dateSeconds = new Date(beginDateMilliSeconds + 60*60*24*step*1000);
      var date = {month:dateSeconds.getMonth()+1, year:dateSeconds.getFullYear(), day:dateSeconds.getDate()};
      return date;
    };
}
