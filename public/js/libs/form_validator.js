import { Calendar } from './time/calendar/calendar.js'

/**
 * Class for unit/event/map form validation
 */

export class FormValidator
{
    validate(options){
        var messages = [];
        for(var field in options.validators){
            var validator = options.validators[field];
            switch(validator.type){
                case 'NOT_EMPTY':
                    if(options.fields[field] === ''){
                        messages.push(validator.errorLabel);
                    }
                    break;      
                case 'EQUAL_FIELD':
                    if(options.fields[field] !== options.fields[validator.secondField]){
                        messages.push(validator.errorLabel);
                    }
                    break;      
                case 'VALID_POINT':
                  if(!this.isNum(options.fields[field].lat) || !this.isNum(options.fields[field].lng)){
                    messages.push(validator.errorLabel);
                  }
                break;  
                case 'VALID_DATE_YEAR':
                    if(!this.isInt(options.fields[field].year)){
                        messages.push(validator.errorLabel);
                    }
                    if(options.fields['dateMode'] === 'century' && options.fields[field].year % 100 !==0){
                        messages.push(validator.errorLabel);
                    }
                    if(options.fields['dateMode'] === 'decade' && options.fields[field].year % 10 !==0){
                        messages.push(validator.errorLabel);
                    }
                    break;  
                case 'DATE_PAIR':
                    var calendar = options.calendar;
                    if(!calendar) {
                        calendar = new Calendar();
                        calendar.setMode(options.fields['dateMode']);
                        calendar.setDateBegin(options.fields['dateBegin']);
                    }
                    if(calendar.gT(options.fields['dateBegin'],options.fields['dateEnd'])){
                        messages.push(validator.errorLabel);
                    }
                    break;
                case 'SIZE_PAIR':{
                    if(parseInt(options.fields['size']) > parseInt(options.fields['sizeMax'])){
                        messages.push(validator.errorLabel);
                    }
                    break;   
                }
            }
        }

        return messages;
        
    };
     
    isInt(n){
        if(n ==='') return false;
        return Number(n)==n && n%1===0;
    };

    isNum(n){
        if(n ==='') return false;
        return Number(n)==n;
    };
}