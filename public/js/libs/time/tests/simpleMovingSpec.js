import  Time  from '../time.js'

describe("Time object moving", function() {
    var time = new Time();
    var timeObject1, timeObjectField1, tOfid1;

    beforeEach(function() {
       time.init('month',{year:1941,month:6}, {year:1945,month:5}); 
       timeObject1 = time.addTimeObject('TU1', {year:1944,month:3},{year:1944,month:9});
       timeObjectField1 = timeObject1.addTimeObjectField('T1',{year:1944,month:3},'Subsegment1');    
       tOfid1 = timeObjectField1.getId();
    })
    
    it("fail to move time object with wrong date pair", function() {
        expect( function(){ 
            timeObject1.move({year:1945,month:9},{year:1944,month:8});  
        }).toThrow(new Error("move time object with wrong date pair"));      
    });
    
    it("fail to move time object out of timeline", function() {
        expect( function(){ 
            timeObject1.move({year:1943,month:9},{year:1945,month:6});  
        }).toThrow(new Error("move time object out of timeline"));   
    });
    
    it("move segment", function() {
        timeObject1.move({year:1943,month:9},{year:1944,month:8});  
        var rightData = {'27':[tOfid1],'28':[tOfid1],'29':[tOfid1],'30':[tOfid1],'31':[tOfid1],'32':[tOfid1],'33':[tOfid1],'34':[tOfid1],'35':[tOfid1],'36':[tOfid1],'37':[tOfid1],'38':[tOfid1]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });
    
    it("delete segment", function() {
        timeObject1.deleteObject();
        var rightData = {};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });
});
  
describe("Time moving", function() {
    var time = new Time();
    var timeObject1, timeObjectField1, tOfid1;

    beforeEach(function() {
        time.init('month',{year:1941,month:6}, {year:1945,month:5}); 
        timeObject1 = time.addTimeObject('TU1', {year:1943,month:9},{year:1944,month:8});
        timeObjectField1 = timeObject1.addTimeObjectField('T1',{year:1943,month:9},'Subsegment1');    
        tOfid1 = timeObjectField1.getId();
    })
    
    it("fail to move time on wrong date pair", function() {
        expect( function(){ 
            time.move({year:1946,month:10},{year:1946,month:9});  
        }).toThrow(new Error("move map on wrong date pair"));
    });
    
    it("move time", function() {
        time.move({year:1941,month:4},{year:1945,month:5});  
        var rightData = {'29':[tOfid1],'30':[tOfid1],'31':[tOfid1],'32':[tOfid1],'33':[tOfid1],'34':[tOfid1],'35':[tOfid1],'36':[tOfid1],'37':[tOfid1],'38':[tOfid1],'39':[tOfid1],'40':[tOfid1]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });  
});
