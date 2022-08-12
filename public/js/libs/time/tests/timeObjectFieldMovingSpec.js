import  Time  from '../time.js'

describe("Time object field moving", function() {
    var time = new Time();
    var timeObject1, timeObjectField1, timeObjectField2, tOfid1, tOfid2;

    beforeEach(function() {
        time.init('month',{year:1941,month:6}, {year:1945,month:5}); 
        timeObject1 = time.addTimeObject('TU1', {year:1944,month:3},{year:1944,month:9});
        timeObjectField1 = timeObject1.addTimeObjectField('T1',{year:1944,month:3},'Subsegment1');    
        timeObjectField2 = timeObject1.addTimeObjectField('T1',{year:1944,month:6},'Subsegment2'); 
        tOfid1 = timeObjectField1.getId();
        tOfid2 = timeObjectField2.getId();
    })
    
    it("fail to add timeObjectField on other timeObjectField", function() {
        expect( function(){ 
            timeObject1.addTimeObjectField('T1',{year:1944,month:6},'Subsegment1');    
        }).toThrow(new Error("add timeObjectField on other timeObjectField")); 
    });
    
    it("fail to move timeObjectField out of timeObject", function() {
        expect( function(){ 
            timeObject1.moveTimeObjectField(timeObjectField2.getId(),'T1',{year:1944,month:2});
        }).toThrow(new Error("move timeObjectField out of timeObject"));  
    });
    
    it("fail to mmove first timeObjectField", function() {
        expect( function(){ 
            timeObject1.moveTimeObjectField(timeObjectField1.getId(),'T1',{year:1944,month:8});
        }).toThrow(new Error("move first timeObjectField"));
    });
    
    it("fail to move timeObjectField on other timeObjectField", function() {
        expect( function(){ 
            timeObject1.moveTimeObjectField(timeObjectField2.getId(),'T1',{year:1944,month:3});
        }).toThrow(new Error("move timeObjectField on other timeObjectField")); 
    });
    
    it("Move second time object", function() {
        timeObject1.moveTimeObjectField(timeObjectField2.getId(),'T1',{year:1944,month:8});
        var rightData = {'33':[tOfid1],'34':[tOfid1],'35':[tOfid1],'36':[tOfid1],'37':[tOfid1],'38':[tOfid2],'39':[tOfid2]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });
    
    it("fail to delete first timeObjectField", function() {
        expect( function(){ 
            timeObject1.deleteTimeObjectField(timeObjectField1.getId(),'T1');
        }).toThrow(new Error("delete first timeObjectField"));
     
    });
    
    it("Delete secont timeObjectFiels", function() {
        timeObject1.deleteTimeObjectField(timeObjectField2.getId(),'T1');
        var rightData = {'33':[tOfid1],'34':[tOfid1],'35':[tOfid1],'36':[tOfid1],'37':[tOfid1],'38':[tOfid1],'39':[tOfid1]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });
});

