import CommonLib from '../libs/common/common_lib.js';

/**
 * Functions for actions with units
 */

export const saveUnit = (oldUnit, isNew, fields, state) => {
    var that = this;
    var currentDate =  state.currentDate;
    var time = state.time.getCopy();

    var event = fields['eventId'] && time.getTimeObjectById(fields['eventId']);
    var dateBegin =  event ? event.getDateBegin() : fields['dateBegin'];
    var dateEnd =  event ? event.getDateEnd() : fields['dateEnd'];
    var unit;
    if(isNew){
        unit = time.addTimeObject(fields['type'], dateBegin, dateEnd);
        addNewUnitFields(unit, state.mapState);
    }
    else{
        unit = time.getTimeObjectById(oldUnit.getId());
        unit.move(dateBegin, dateEnd);
        if(unit.getType() === 'army'){
            changeArmyWayBeginAndEnd(unit, time, state.mapState.mapFrame);
        }
    }
    if(!isNew && (fields['type'] === 'region' || fields['type'] === 'line')){
        var oldHasLabel = unit.getField('staticStyle').hasLabel;
    }
    unit.setField('eventId',fields['eventId']);
    unit.setField('name',fields['name']);
    unit.setField('size',fields['size']);
    unit.setField('sizeMax',fields['sizeMax']);

    unit.setField('comments', fields['comments']);
    unit.setField('sources', fields['sources']);
    unit.setField('progress', fields['progress']);
    unit.setField('needHelp', fields['needHelp']);

       
    if(unit.getType() === 'region' || unit.getType() === 'line'){
        var staticStyle = {'width':fields['width'],'hasLabel':fields['hasLabel'],'zIndex':fields['zIndex']};
        unit.setField('staticStyle',staticStyle);
        if(fields['hasLabel'] && !oldHasLabel){
            unit.setField('labelPoint', getPolygonCenter(unit, currentDate));
        }
    }

    if(unit.getType() ==='city' || unit.getType() ==='army') {
        var staticStyle = {'hasLabel':fields['hasLabel']};
        unit.setField('staticStyle',staticStyle);
    }

    if(unit.getType() ==='line') {
        unit.setField('lineStyle',fields['lineStyle']);
    }

    if((unit.getType() ==='city' || unit.getType() ==='army') && isNew) {
        unit.addTimeObjectField('dynamicStyle', unit.getDateBegin(), {icon:fields['icon']});
    }

    if((unit.getType() === 'region' || unit.getType() === 'line') && isNew){
        unit.addTimeObjectField('dynamicStyle', unit.getDateBegin(), {'color':fields['color'],'opacity':fields['opacity']});
    }
    return {
        time: time,
        unit: unit
    };
};

/**
 * Change begin and end dates of army way. It have to be equal to TimeObject dates
 */
export const changeArmyWayBeginAndEnd = (army, time, mapFrame) =>{
    var armyWay = army.getField('pointsWithDates');
    armyWay[0].date = CommonLib.clone(army.getDateBegin());
    if(armyWay[0].dateTo && time.calendar.eQ(armyWay[0].date, armyWay[0].dateTo)){
        delete armyWay[0].dateTo;
    };

    //set only one points
    if(time.calendar.eQ(army.getDateBegin(),army.getDateEnd()) && armyWay.length !== 1){
        armyWay.splice(1,armyWay.length-1);
        return;
    }
    //set second point, if before only one
    if(time.calendar.nE(army.getDateBegin(),army.getDateEnd()) && armyWay.length === 1){
        var size = mapFrame.height/6;
        armyWay.push({lat:(armyWay[0].lat+size),lng:(armyWay[0].lng+size),date: CommonLib.clone(army.getDateEnd())});
        return;
    }

    //delete point not in new borders
    for(var i=1;i<armyWay.length; i++){
        if(armyWay[i].date && (time.calendar.lT(armyWay[i].date,army.getDateBegin()) ||
            time.calendar.gT(armyWay[i].date,army.getDateEnd()))
        ){
            delete armyWay[i].date;
        }
        if(armyWay[i].dateTo && (time.calendar.lT(armyWay[i].dateTo,army.getDateBegin()) ||
            time.calendar.gT(armyWay[i].dateTo,army.getDateEnd()))
        ){
            delete armyWay[i].dateTo;
        }
    }
    if(armyWay[armyWay.length-1].dateTo){
        armyWay[armyWay.length-1].dateTo = CommonLib.clone(army.getDateEnd());
    }
    else{
        armyWay[armyWay.length-1].date = CommonLib.clone(army.getDateEnd());
    }

    if(armyWay[armyWay.length-1].dateTo && time.calendar.eQ(armyWay[armyWay.length-1].date, armyWay[armyWay.length-1].dateTo)){
        delete armyWay[armyWay.length-1].dateTo;
    };
  
};

