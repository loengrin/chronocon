import { YearConverter } from './year_converter.js'
import { MonthConverter } from './month_converter.js'
import { DayConverter } from './day_converter.js'
import { HourConverter } from './hour_converter.js'

/**
 * Class for creating date convertor depending on date mode
 */
export class ConverterFactory
{
    getConverter(mode) {
      switch(mode){
        case 'month': return new MonthConverter();
        case 'day': return new DayConverter();
        case 'hour': return new HourConverter();
        case 'year': return new YearConverter(1);
        case 'decade': return new YearConverter(10);
        case 'century': return new YearConverter(100);
        case 'series': return new YearConverter(1);
    };

    }
}
