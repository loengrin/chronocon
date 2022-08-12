var sha1 = require('../libs/sha1_generator');
import CommonLib from '../../common/common_lib.js';

/**
 * Class for dynamic field of object
 */
export class TimeObjectField
{
    constructor(options){
        this.deletedField = false;
        this.version = 1;        
        this.newField = options.id ? false : true; 
        this.dateBegin = CommonLib.clone(options.dateBegin); 
        this.dateEnd = CommonLib.clone(options.dateEnd);
        this.value = options.value;
        this.type = options.type;
        this.id = options.id ? options.id : options.type.substring(0,10)+""+(new Date()).getTime()+"."+Math.floor(Math.random() * 1000);
        this.timeObject = options.timeObject; 

        this.loadHash = '';
        if(!this.newField){
           this.initHash();
        }   
        this.serverHash = options.serverHash;
    };

    getHash(){
        var object = {
            fields:CommonLib.ksort(this.value),
            dateBegin:this.dateBegin,
            dateEnd:this.dateEnd
        };
        return sha1(JSON.stringify(object));
    };

    getId(){
        return this.id;
    };

    getVersion(){
        return this.version;
    };

    isDeleted(){
        return this.deletedField;
    };

    isNew(){
        return this.newField;
    };

    getDateEnd(){
        return CommonLib.clone(this.dateEnd);
    };

    getDateBegin(){
        return CommonLib.clone(this.dateBegin);
    };

    getType(){
        return this.type;
    };

    setDateEnd(newDateEnd){
        this.dateEnd = CommonLib.clone(newDateEnd);
    };

    setDateBegin(newDateBegin){
        this.dateBegin = CommonLib.clone(newDateBegin);
    };

    versionUp(){
        this.version++;
    };

    setIsDeleted(newIsDeleted){
        this.deletedField = newIsDeleted;
    };

    getTimeObjectId(){
        return this.timeObject.getId();
    };

    getTimeObject(){
        return this.timeObject;
    };

    getValue(){
        return this.value;
    };

    setValue(newValue){
        this.value = newValue;
    };

    isChanged(){
        if(this.newField || this.deletedField) return true; 
        if(this.loadHash !== this.getHash()) return true;
        return false;     
    };

    initHash(){
        this.newField = false;
        this.loadHash = this.getHash();  
    };

    getSerializeData(){
        if(this.isDeleted()) return;
        var serializeData = {
            timeObjectId:this.timeObject.getId(),
            timeObjectFieldId:this.id,
            type:this.type,
            blockNumber:this.timeObject.getTime().getIndex().getBlockNumberByStep(this.timeObject.getTime().getCalendar().getStepByDate(this.dateBegin)),
            dateBegin:this.dateBegin,
            dateEnd:this.dateEnd,
        };   
        if(this.isNew() || this.isChanged()){
            serializeData.value = this.value;
        }
        else{
            serializeData.serverHash = this.serverHash;
        }    
        return serializeData;
    };
}