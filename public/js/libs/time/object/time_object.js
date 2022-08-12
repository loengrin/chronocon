var sha1 = require('./../libs/sha1_generator');
import CommonLib from '../../common/common_lib.js';
import { TimeObjectField } from './time_object_field.js'

/**
 * Class that represent object on timeline
 */
export class TimeObject
{
    constructor(options){
        this.newObject = options.id ? false : true;
        this.version = 1;
        this.serverHash = options.serverHash;

        this.timeObjectFields = {};       
        this.simpleFields = options.value ? options.value : {};

        this.dateBegin = CommonLib.clone(options.dateBegin); 
        this.dateEnd = CommonLib.clone(options.dateEnd);
        this.id = options.id ? options.id : options.type.substring(0,3)+""+(new Date()).getTime()+"."+Math.floor(Math.random() * 1000);  
        this.id =  options.type === 'MAIN' ? 'MAIN' : this.id;

        this.objectType = options.type;

        this.time = options.time;
        this.deletedObject = false;
        this.loadHash = '';
        if(!this.newObject){
          this.flushChanges();
        }   
    };

    getHash(){
        var object = {
            fields:CommonLib.ksort(this.simpleFields),
            dateBegin:this.dateBegin,
            dateEnd:this.dateEnd
        };
        return sha1(JSON.stringify(object));
    };

    isChanged(){
        if(this.newObject || this.deletedObject) return true;
        if(this.loadHash !== this.getHash()) return true;

        for(var type in this.timeObjectFields){      
            for(var fieldId in this.timeObjectFields[type]){ 
                var field = this.timeObjectFields[type][fieldId];
                if(field.isChanged()) return true;
            }
        }
        return false;
    };

    flushChanges(){
        this.loadHash = this.getHash();
        this.newObject = false;
        for(var type in this.timeObjectFields){      
            for(var fieldId in this.timeObjectFields[type]){ 
                var field = this.timeObjectFields[type][fieldId];
                if(field.isDeleted()){
                    delete this.timeObjectFields[type][fieldId];
                }
                else{
                    field.flushChanges();
                }           
            }      
        }    
    }

    getId(){
        return this.id;
    };

    getVersion(){
        return this.version;
    };

    isDeleted(){
        return this.deletedObject;
    };

    isNew(){
        return this.newObject;
    };

    getTimeObjectsFieldsArray(type, sortResult){   
        var subsegments = [];
        var that = this;
        for(var timeObjectFieldId in this.timeObjectFields[type]){
            var timeObjectField = this.timeObjectFields[type][timeObjectFieldId];      
            if(!timeObjectField.isDeleted()){
                subsegments.push(timeObjectField);
            }
        } 
        if(sortResult) {
            subsegments.sort(function(timeObjectField1,timeObjectField2){
                return that.time.getCalendar().compareDates(timeObjectField1.getDateBegin(),timeObjectField2.getDateBegin());
            });
        }
        return subsegments;  
    };

    getTimeObjectFieldContainsDate(fieldType, date){
        var timeObjectsFieldsArray = this.getTimeObjectsFieldsArray(fieldType);      
        for(var i=0; i<timeObjectsFieldsArray.length;i++){
            if(this.time.getCalendar().gE(date,timeObjectsFieldsArray[i].getDateBegin())&& 
                this.time.getCalendar().lE(date,timeObjectsFieldsArray[i].getDateEnd())){
                return timeObjectsFieldsArray[i];
            } 
        }
        return 0;
    };

    getTimeObjectFieldEndedDate(fieldType, date){
        var timeObjectsFieldsArray = this.getTimeObjectsFieldsArray(fieldType);      
        for(var i=0; i<timeObjectsFieldsArray.length;i++){
            var previousDate = this.time.getCalendar().getPreviousDate(date);
            if(this.time.getCalendar().isEqual(timeObjectsFieldsArray[i].getDateEnd(),previousDate)){
                return timeObjectsFieldsArray[i];
            } 
        }
        return 0;
    };

