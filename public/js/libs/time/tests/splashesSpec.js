import  Time  from '../time.js'

describe("Time splashes", function() {
    var time = new Time();
    var timeObject1, timeObjectField1, tOfid1;

    beforeEach(function() {
        time.init('month',{year:1941,month:4},{year:1945,month:5}); 
        timeObject1 = time.addTimeObject('TU1', {year:1943,month:9},{year:1944,month:8});
        timeObjectField1 = timeObject1.addTimeObjectField('T1',{year:1943,month:9},'Subsegment1');    
        tOfid1 = timeObjectField1.getId();
    })
    
    it("time splashes", function() {
        //play
        var stepDump = {};
        var currentObjects = {};
        for(var step=0; step<time.getCountSteps();step++){
            var splashes = time.getStepSplashes(step,"T1");

            for(var i=0; i<splashes.length;i++){
                var splash = splashes[i];
                if(splash.splashType === 'create'){
                    currentObjects[splash.object.getId()] = splash.object;
                }
                else{
                    delete currentObjects[splash.object.getId()];
                }   
            }
            for(var currentObjectId in currentObjects){
                if(!stepDump[step]) {
                    stepDump[step] = [];
                }
                stepDump[step].push(currentObjects[currentObjectId].getId());
            }
        }  

        var rightData = {'29':[tOfid1],'30':[tOfid1],'31':[tOfid1],'32':[tOfid1],'33':[tOfid1],'34':[tOfid1],'35':[tOfid1],'36':[tOfid1],'37':[tOfid1],'38':[tOfid1],'39':[tOfid1],'40':[tOfid1]};
        expect(stepDump).toEqual(rightData);
    });
});