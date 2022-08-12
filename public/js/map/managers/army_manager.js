/**
  Class for managing movable units on the map
*/

export class ArmyManager {
  
    constructor(overlayStorage, visibilityStorage) {
        this._visibilityStorage = visibilityStorage;  
        this._overlayStorage = overlayStorage;  
        this._editMode = false;
    }
    
    init(mapArea, armyWayService) {
        this._armyWayService = armyWayService;
        this._mapArea = mapArea;   
    }

    moveArmys(time, step, fraction){
        var units = time.getStepObjects(step, 'army');
        for(var i=0;i<units.length;i++){
            this._moveArmy(units[i], step, fraction,  time.getCalendar());
        }
    };
    
    _moveToArmyPoint(unit, isInvisible) {
        this._visibilityStorage.setVisibilityFlag('army', unit.getId(), 'point', !isInvisible || this._editMode);
        var overlay = this._overlayStorage.getOverlay('army', unit.getId());
        var name = isInvisible && this._editMode ? unit.getField('name')+'('+'HIDDEN'+')' :  unit.getField('name')
        overlay.setName(name);
    }
    
    _moveArmy(unit, step, fraction, calendar){    
        var overlay = this._overlayStorage.getOverlay('army', unit.getId());
        var armyWay = unit.getField('pointsWithDates');
    
   
        var pointAndDirection = this._armyWayService.getPointAndDirection(armyWay, step, fraction);
        if(!pointAndDirection) {
            return;
        }
        var gmapPoints = this._mapArea.convertPoints([pointAndDirection.point]);
     
        this._rotateIcon(unit, overlay, pointAndDirection.direction, calendar.getDateByStep(step));
        overlay.move(gmapPoints[0]);
        if(!fraction) {
            var sectionStartPoint = armyWay[pointAndDirection.section.startIndex];
     
            var inInvisibleCamp =  sectionStartPoint.invisible && 
                    pointAndDirection.section.startIndex === pointAndDirection.section.endIndex;
            var inInvisiblePoint = sectionStartPoint.invisible && !fraction && 
              step === calendar.getStepByDate(sectionStartPoint.date);  
            var invisible = inInvisibleCamp || inInvisiblePoint;
            this._moveToArmyPoint(unit, invisible);
        }
    };
    
    _rotateIcon(unit, overlay, direction, currentDate){
        var dynamicStyle = unit.getTimeObjectFieldContainsDate('dynamicStyle',currentDate).getValue();
     
        if(typeof dynamicStyle.icon !== 'object') return;
        if(direction === 'stop') return;
        overlay.setIcon(direction === 'left' ? "/uploads/"+dynamicStyle.icon.left : "/uploads/"+dynamicStyle.icon.right);
    };

    setEditMode(editMode) {
        this._editMode = editMode;
    }

}