    addTimeObjectField(fieldType, newDateBegin, value){
        if(this.time.calendar.lT(newDateBegin, this.dateBegin) || this.time.calendar.gT(newDateBegin, this.dateEnd) ){
            throw new Error("add timeObjectField out of timeObject");
        }
        var previousTimeObjectField = this.getTimeObjectFieldContainsDate(fieldType, newDateBegin);
        if(!previousTimeObjectField && this.time.calendar.nE(newDateBegin, this.dateBegin) ){
            throw new Error("add first timeObjectField not in begin");
        }
        if(previousTimeObjectField && this.time.calendar.eQ(newDateBegin, previousTimeObjectField.getDateBegin()) ){
            throw new Error("add timeObjectField on other timeObjectField");
        }

        var newDateEnd = previousTimeObjectField ? previousTimeObjectField.getDateEnd() : this.getDateEnd();    
        var timeObjectField = new TimeObjectField({
            timeObject:this,      
            type:fieldType,
            dateBegin:newDateBegin,
            dateEnd:newDateEnd,
            value:CommonLib.clone(value)
        });

        if(previousTimeObjectField){
            this.insertTimeObjectField(timeObjectField, previousTimeObjectField);   
        }
        else{
            this.time.addToIndex(timeObjectField, true);
        }

        if(!this.timeObjectFields[fieldType]){
            this.timeObjectFields[fieldType] = {};
        }
        this.timeObjectFields[fieldType][timeObjectField.getId()] = timeObjectField;     
        return timeObjectField;
    }; 

    loadTimeObjectField(fieldId, fieldType, newDateBegin, newDateEnd, value, serverHash){
        var timeObjectField = new TimeObjectField({
            timeObject:this,
            id:fieldId,
            type:fieldType,
            dateBegin:newDateBegin,
            dateEnd:newDateEnd,
            value:value,
            serverHash:serverHash
        });
        this.time.addToIndex(timeObjectField, true);
        if(!this.timeObjectFields[fieldType]){
          this.timeObjectFields[fieldType] = {};
        }
        this.timeObjectFields[fieldType][timeObjectField.getId()] = timeObjectField;     
        return timeObjectField;
    };

    insertTimeObjectField(timeObjectField, previousTimeObjectField){
        var previousTimeObjectFieldDateEnd = this.time.getCalendar().getPreviousDate(timeObjectField.getDateBegin());
        previousTimeObjectField.setDateEnd(previousTimeObjectFieldDateEnd);
        previousTimeObjectField.versionUp();
        this.time.addToIndex(timeObjectField, true);
        this.time.addToIndex(previousTimeObjectField, true);          
    };

    deleteTimeObjectField(fieldId, fieldType){
        var field = this.getTimeObjectField(fieldType, fieldId);

        if(this.time.calendar.eQ(this.dateBegin, field.getDateBegin()) ){
            throw new Error("delete first timeObjectField");
        }

        field.setIsDeleted(true);
        var previousTimeObjectField = this.getTimeObjectFieldEndedDate(fieldType, field.getDateBegin()); 
        previousTimeObjectField.setDateEnd(field.getDateEnd());
        previousTimeObjectField.versionUp();
        this.time.addToIndex(previousTimeObjectField, true);    
    };

    moveTimeObjectField(fieldId, fieldType, newDateBegin){  

        if(this.time.calendar.lT(newDateBegin, this.dateBegin) || this.time.calendar.gT(newDateBegin, this.dateEnd) ){
            throw new Error("move timeObjectField out of timeObject");
        }
        var field = this.getTimeObjectField(fieldType, fieldId);
        if(this.time.calendar.eQ(this.dateBegin, field.getDateBegin()) ){
            throw new Error("move first timeObjectField");
        }  
        var previousTimeObjectField = this.getTimeObjectFieldContainsDate(fieldType, newDateBegin);      
         if(!previousTimeObjectField || this.time.calendar.eQ(newDateBegin, previousTimeObjectField.getDateBegin()) ){
            throw new Error("move timeObjectField on other timeObjectField");
        }

        this.deleteTimeObjectField(fieldId, fieldType);
        field.setIsDeleted(false);      
        field.setDateBegin(CommonLib.clone(newDateBegin));
        field.versionUp();

        previousTimeObjectField = this.getTimeObjectFieldContainsDate(fieldType, newDateBegin);      
        if(!previousTimeObjectField || this.time.calendar.eQ(newDateBegin, previousTimeObjectField.getDateBegin()) ){
            throw new Error("move timeObjectField on other timeObjectField");
        }
        this.insertTimeObjectField(field, previousTimeObjectField);    
    };

