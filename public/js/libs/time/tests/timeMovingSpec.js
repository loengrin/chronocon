import  Time  from '../time.js'

describe("Moving time with 2 timeObjects with 4 timeObjectField each", function() {
    var time = new Time();
    var timeObject1, timeObject2;
    var timeObjectField1, timeObjectField2, timeObjectField3, timeObjectField4;
    var timeObjectField21, timeObjectField22, timeObjectField23, timeObjectField24;
    var tofId1, tofId2, tofId3, tofId4;
    var tofId21, tofId22, tofId23, tofId24;

    beforeEach(function() {
        time.init('month',{year:1941,month:4},{year:1945,month:5}); 
        
        timeObject1 = time.addTimeObject('TU1', {year:1942,month:4},{year:1944,month:4});
      
        timeObjectField1 = timeObject1.addTimeObjectField('T1',{year:1942,month:4},'Subsegment1');    
        timeObjectField2 = timeObject1.addTimeObjectField('T1',{year:1942,month:10},'Subsegment2');    
        timeObjectField3 = timeObject1.addTimeObjectField('T1',{year:1943,month:4},'Subsegment3');    
        timeObjectField4 = timeObject1.addTimeObjectField('T1',{year:1943,month:10},'Subsegment4');    
        timeObject1.move({year:1944,month:10},{year:1945,month:5});
      
        tofId1 = timeObjectField1.getId();
        tofId2 = timeObjectField2.getId();
        tofId3 = timeObjectField3.getId();
        tofId4 = timeObjectField4.getId();
        
        timeObject2 = time.addTimeObject('TU1', {year:1941,month:4},{year:1943,month:4});    
        timeObjectField21 = timeObject2.addTimeObjectField('T1',{year:1941,month:4},'Subsegment1');    
        timeObjectField22 = timeObject2.addTimeObjectField('T1',{year:1941,month:10},'Subsegment2');    
        timeObjectField23 = timeObject2.addTimeObjectField('T1',{year:1942,month:4},'Subsegment3');    
        timeObjectField24 = timeObject2.addTimeObjectField('T1',{year:1942,month:10},'Subsegment4');    

        tofId21 = timeObjectField21.getId();
        tofId22 = timeObjectField22.getId();
        tofId23 = timeObjectField23.getId();
        tofId24 = timeObjectField24.getId();
    })
    
    it("add timeObject with 4 timeObjectField", function() {
        var rightData = {'0':[tofId21],'1':[tofId21],'2':[tofId21],'3':[tofId21],'4':[tofId21],'5':[tofId21], 
            '6':[tofId22],'7':[tofId22],'8':[tofId22],'9':[tofId22],'10':[tofId22],'11':[tofId22], 
            '12':[tofId23],'13':[tofId23],'14':[tofId23],'15':[tofId23],'16':[tofId23],'17':[tofId23], 
            '18':[tofId24],'19':[tofId24],'20':[tofId24],'21':[tofId24],'22':[tofId24],'23':[tofId24],'24':[tofId24],
            '42':[tofId4], '43':[tofId4], '44':[tofId4], '45':[tofId4], '46':[tofId4], '47':[tofId4], '48':[tofId4], '49':[tofId4]
            };
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    });
    
    
    it("increase time", function() {
        time.move({year:1941,month:1},{year:1945,month:8}); 
        var rightData = {'0':[tofId21],'1':[tofId21],'2':[tofId21],'3':[tofId21],'4':[tofId21],'5':[tofId21], 
                        '6':[tofId21],'7':[tofId21],'8':[tofId21],'9':[tofId22],'10':[tofId22],'11':[tofId22], 
                        '12':[tofId22],'13':[tofId22],'14':[tofId22],'15':[tofId23],'16':[tofId23],'17':[tofId23], 
                        '18':[tofId23],'19':[tofId23],'20':[tofId23],'21':[tofId24],'22':[tofId24],'23':[tofId24],'24':[tofId24],'25':[tofId24],'26':[tofId24],'27':[tofId24],
                        '45':[tofId4], '46':[tofId4], '47':[tofId4], '48':[tofId4], '49':[tofId4],
                        '50':[tofId4], '51':[tofId4], '52':[tofId4], '53':[tofId4], '54':[tofId4], '55':[tofId4]};
       expect(time.getStepsDump('T1', true)).toEqual(rightData);
      
    });
    
    it("decrease time", function() {
        time.move({year:1942,month:3},{year:1944,month:8}); 
        var rightData = {'0':[tofId22],'1':[tofId23],'2':[tofId23],'3':[tofId23], '4':[tofId23],'5':[tofId23],'6':[tofId23],'7':[tofId24],'8':[tofId24],'9':[tofId24],'10':[tofId24],
            '11':[tofId24],'12':[tofId24],'13':[tofId24]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    })
    
    it("shift time", function() {
        time.move({year:1942,month:3},{year:1944,month:8}); 
        time.move({year:1942,month:7},{year:1945,month:4}); 
        var rightData = {'0':[tofId23],'1':[tofId23],'2':[tofId23],'3':[tofId24], '4':[tofId24],'5':[tofId24],'6':[tofId24],'7':[tofId24],'8':[tofId24],'9':[tofId24]};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    })
    
    it("move time", function() {
        time.move({year:1942,month:3},{year:1944,month:8}); 
        time.move({year:1942,month:7},{year:1945,month:4});    
        time.move({year:1941,month:3},{year:1941,month:10}); 
        var rightData = {};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    })
    
    it("move time (steps equal count steps in block) ", function() {
        time.move({year:1942,month:3},{year:1944,month:8}); 
        time.move({year:1942,month:7},{year:1945,month:4}); 
        time.move({year:1941,month:3},{year:1941,month:10});  
        time.move({year:1941,month:3},{year:1943,month:2}); 
        var rightData = {};
        expect(time.getStepsDump('T1', true)).toEqual(rightData);
    })
});

  
  
  

 