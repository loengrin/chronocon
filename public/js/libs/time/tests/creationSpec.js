import  Time  from '../time.js'

describe("Time creation", function() {
    var time = new Time();

    it("fail to create time", function() {    
         expect( function(){ 
             time.init('month',{year:1948,month:6}, {year:1945,month:5});
         }).toThrow(new Error("init map with wrong date pair"));
    });
    
    it("create empty time", function() {
       time.init('month',{year:1941,month:6}, {year:1945,month:5}); 
       expect(time.getCountSteps()).toBe(48);
    });
});

describe("Time object creation", function() {
    var time = new Time();

    beforeEach(function() {
       time.init('month',{year:1941,month:6}, {year:1945,month:5}); 
    })

    it("fail to add time object", function() {
       expect( function(){ 
            time.addTimeObject('TU1', {year:1848,month:3},{year:1944,month:9});
       }).toThrow(new Error("add time object out of timeline"));
    });
    
    it("add time object", function() {
        time.init('month',{year:1941,month:6}, {year:1945,month:5}); 
        var timeObject1 = time.addTimeObject('TU1', {year:1944,month:3},{year:1944,month:9});
  
        var tOid = timeObject1.getId();
        var rightData = {'33':[tOid],'34':[tOid],'35':[tOid],'36':[tOid],'37':[tOid],'38':[tOid],'39':[tOid]};
        expect(time.getStepsDump('TU1', true)).toEqual(rightData);
    });
});


describe("Time object field creation", function() {
    var time = new Time();
    var timeObject1;

    beforeEach(function() {
       time.init('month',{year:1941,month:6}, {year:1945,month:5}); 
       timeObject1 = time.addTimeObject('TU1', {year:1944,month:3},{year:1944,month:9});
  
    })

    it("fail to add time object field", function() {
       expect( function(){ 
            timeObject1.addTimeObjectField('T1',{year:1944,month:2},'Subsegment1'); 
       }).toThrow(new Error("add timeObjectField out of timeObject"));
    });
    
    it("fail to add time object field", function() {
        expect( function(){ 
             timeObject1.addTimeObjectField('T1',{year:1944,month:4},'Subsegment1');  
        }).toThrow(new Error("add first timeObjectField not in begin"));
    });
    
    it("add time object fields", function() {
        var timeObjectField1 = timeObject1.addTimeObjectField('T1',{year:1944,month:3},'Subsegment1');    
        var tOfid1 = timeObjectField1.getId();
        var rightData = {'33':[tOfid1],'34':[tOfid1],'35':[tOfid1],'36':[tOfid1],'37':[tOfid1],'38':[tOfid1],'39':[tOfid1]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
        
        var timeObjectField2 = timeObject1.addTimeObjectField('T1',{year:1944,month:6},'Subsegment2'); 
        var tOfid2 = timeObjectField2.getId();
        var rightData = {'33':[tOfid1],'34':[tOfid1],'35':[tOfid1],'36':[tOfid2],'37':[tOfid2],'38':[tOfid2],'39':[tOfid2]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });
});

