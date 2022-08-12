import { Calendar } from './calendar/calendar.js'
import { TimeObject } from './object/time_object.js'
import { TimeIndex } from './indexes/time_index.js'
import { IndexStore } from './indexes/index_store.js'
import CommonLib from '../common/common_lib.js';

/**
 * Main container for objects in the application.
 */
var Time = function(){
    this.calendar = new Calendar(); 
    this.timeObjects = {};
    this.dateBegin = null;
    this.dateEnd = null;
    this.index = null;
    this.indexStore = new IndexStore();
};
  

Time.prototype.init = function(dateMode, newDateBegin, newDateEnd, labels, formatter){
    this.calendar.setMode(dateMode);
    this.calendar.setDateBegin(newDateBegin);

    if(this.calendar.gT(newDateBegin, newDateEnd)){
      throw new Error("init map with wrong date pair");
    }

    this.timeObjects = {};
    this.dateBegin = CommonLib.clone(newDateBegin);
    this.dateEnd = CommonLib.clone(newDateEnd);
    this.index = new TimeIndex(this);
    this.index.init();
    this.indexStore =  new IndexStore(this, labels, formatter);
    this.indexStore.init()
};

Time.prototype.getCountSteps = function(){
    if(!this.index){
        return 0;
    }
    return this.index.getCountSteps();
};

Time.prototype.getCountBlocks = function(){
    return this.index.getCountBlocks();
};

Time.prototype.getCountStepsInBlock = function(){
    return this.index.getCountStepsInBlock();
};

Time.prototype.getCalendar = function(){
    return this.calendar;
};

Time.prototype.getIndexStore = function(){
    return this.indexStore;
};

Time.prototype.addTimeObject = function(type, newDateBegin, newDateEnd){
    if(this.calendar.gT(newDateBegin, newDateEnd)){
        throw new Error("add time object with wrong date pair");
    }
    if(this.calendar.lT(newDateBegin, this.dateBegin) || this.calendar.gT(newDateEnd, this.dateEnd) ){ 
        this.calendar.getStepByDate(newDateBegin)
        throw new Error("add time object out of timeline");
    }
    var timeObject = new TimeObject({
        time:this,
        type:type,
        dateBegin:newDateBegin,
        dateEnd:newDateEnd
    });
    this.timeObjects[timeObject.getId()] = timeObject;
    this.addToIndex(timeObject);
    return timeObject;
};

 Time.prototype.loadTimeObject = function(id, type, newDateBegin, newDateEnd, value, serverHash){
    var timeObject = new TimeObject({
        time:this,
        type:type,
        id:id,
        value:value,
        serverHash:serverHash,
        dateBegin:newDateBegin,
        dateEnd:newDateEnd
    });
    this.timeObjects[timeObject.getId()] = timeObject;
    this.addToIndex(timeObject);
    return timeObject;
};

Time.prototype.addToIndex = function(object, isTimeObjectField){
    if(!object) console.trace();
    this.index.addToIndex(object, isTimeObjectField);
};

Time.prototype.getStepsDump = function(type, idsOnly){
    return this.index.getStepsDump(type, idsOnly);
};

Time.prototype.getStepObjects = function(step, type){
    if(step < 0 || step >= this.index.getCountSteps()) return [];
    return this.index.getStepObjects(step, type);
};

Time.prototype.getStepSplashes = function(step,type){
    return this.index.getStepSplashes(step,type);
};

Time.prototype.getTimeObjectById = function(timeObjectId){
    return this.timeObjects[timeObjectId];
};

Time.prototype.getDateEnd = function(){
    return CommonLib.clone(this.dateEnd);
};

Time.prototype.getDateBegin = function(){
    return CommonLib.clone(this.dateBegin);
};

Time.prototype.move = function(newDateBegin, newDateEnd){
    if(this.calendar.isEqual(this.dateBegin,newDateBegin) && this.calendar.isEqual(this.dateEnd,newDateEnd)) return;
    if(this.calendar.gT(newDateBegin, newDateEnd)){
        throw new Error("move map on wrong date pair");
    }
    var oldDateBegin =  CommonLib.clone(this.dateBegin);
    var oldDateEnd =  CommonLib.clone(this.dateEnd);

    this.dateBegin = CommonLib.clone(newDateBegin);
    this.dateEnd = CommonLib.clone(newDateEnd);

    this.calendar.setDateBegin(newDateBegin);
    this.index.init();

    this.updateDataOfMap(oldDateBegin, oldDateEnd);
};

