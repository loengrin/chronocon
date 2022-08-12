import  Time  from '../time.js'

describe("Moving timeObject with 4 timeObjectField", function() {
    var time = new Time();
    var timeObject1, timeObjectField1, timeObjectField2, timeObjectField3, timeObjectField4;
    var tofId1, tofId2, tofId3, tofId4;

    beforeEach(function() {
        time.init('month',{year:1941,month:4},{year:1945,month:5}); 
        timeObject1 = time.addTimeObject('TU1', {year:1942,month:4},{year:1944,month:4});    
        timeObjectField1 = timeObject1.addTimeObjectField('T1',{year:1942,month:4},'Subsegment1');    
        timeObjectField2 = timeObject1.addTimeObjectField('T1',{year:1942,month:10},'Subsegment2');    
        timeObjectField3 = timeObject1.addTimeObjectField('T1',{year:1943,month:4},'Subsegment3');    
        timeObjectField4 = timeObject1.addTimeObjectField('T1',{year:1943,month:10},'Subsegment4');    

        tofId1 = timeObjectField1.getId();
        tofId2 = timeObjectField2.getId();
        tofId3 = timeObjectField3.getId();
        tofId4 = timeObjectField4.getId();
    })
    
    it("add timeObject with 4 timeObjectField", function() {
        var rightData = {'12':[tofId1],'13':[tofId1],'14':[tofId1],'15':[tofId1],'16':[tofId1],'17':[tofId1], 
            '18':[tofId2],'19':[tofId2],'20':[tofId2],'21':[tofId2],'22':[tofId2],'23':[tofId2], 
            '24':[tofId3],'25':[tofId3],'26':[tofId3],'27':[tofId3],'28':[tofId3],'29':[tofId3], 
            '30':[tofId4],'31':[tofId4],'32':[tofId4],'33':[tofId4],'34':[tofId4],'35':[tofId4],'36':[tofId4]};

        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });
    
    it("increase TimeObject range", function() {
        timeObject1.move({year:1942,month:1},{year:1944,month:7});
        var rightData = {
            '9':[tofId1],'10':[tofId1],'11':[tofId1],
            '12':[tofId1],'13':[tofId1],'14':[tofId1],'15':[tofId1],'16':[tofId1],'17':[tofId1], 
            '18':[tofId2],'19':[tofId2],'20':[tofId2],'21':[tofId2],'22':[tofId2],'23':[tofId2], 
            '24':[tofId3],'25':[tofId3],'26':[tofId3],'27':[tofId3],'28':[tofId3],'29':[tofId3], 
            '30':[tofId4],'31':[tofId4],'32':[tofId4],'33':[tofId4],'34':[tofId4],'35':[tofId4],'36':[tofId4],
            '37':[tofId4],'38':[tofId4],'39':[tofId4]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });
    
    it("decrease TimeObject range", function() {   
        timeObject1.move({year:1943,month:3},{year:1944,month:1});
        var rightData = {
            '23':[tofId2], 
            '24':[tofId3],'25':[tofId3],'26':[tofId3],'27':[tofId3],'28':[tofId3],'29':[tofId3], 
            '30':[tofId4],'31':[tofId4],'32':[tofId4],'33':[tofId4]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });
   
    it("move TimeObject", function() {   
        timeObject1.move({year:1942,month:9},{year:1943,month:10});
        var rightData = {
            '17':[tofId1], '18':[tofId2], '19':[tofId2], '20':[tofId2], '21':[tofId2], '22':[tofId2], '23':[tofId2], 
            '24':[tofId3],'25':[tofId3],'26':[tofId3],'27':[tofId3],'28':[tofId3],'29':[tofId3], 
            '30':[tofId4]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });
       
    it("move TimeObject to end of Time", function() {  
        timeObject1.move({year:1944,month:10},{year:1945,month:5});
        var rightData = {'42':[tofId4], '43':[tofId4], '44':[tofId4], '45':[tofId4], '46':[tofId4], '47':[tofId4], '48':[tofId4], '49':[tofId4]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });   
});

