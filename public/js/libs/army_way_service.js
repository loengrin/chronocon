
/**
 * Class for detecting army coordinates depend on date
 */
export class ArmyWayService
{
    constructor(calendar) {
        this._calendar = calendar;
    }
    
    getPointIndex(armyWay, currentDate){
      for(var i=0; i<armyWay.length; i++){
        var point = armyWay[i];
        if(!point.date) continue;
        if(this._calendar.eQ(currentDate, point.date)){
         return i;
        }
        if(!point.dateTo) continue;
        if(this._calendar.eQ(currentDate, point.dateTo)){
         return i;
        }     
      }
      return null;
    };
    
    getPointAndDirection(armyWay, step, fraction){
        var realStep = step+(fraction ? fraction : 0);
        var section = this._detectSectionOfWay(armyWay,realStep);
        if(!section){    
          return;
        }
        var pointAndDirection = this._getPointAndDirectionOfSection(armyWay, section, realStep);

        return {
            point: pointAndDirection.point,
            direction: pointAndDirection.direction,
            section:section
        }
    };
    
    _getPointAndDirectionOfSection(armyWay, section, step){
        var point = armyWay[section.startIndex];

        if(section.startIndex === section.endIndex ){   
            return {point:point, direction:'stop'};
        }
        var startDate = point.dateTo ? point.dateTo : point.date;
        var firstStep = this._calendar.getStepByDate(startDate);    
        var lastStep = this._calendar.getStepByDate(armyWay[section.endIndex].date);

        var points = [];
        for(var index = section.startIndex;index <= section.endIndex;index++){
            points.push(armyWay[index]);
        }
        return this._getPointAndDirectionOfLine(firstStep, lastStep, step, points);
    };

    _detectSectionOfWay(pointsWithDates,step){  
        var lastStep = this._calendar.getStepByDate(pointsWithDates[pointsWithDates.length-1].date);
        if(step===lastStep){
            return {'startIndex':(pointsWithDates.length-1),'endIndex':(pointsWithDates.length-1)}; 
        }

        var prevDateIndex = 0;  
        var pointStep, prevPointStep;
        pointStep = this._calendar.getStepByDate(pointsWithDates[0].date);

        for(var i=0;i<pointsWithDates.length;i++){
            if(pointsWithDates[i].date){
                prevPointStep = pointStep;       
                pointStep = this._calendar.getStepByDate(pointsWithDates[i].date);

                if(step >= prevPointStep && step < pointStep){
                    return {'startIndex':prevDateIndex,'endIndex':i};
                }        
                if(pointsWithDates[i].dateTo){
                    prevPointStep = pointStep;
                    pointStep = this._calendar.getStepByDate(pointsWithDates[i].dateTo);
                    if(step >= prevPointStep && step <= pointStep){
                        return {'startIndex':i,'endIndex':i};
                    }
                }
                prevDateIndex = i;        
            }
        }
    };

    _getPointAndDirectionOfLine(firstStep, lastStep, step, points){
        var k = (step - firstStep)/(lastStep - firstStep);

        var allPath = 0;
        for(var i=1;i<points.length;i++){
            allPath = allPath + this._getLineLength(points[i-1], points[i]);
        }
        var rightPath = k * allPath;

        var curS = 0;
        for(var i=1;i<points.length;i++){
            var length = this._getLineLength(points[i-1], points[i]);
            if(curS+length >= rightPath && curS <= rightPath){        
                var k2 = (rightPath-curS)/length;
                var point = this._getPointOnLine(points[i-1],points[i],k2);
                var direction = points[i].lng > points[i-1].lng ? 'right' :
                        (points[i].lng < points[i-1].lng ? 'left' : 'stop'); 
                return {point:point, direction:direction};
            }
            else{
                curS = curS+length;
            }
        } 
    };
    
    _getPointOnLine(point1, point2, k){  
        var lat = point1.lat+(point2.lat-point1.lat)*k;
        var lng = point1.lng+(point2.lng-point1.lng)*k;
        return {lat:lat,lng:lng};
    };
    
     _getLineLength(point1, point2){
        return Math.sqrt((point1.lat-point2.lat)*(point1.lat-point2.lat)+(point1.lng-point2.lng)*(point1.lng-point2.lng));
    };
}