/**
 * Initialize new unit by default values
 */
const addNewUnitFields = (unit, mapState) => {

    var size = mapState.mapFrame.height/6;
    var mapCenter = mapState.mapCenter;

    unit.addTimeObjectField('dynamicTable', unit.getDateBegin(), _getDefaultDynamicTable());

    if(unit.getType() === 'region'){
        unit.addTimeObjectField('dynamicTerritory', unit.getDateBegin(), {
            polygons:[getMapCenterPolygonBorder(mapState)],
            labelPoint:mapCenter
        });
    }
    if(unit.getType() === 'line'){
        unit.addTimeObjectField('dynamicTerritory', unit.getDateBegin(), {
            branchs:[[
                {lat:mapCenter.lat,lng:mapCenter.lng},
                {lat:(mapCenter.lat+size),lng:(mapCenter.lng+size)}
            ]],
            labelPoint:mapCenter
        });
    }
    if(unit.getType() === 'army'){
        unit.setField('pointsWithDates',[
            {lat:mapCenter.lat,lng:mapCenter.lng, date: unit.getDateBegin()},
            {lat:(mapCenter.lat+size),lng:(mapCenter.lng+size), date: unit.getDateEnd()}
        ]);
    }
    if(unit.getType() === 'city'){
        unit.setField('point',{lat:mapCenter.lat, lng:mapCenter.lng});
    }
};

const getPolygonCenter = (unit, date) => {
    var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicTerritory', date);
    var points = unit.getType() ==='line' ?
        (timeObjectField.getValue().branchs ? timeObjectField.getValue().branchs[0] : timeObjectField.getValue().points) :
        timeObjectField.getValue().polygons[0];
    var sumLat = 0;
    var sumLng = 0;
    for(var i=0;i<points.length;i++){
        sumLat += points[i].lat;
        sumLng += points[i].lng;
    }
    return {lat:(sumLat/points.length),lng:(sumLng/points.length)};
};

export const getMapCenterPolygonBorder = (mapState) => {
    var size = mapState.mapFrame.height/6;
    var mapCenter = mapState.mapCenter;
    return [{lat:(mapCenter.lat+size),lng:(mapCenter.lng+size)},
        {lat:(mapCenter.lat-size),lng:(mapCenter.lng+size)},
        {lat:(mapCenter.lat-size),lng:(mapCenter.lng-size)},
        {lat:(mapCenter.lat+size),lng:(mapCenter.lng-size)}];
};

export const saveUnitCoordinates =(oldUnit, coordinates, segmentNumber, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(oldUnit.getId());

    var territoryValue = unit.getTimeObjectFieldContainsDate('dynamicTerritory',state.currentDate).getValue();
    var field = unit.getType() == 'region' ? 'polygons' : 'branchs';
    if(segmentNumber !== undefined){
        territoryValue[field][segmentNumber] = coordinates;
    }
    else{
        territoryValue[field] = coordinates;
    }
    return {
        time: time,
        unit: unit
    };
}