    getChangedFields(force){  
        var changedFields = {};
        for(var type in this.timeObjectFields){      
            var fields = this.getTimeObjectsFieldsArray(type, true);
            if(!fields.length) continue;
            
            var firstField = fields[0];
            if(force || this.time.getCalendar().gT(firstField.getDateBegin(),this.dateBegin)){
              firstField.setDateBegin(this.dateBegin);      
              changedFields[firstField.getId()] = firstField;
            }
            var lastField = fields[fields.length-1];
             if(force || this.time.getCalendar().lT(lastField.getDateEnd(),this.dateEnd)){
              lastField.setDateEnd(this.dateEnd);      
              changedFields[lastField.getId()] = lastField;      
            }
            for(var i=0;i<fields.length; i++){
               var field = fields[i];

                if(this.time.getCalendar().gT(field.getDateBegin(),this.dateEnd)  || 
                    this.time.getCalendar().lT(field.getDateEnd(),this.dateBegin)){
                    delete changedFields[field.getId()];
                    field.setIsDeleted(true); 
                    continue;        
                }
                 
                if(this.time.getCalendar().gE(field.getDateBegin(),this.dateBegin) &&
                    this.time.getCalendar().lE(field.getDateEnd(),this.dateEnd)){             
                    if(force){
                        changedFields[field.getId()] = field;      
                    }
                    continue;          
                }

                if(this.time.getCalendar().lT(field.getDateBegin(),this.dateBegin)){
                    field.setDateBegin(this.dateBegin);      
                }
                if(this.time.getCalendar().gT(field.getDateEnd(),this.dateEnd)){
                    field.setDateEnd(this.dateEnd);   
                }    
                changedFields[field.getId()] = field;  
            }
      }  
      return changedFields;
    };

    move(newDateBegin, newDateEnd, force){
        if(this.time.calendar.gT(newDateBegin, newDateEnd)){
            throw new Error("move time object with wrong date pair");
        }
        if(this.time.calendar.lT(newDateBegin, this.time.getDateBegin()) || this.time.calendar.gT(newDateEnd, this.time.getDateEnd()) ){
            throw new Error("move time object out of timeline");
        }

        if(!force && this.time.calendar.eQ(this.dateBegin,newDateBegin) && this.time.calendar.eQ(this.dateEnd,newDateEnd)) return;
        this.dateBegin = CommonLib.clone(newDateBegin);
        this.dateEnd = CommonLib.clone(newDateEnd);
        var changedFields = this.getChangedFields(force);
        for(var changedFieldsId in changedFields){
            changedFields[changedFieldsId].versionUp();
            this.time.addToIndex(changedFields[changedFieldsId], true);
        }
        this.versionUp();
        this.time.addToIndex(this);   
    };  

    getDateEnd(){
        return CommonLib.clone(this.dateEnd);
    };

    getDateBegin(){
        return CommonLib.clone(this.dateBegin);
    };

    getTimeObjectField(fieldType, fieldId){
        return this.timeObjectFields[fieldType][fieldId];
    };

    versionUp(){
        this.version++;
    };

    getType(){
        return this.objectType;
    };

    deleteObject(){
        this.deletedObject = true;
        for(var type in this.timeObjectFields){      
            for(var fieldId in this.timeObjectFields[type]){ 
                this.timeObjectFields[type][fieldId].setIsDeleted(true);
            }
        }
    };

    getSerializeData(){
        var serializeData = {
            timeObjectId:this.id,
            type:this.objectType,
            blockNumber: (this.objectType === 'MAIN' ? 0 : this.time.getIndex().getBlockNumberByStep(this.time.getCalendar().getStepByDate(this.dateBegin))),
            dateBegin:this.dateBegin,
            dateEnd:this.dateEnd,
            changeType: this.isDeleted() ? 'delete' : (this.isNew() ? 'new' : (this.isChanged() ? 'change' : ''))
        };
        if(this.isNew() || this.isChanged()){
            serializeData.value = this.simpleFields;
        }
        else{
            serializeData.serverHash = this.serverHash;
        }
        serializeData.timeObjectFields = [];
        for(var type in this.timeObjectFields){      
            for(var fieldId in this.timeObjectFields[type]){ 
                var fieldSerializeData = this.timeObjectFields[type][fieldId].getSerializeData();
                if(fieldSerializeData){
                    serializeData.timeObjectFields.push(fieldSerializeData);
                }        
            }
        }
        return serializeData;
    };

    getField(fieldName){
        return this.simpleFields[fieldName];
    };

    setField(fieldName, fieldValue){
        this.simpleFields[fieldName] = fieldValue;
    };

    setFields(fields){
        for(var field in fields){
            this.simpleFields[field] = fields[field];
        }
    };

    getTime(){
        return this.time;
    };

    setValue(newValue){
        this.simpleFields = newValue;
    };

    getCopy(name){
        var copy = this.time.addTimeObject(this.objectType, this.dateBegin, this.dateEnd);
        copy.simpleFields = CommonLib.clone(this.simpleFields);
        for(var type in this.timeObjectFields){
            var timeObjectFields = this.getTimeObjectsFieldsArray(type, true);   
            for(var i=0;i<timeObjectFields.length;i++){
                copy.addTimeObjectField(type, timeObjectFields[i].getDateBegin(), timeObjectFields[i].getValue()); 
            }
        }
        copy.simpleFields.name = name;
        return copy;
    };
}

