import CommonLib from '../libs/common/common_lib.js';
import { getMapCenterPolygonBorder, getMapCenterLine } from './unit_reducer';
import { ArmyWayService } from '../libs/army_way_service'


/**
 * Functions for actions on the map
 */

export const mapUnitDrug = (unitId, fieldId, point, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);
    
    if(unit.getType() == 'city') {
        unit.setField('point', point);
    }
    else if(unit.getType() == 'event') {
        unit.setField('arrowPoint', point);
        if( unit.getField('icon') == '/img/new/arrow_icon2.gif') {
            unit.setField('icon','/img/new/arrow_icon.gif');
        }
    }
    else {
        var territory = unit.getTimeObjectField('dynamicTerritory', fieldId).getValue();
        territory.labelPoint = point;
    }

    return {
        time:time,
        unit: unit
    }
}

export const mapUnitPointMove = (unitId, fieldId, path, vertex, point, state)  => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    if(unit.getType() == 'army'){
        var pointsWithDates = unit.getField('pointsWithDates')
        pointsWithDates[vertex].lat = point.lat;
        pointsWithDates[vertex].lng = point.lng;
    }
    else { 
        var territory = unit.getTimeObjectField('dynamicTerritory', fieldId).getValue();
        var field = unit.getType() == 'region' || unit.getType() == 'fog' ? 'polygons' : 'branchs';
        territory[field][path][vertex] = point;
        unit.getTimeObjectField('dynamicTerritory', fieldId).setValue(territory);
    }
    return time;
}

export const mapUnitPointInsert = (unitId, fieldId, path, vertex, point, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    if(unit.getType() == 'army'){
        var pointsWithDates = unit.getField('pointsWithDates')
        pointsWithDates.splice(vertex,0,point);
    }
    else {
        var territory = unit.getTimeObjectField('dynamicTerritory', fieldId).getValue();
        var field = unit.getType() == 'region' ||  unit.getType() == 'fog' ? 'polygons' : 'branchs';

        territory[field][path].splice(vertex, 0, point);
        unit.getTimeObjectField('dynamicTerritory', fieldId).setValue(territory);
    }
    return time;
}

export const mapUnitPointDelete = (unitId, fieldId, path, vertex, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);
    if(unit.getType() == 'army'){
        var pointsWithDates = unit.getField('pointsWithDates')
        pointsWithDates.splice(vertex, 1);
    }
    else {
        var territory = unit.getTimeObjectField('dynamicTerritory', fieldId).getValue();
        var field = unit.getType() == 'region' || unit.getType() == 'fog' ? 'polygons' : 'branchs';
        territory[field][path].splice(vertex, 1);
        unit.getTimeObjectField('dynamicTerritory', fieldId).setValue(territory);
    }
    return time;
}


export const deletePolygon = (unitId, path, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicTerritory',state.currentDate);
    timeObjectField.getValue().polygons.splice(path,1);

    return {
        time: time,
        unit: unit
    };
}

export const addPolygon = (unitId, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    var polygonBorder = getMapCenterPolygonBorder(state.mapState);
    var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicTerritory', state.currentDate);
    timeObjectField.getValue().polygons.push(polygonBorder);

    return {
        time: time,
        unit: unit
    };
}

export const deleteBranch = (unitId, path, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicTerritory',state.currentDate);
    timeObjectField.getValue().branchs.splice(path,1);

    return {
        time: time,
        unit: unit
    };
}

export const addBranch = (unitId, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    var branchPath = getMapCenterLine(state.mapState);
    var dynamicTerritory = unit.getTimeObjectFieldContainsDate('dynamicTerritory', state.currentDate).getValue();
    if(!dynamicTerritory.branchs){
        dynamicTerritory.branchs = [dynamicTerritory.points];
        delete dynamicTerritory.points;
    }
    dynamicTerritory.branchs.push(branchPath);
    return {
        time: time,
        unit: unit
    };
}

export const mapUnitArmyWayConnect = (unitId, vertex, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);
    var armyWayService = new ArmyWayService(state.time.getCalendar())
    

    var pointIndex = armyWayService.getPointIndex(unit.getField('pointsWithDates'), state.currentDate, state.time.getCalendar());
    bindArmyPoint(unit, pointIndex, vertex, state.currentDate, time.getCalendar());
    return {
        time: time,
        unit: unit
    };
}

export const mapUnitArmyWayDisconnectDate = (unitId, vertex, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    var armyWay = unit.getField('pointsWithDates');
    bindArmyPoint(unit, vertex, null, armyWay[vertex].date, time.getCalendar());

    return {
        time: time,
        unit: unit
    };
}

export const mapUnitArmyWayDisconnectDateTo = (unitId, vertex, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    var armyWay = unit.getField('pointsWithDates');
    bindArmyPoint(unit, vertex, null, armyWay[vertex].dateTo, time.getCalendar());

    return {
        time: time,
        unit: unit
    };
}

export const mapUnitArmyWaySetInvisible = (unitId, vertex, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);
    toggleInvisible(unit, vertex);

    return {
        time: time,
        unit: unit
    };
}

const bindArmyPoint = (unit, oldPointIndex, newPointIndex, date, calendar) => {
    var armyWay = unit.getField('pointsWithDates');
    var oldPoint = armyWay[oldPointIndex];
    var newPoint = armyWay[newPointIndex];
    var currentDate = CommonLib.clone(date);
    //unbind point
    if(oldPoint){
        if(oldPoint.dateTo && calendar.eQ(currentDate, oldPoint.dateTo)){
            if(calendar.eQ(oldPoint.date, oldPoint.dateTo))  delete oldPoint.date;
            delete oldPoint.dateTo;
        }
        else{
            if(oldPoint.dateTo){
                oldPoint.date =  oldPoint.dateTo;
                delete oldPoint.dateTo;
            }
            else{
                delete oldPoint.date;
            }
        }
    }
    if(newPoint){
        //bind point
        if(!newPoint.date){
            newPoint.date = currentDate;
        }
        else{
            if(calendar.compareDates(currentDate, newPoint.date)===1){
                newPoint.dateTo = currentDate;
            }
            else{
                newPoint.dateTo = newPoint.date;
                newPoint.date = currentDate;
            }
        }
    }
}

const toggleInvisible = (unit, pointIndex) => {
    var armyWay = unit.getField('pointsWithDates');
    if(!armyWay[pointIndex].invisible){
        armyWay[pointIndex].invisible = true;
    }
    else{
        delete armyWay[pointIndex]['invisible'];
    }
};