export const deleteUnit = (oldUnit, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(oldUnit.getId());
    unit.deleteObject();
    return time;
}

export const copyUnit = (oldUnit, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(oldUnit.getId());
    var unitCopy = unit.getCopy(oldUnit.getField('name') + " ("+state.labels['Copy']+")");
    return {
        time: time,
        unit: unitCopy
    };
}

export const saveDynamicStyle =(oldUnit, isNew, style, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(oldUnit.getId());

    if(isNew){
        unit.addTimeObjectField('dynamicStyle', state.currentDate, style);
    }
    else{
        var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicStyle',state.currentDate);
        timeObjectField.setValue(style);
    }
    return {
        time: time,
        unit: unit
    };;
}

export const deleteDynamicStyle =(oldUnit, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(oldUnit.getId());

    var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicStyle',state.currentDate);
    unit.deleteTimeObjectField(timeObjectField.getId(), 'dynamicStyle');

    return {
        time: time,
        unit: unit
    };;
}

const _getDefaultDynamicTable = function(){
    return [];
};

export const saveDescription = (unitId, isNew, isStatic, dynamicDescriptionId, fields, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);
    if(isStatic){
        unit.setField('article', fields['article']);
        unit.setField('image', fields['image']);
    }
    else {
        if (isNew) {
            unit.addTimeObjectField('dynamicDescription', state.currentDate, fields['article']);
        }
        else {
            if(dynamicDescriptionId){
                var timeObjectField = unit.getTimeObjectField('dynamicDescription', dynamicDescriptionId);
                timeObjectField.setValue(fields['article']);
            }
            else {
                unit.addTimeObjectField('dynamicDescription', unit.getDateBegin(), fields['article']);
            }
        }
    }
    
    return {
        time: time,
        unit: unit
    };;
}

export const deleteDescription = (unitId, dynamicDescriptionId, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    unit.deleteTimeObjectField(dynamicDescriptionId, 'dynamicDescription');
    
    return {
        time: time,
        unit: unit
    };
}

export const saveTable = (unitId,  isNew, isStatic, dynamicTableId, fields, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    if(isStatic){
        unit.setField('staticTable', fields['table']);
    }
    else {
        if (isNew) {
            unit.addTimeObjectField('dynamicTable', state.currentDate, fields['table']);
        }
        else {
            var timeObjectField = unit.getTimeObjectField('dynamicTable', dynamicTableId);
            timeObjectField.setValue(fields['table']);    
        }
    }
    return {
        time: time,
        unit: unit
    };
}

export const deleteTable = (unitId, dynamicTableId, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);
    unit.deleteTimeObjectField(dynamicTableId, 'dynamicTable');
    
    return {
        time: time,
        unit: unit
    };
}

export const getMapCenterOnUnit = (unit, date) =>{
    var point;
    if(unit.getType() === 'city'){
        point = unit.getField('point');
    }
    if(unit.getType() === 'region' || unit.getType() === 'line'){
        point = getPolygonCenter(unit, date);
    }
    if(unit.getType() === 'army'){
        point = unit.getField('pointsWithDates')[0];
    }
    return point;
};

export const getMapCenterLine = (mapState) =>{
    var size = mapState.mapFrame.height/6;
    var mapCenter = mapState.mapCenter;
    return [
        {lat:mapCenter.lat,lng:mapCenter.lng},
        {lat:(mapCenter.lat+size),lng:(mapCenter.lng+size)}
    ];
};

export const saveDynamicTerritory = (unitId, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicTerritory',state.currentDate);
    unit.addTimeObjectField('dynamicTerritory', state.currentDate, CommonLib.clone(timeObjectField.getValue()));
    return {
        time: time,
        unit: unit
    };;
}

export const deleteDynamicTerritory = (unitId, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);

    var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicTerritory',state.currentDate);
    unit.deleteTimeObjectField(timeObjectField.getId(), 'dynamicTerritory');

    return {
        time: time,
        unit: unit
    };;
}