Time.prototype.updateDataOfMap = function(oldDateBegin, oldDateEnd){
    for(var objectId in this.timeObjects){
        var timeObject = this.timeObjects[objectId];

        if(this.calendar.gT(timeObject.getDateBegin(),this.dateEnd) ||
           this.calendar.lT(timeObject.getDateEnd(),this.dateBegin)){
           timeObject.deleteObject();
           continue;
        }

        if(this.calendar.gE(timeObject.getDateBegin(),this.dateBegin)&&
           this.calendar.lE(timeObject.getDateEnd(),this.dateEnd)){
           var newSegmentDateBegin = this.calendar.eQ(timeObject.getDateBegin(),oldDateBegin) ? this.dateBegin : timeObject.getDateBegin();
           var newSegmentDateEnd = this.calendar.eQ(timeObject.getDateEnd(),oldDateEnd) ? this.dateEnd : timeObject.getDateEnd();
           timeObject.move(newSegmentDateBegin,newSegmentDateEnd, true);
           continue;
        }

        var newSegmentDateBegin = timeObject.getDateBegin();
        var newSegmentDateEnd = timeObject.getDateEnd();
        if(this.calendar.lT(timeObject.getDateBegin(),this.dateBegin)){
            newSegmentDateBegin = this.dateBegin;
        }
        if(this.calendar.gT(timeObject.getDateEnd(),this.dateEnd)){
            newSegmentDateEnd = this.dateEnd;
        }
        timeObject.move(newSegmentDateBegin,newSegmentDateEnd, true);
    }
};

Time.prototype.getSerializeData = function(){
    var objects = this.getDeletedObjects();
    objects = objects.concat(this.getChangedObjects());
    objects = objects.concat(this.getNewObjects());
    var serializeData = [];
        for(var i=0; i<objects.length; i++){
        var objectSerializeData = objects[i].getSerializeData();
        if(objectSerializeData){
            serializeData.push(objectSerializeData);
        }
    }
    return serializeData;
};

Time.prototype.getDateBegin = function(){
    return CommonLib.clone(this.dateBegin);
};

Time.prototype.getIndex = function(){
    return this.index;
};

Time.prototype._getFiletedObjects = function(filterFunction){
    var resultObjects = [];
    for(var objectId in this.timeObjects){
        var object = this.timeObjects[objectId];
        if(filterFunction(object)){
            resultObjects.push(object);
        }
    }
    return resultObjects;
}

Time.prototype.getObjectsOfType = function(type){
    return this._getFiletedObjects(function(object){
        if(object.isDeleted()) return false;
        if(object.getType() !== type) return false;
        return true;
    });
};

Time.prototype.getObjectOfType = function(type){
    var objects = this.getObjectsOfType(type);
    return objects ? objects[0] : null;
};

Time.prototype.getDeletedObjects = function(){
    return this._getFiletedObjects(function(object){
        return !object.isNew() && object.isDeleted();
    });
};

Time.prototype.getNewObjects = function(){
    return this._getFiletedObjects(function(object){
        return object.isNew() && !object.isDeleted();
    });
};

Time.prototype.getChangedObjects = function(){
    return this._getFiletedObjects(function(object){
        return !object.isDeleted() && !object.isNew() && object.isChanged();
    });
};

Time.prototype.flushChanges = function(){
    this._getFiletedObjects(function(object){
        if(object.isDeleted()){
            delete this.timeObjects[object.getType()][object.getId()];
        }
        else{
            object.flushChanges();
        }
    });
}

Time.prototype.getCopy = function(){
    var timeCopy = CommonLib.clone(this);
    timeCopy.index.time = timeCopy;
    timeCopy.indexStore.timeStorage = timeCopy;

    for(var objectId in timeCopy.timeObjects) {
        var timeObject = timeCopy.timeObjects[objectId];
        timeObject.time = timeCopy;
        for(var type in timeObject.timeObjectFields){
            for(var fieldId in timeObject.timeObjectFields[type]){
                var field = timeObject.timeObjectFields[type][fieldId];
                field.timeObject = timeObject;
            }
        }
    }
    return timeCopy;
}

export default Time;