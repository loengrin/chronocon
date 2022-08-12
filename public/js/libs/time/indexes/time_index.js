/**
 * Class that allow to quickly get  object for particular step
 */
export class TimeIndex
{   
    constructor(time){   
        this.index = [];
        this.countSteps = null;
        this.countStepsInBlock = null;
        this.countBlocks = null;
        this.time = time;
    };

    init(){    
        this.countSteps = this.time.getCalendar().getStepByDate(this.time.getDateEnd())+1;
        this.countStepsInBlock = 24;      
        this.countBlocks = Math.ceil(this.countSteps/this.countStepsInBlock);
        this.index = [];
        for(var i=0;i < this.countBlocks ;i++){
            this.index[i] = {begin:{},steps:{}};
        }   
    }; 

    getCountSteps(){
        return this.countSteps;
    };

    getCountBlocks(){
        return this.countBlocks;
    };

    getCountStepsInBlock(){
        return this.countStepsInBlock;
    };

    getBlockNumberByStep(step){
        return Math.floor(step / this.countStepsInBlock);
    };

    createStepInNotExist(blockNumber, stepNumber, type){  
        if(stepNumber !== 'begin'){
            if(!this.index[blockNumber].steps[stepNumber]){
                this.index[blockNumber].steps[stepNumber] = {};      
            }                    
        }
        if(stepNumber === 'begin'){
            if(!this.index[blockNumber].begin[type]){
                this.index[blockNumber].begin[type] = [];   
            };
        }
        else{
            if(!this.index[blockNumber].steps[stepNumber][type]){
                this.index[blockNumber].steps[stepNumber][type] = [];    
            }  
        }           
    };

    getFirstStepOfBlock(blockNumber){
        return blockNumber * this.countStepsInBlock;
    };

    getObjectBySplash(type, splash){
        var timeObject = this.time.getTimeObjectById(splash.timeObjectId);
        if(!timeObject) return null;
        var object;
        if(splash.timeObjectFieldId){
            object = timeObject.getTimeObjectField(type, splash.timeObjectFieldId);
        }
        else{
            object = timeObject;     
        }
        if(!object || object.isDeleted()) return null;    
        return object.getVersion() === splash.version ? object : null;             
    };

    addToIndex(object, isTimeObjectField){  
        var stepNumberBegin = this.time.getCalendar().getStepByDate(object.getDateBegin());
        var blockNumberBegin = this.getBlockNumberByStep(stepNumberBegin);
        var stepNumberEnd = this.time.getCalendar().getStepByDate(object.getDateEnd()) + 1;
        var blockNumberEnd = this.getBlockNumberByStep(stepNumberEnd);

        var createSplash,destroySplash,beginSplash;
        if(isTimeObjectField){
            var createSplash = {timeObjectId:object.getTimeObjectId(), timeObjectFieldId:object.getId(), version:object.getVersion(), splashType:'create'};
            var destroySplash = {timeObjectId:object.getTimeObjectId(),timeObjectFieldId:object.getId(), version:object.getVersion(), splashType:'destroy'};
            var beginSplash = {timeObjectId:object.getTimeObjectId(),timeObjectFieldId:object.getId(), version:object.getVersion()};
        }
        else{
            var createSplash = {timeObjectId:object.getId(), version:object.getVersion(), splashType:'create'};
            var destroySplash = {timeObjectId:object.getId(), version:object.getVersion(), splashType:'destroy'};
            var beginSplash = {timeObjectId:object.getId(), version:object.getVersion()};      
        }
        var objectType = object.getType();

        //START
        this.createStepInNotExist(blockNumberBegin, stepNumberBegin, objectType);
        this.index[blockNumberBegin]['steps'][stepNumberBegin][objectType].push(createSplash);     

        //END    
        if(blockNumberEnd < this.countBlocks){      
            this.createStepInNotExist(blockNumberEnd, stepNumberEnd, objectType);
            this.index[blockNumberEnd]['steps'][stepNumberEnd][objectType].push(destroySplash);         
        }
        //STARTS OF BLOCKS    
        for(var blockNumber=blockNumberBegin+1;blockNumber<=blockNumberEnd;blockNumber++){
            if(blockNumber >=  this.countBlocks) continue;
            this.createStepInNotExist(blockNumber, 'begin', objectType);
            this.index[blockNumber]['begin'][objectType].push(beginSplash);
        }            
    };

    getStepsDump(type, idsOnly){
        var firstStep =  0;
        var lastStep = this.countSteps-1;  

        var stepsDump = {};
        for(var step=firstStep; step<=lastStep;step++){   
            var objects = this.getStepObjects(step, type, idsOnly);
            if(objects.length){
                stepsDump[step] = objects;
            }
        }  
        return stepsDump;
    };

    getStepObjects(step, type, idsOnly){   
        var blockNumber = this.getBlockNumberByStep(step);      
        var objects = {};
        //begin
        if(this.index[blockNumber]['begin'][type]){
            for(var splashIndex=0; splashIndex < this.index[blockNumber]['begin'][type].length;splashIndex++){
                var splash = this.index[blockNumber]['begin'][type][splashIndex];
                var object = this.getObjectBySplash(type, splash);
                if(!object) continue;                
                objects[object.getId()] = object;
            }
        }     
        //steps
        var firstStepOfBlock = this.getFirstStepOfBlock(blockNumber);  
        for(var stepOfBlock=firstStepOfBlock; stepOfBlock<=step; stepOfBlock++){
            if(!this.index[blockNumber]['steps'][stepOfBlock]) continue;
            if(!this.index[blockNumber]['steps'][stepOfBlock][type]) continue;
            for(var splashIndex=0; splashIndex < this.index[blockNumber]['steps'][stepOfBlock][type].length;splashIndex++){   
                var splash = this.index[blockNumber]['steps'][stepOfBlock][type][splashIndex];
                var object = this.getObjectBySplash(type, splash);
                if(!object) continue;
                if(splash.splashType === 'destroy'){
                    delete objects[object.getId()];
                }
                else{         
                    objects[object.getId()] = object;
                }      
            }
        }
        //convert to array
        var objectsArray = [];    
        for(var objectId in objects){
            objectsArray.push(idsOnly ? objectId : objects[objectId]);      
        }
        return objectsArray;
    };

    getStepSplashes(step, type){
        var splashes = [];
        var blockNumber = this.getBlockNumberByStep(step);     
        if(!this.index[blockNumber].steps[step]) return [];
        if(!this.index[blockNumber].steps[step][type]) return [];
        for(var splashIndex=0; splashIndex < this.index[blockNumber].steps[step][type].length;splashIndex++){          
            var splash = this.index[blockNumber].steps[step][type][splashIndex];
            var object = this.getObjectBySplash(type, splash);
            if(!object) continue;
            splashes.push({splashType:splash.splashType, object:object});
        }    
        return splashes;
    };
}
