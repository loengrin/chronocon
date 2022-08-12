/**
 * Class for converting between date and step in hour mode
 */
export class HourConverter
{
    getStepByDate(dateBegin, date) {
        var dateSeconds = new Date(date.year, date.month-1, date.day ? date.day : 1).getTime() / 1000;
        var beginDateSeconds = new Date(dateBegin.year, dateBegin.month-1, dateBegin.day).getTime() / 1000;
        var hours = (dateSeconds-beginDateSeconds)/60/60 + date.hour - dateBegin.hour;
        if(!hours){
        }
        return hours;
    };

    getDateByStep(dateBegin, step){
        var days = Math.floor(step/24);
        var hours = step - days*24;

        var beginDateMilliSeconds = new Date(dateBegin.year, dateBegin.month-1, dateBegin.day, dateBegin.hour).getTime();
        var dateSeconds = new Date(beginDateMilliSeconds + 60*60*24*days*1000 + 60*60*hours*1000);
        var date = {month:dateSeconds.getMonth()+1, year:dateSeconds.getFullYear(), day:dateSeconds.getDate(), hour:dateSeconds.getHours()};
        return date;
    };
}
