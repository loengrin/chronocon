import { LineOverlay } from '../../libs/map_api/line.js'
import { UnitMarker } from '../../libs/map_api/unit_marker.js'
import { ArmyOverlay } from '../../libs/map_api/army.js'
import { RegionOverlay } from '../../libs/map_api/region.js'
import { EventArrowOverlay } from '../../libs/map_api/event_arrow.js'
import { DateFormatter } from '../../libs/date_formatter';

/**
 * Class for creation unit on the map depend on type
 */
export class ObjectFactory {
    
    constructor(callbacks, editCallbacks) {
        this._callbacks = callbacks;
        this._editCallbacks = editCallbacks;
    }
    
    init(mapArea, armyWayService) {
        this._mapArea = mapArea;
        this._armyWayService = armyWayService;
    }

    getObjectByUnit(state, unit){
        var overlay;
        switch(unit.getType()){
            case 'city':  overlay = this._getCityOverlay(state, unit);break;
            case 'army':  overlay = this._getArmyOverlay(state, unit);break;
            case 'region':  overlay = this._getRegionOverlay(state, unit);break;
            case 'line':  overlay = this._getLineOverlay(state, unit);break;
            case 'fog': overlay = this._getFogOverlay(state, unit);break;
            case 'event':  overlay = this._getEventOverlay(state, unit);
        }
        if(!overlay) {
            return null;
        }
        this._bindCallbacks(overlay, unit);
        this._bindEditCallbacks(overlay, unit);
        return overlay;
    };

    _getCityOverlay(state, unit){
        var dynamicStyle = unit.getTimeObjectFieldContainsDate('dynamicStyle',state.currentDate).getValue();
        var staticStyle = unit.getField('staticStyle');
        return new UnitMarker({
            unitId: unit.getId(),
            point:unit.getField('point'),
            name: unit.getField('name'),
            size: unit.getField('size'),
            sizeMax: unit.getField('sizeMax'),
            showLabel: state.mapSettings.labels,
            hasLabel: staticStyle.hasLabel,

            icon: '/uploads/'+dynamicStyle.icon,
            color: dynamicStyle.color,
            mapArea: this._mapArea
        });
    };

    _getArmyOverlay(state, unit){
        if(!unit.getTimeObjectFieldContainsDate('dynamicStyle', state.currentDate)){
            console.log(unit);
        }
        var dynamicStyle = unit.getTimeObjectFieldContainsDate('dynamicStyle',state.currentDate).getValue();
        var staticStyle = unit.getField('staticStyle');

        var icon = typeof dynamicStyle.icon === 'object' ? "/uploads/"+dynamicStyle.icon.right  :
        "/uploads/"+dynamicStyle.icon;

        return new ArmyOverlay({
            unitId: unit.getId(),
         
            pointsWithDates: unit.getField('pointsWithDates'),
            name: unit.getField('name'),
            size: unit.getField('size'),
            sizeMax: unit.getField('sizeMax'),

            showLabel: state.mapSettings.labels,
            hasLabel: staticStyle.hasLabel,
            formatter: new DateFormatter(state.labels, state.lang, state.time.getCalendar().getMode()),
            armyWayService: this._armyWayService,
            icon:  icon,
            mapArea: this._mapArea
        });
    };

    _getRegionOverlay(state, unit){
        var staticStyle = unit.getField('staticStyle');
        var dynamicStyle = unit.getTimeObjectFieldContainsDate('dynamicStyle',state.currentDate).getValue();
        var dynamicTerritory = unit.getTimeObjectFieldContainsDate('dynamicTerritory',state.currentDate);

        return new RegionOverlay({
            polygons: dynamicTerritory.getValue().polygons,
            fieldId: dynamicTerritory.getId(),
            unitId: unit.getId(),

            labelPoint: dynamicTerritory.getValue().labelPoint,

            size: unit.getField('size'),
            sizeMax: unit.getField('sizeMax'),

            color :dynamicStyle.color,
            zIndex: staticStyle.zIndex ? staticStyle.zIndex : 3,
            strokeWeight: staticStyle.width,
            fillOpacity:dynamicStyle.opacity/100,
            hasLabel: staticStyle.hasLabel,

            name: unit.getField('name'),
            showLabel: state.mapSettings.labels,
            mapArea: this._mapArea,

        });
    };

    _getLineOverlay(state, unit){
        var staticStyle = unit.getField('staticStyle');
        var dynamicStyle = unit.getTimeObjectFieldContainsDate('dynamicStyle',state.currentDate).getValue();
        var dynamicTerritory = unit.getTimeObjectFieldContainsDate('dynamicTerritory',state.currentDate);

        return new LineOverlay({
            points: dynamicTerritory.getValue().points,
            branchs: dynamicTerritory.getValue().branchs,
            fieldId: dynamicTerritory.getId(),
            unitId: unit.getId(),

            labelPoint: dynamicTerritory.getValue().labelPoint,
            size: unit.getField('size'),
            sizeMax: unit.getField('sizeMax'),

            color:dynamicStyle.color,
            lineStyle:unit.getField('lineStyle'),
            width:staticStyle.width,
            fillOpacity:dynamicStyle.opacity/100,
            hasLabel: staticStyle.hasLabel,
            zIndex: staticStyle.zIndex ? staticStyle.zIndex : 4,

            name: unit.getField('name'),
            showLabel: state.mapSettings.labels,
            mapArea: this._mapArea,
        });
    };

    _getFogOverlay(state, unit){   
        var dynamicTerritory = unit.getTimeObjectFieldContainsDate('dynamicTerritory',state.currentDate);
        return new RegionOverlay({
            unitId: unit.getId(),
            fieldId: dynamicTerritory.getId(),
         
            polygons:unit.getTimeObjectFieldContainsDate('dynamicTerritory',state.currentDate).getValue().polygons,
            color : '#222',
            mouseOverFillColor: '#222',
            fillOpacity:0.9,
            strokeWeight: 0,
            zIndex: 100,
            mapArea: this._mapArea
        });
    };

    _getEventOverlay(state, unit){
        return new EventArrowOverlay({
            arrowPoint: unit.getField('arrowPoint'),
            unitId: unit.getId(),
            showLabel: state.mapSettings.infoboxes,
            name:unit.getField('name'),
            icon: unit.getField('icon'),
            mapArea: this._mapArea
        });
    };
    
    _bindCallbacks(overlay, unit) {
        var that = this;
        overlay.bind('click', function(){
            that._callbacks.unitClicked(unit);
        });
        overlay.bind('mouseover', function(unitId){
            that._callbacks.unitMouseOver(unitId);
        });
        overlay.bind('mouseout', function(){
            //console.log(unit);
            that._callbacks.unitMouseOut();
        });
        overlay.bind('rightclick', function(e){
            that._callbacks.unitRightClicked(unit, e.vertex, e.path);
        }); 
    }
    
    _bindEditCallbacks(overlay, unit) {
        var that = this;
        if(unit.getType() === 'city' || unit.getType() === 'event'){
            overlay.bind('drag',function(point){
                that._editCallbacks.mapUnitDrug(unit.getId(), null, point)
            });
        };
        if(unit.getType() === 'region' || unit.getType() === 'fog' || unit.getType() === 'line' || unit.getType() === 'army'){
            overlay.bind('movePoint',function(fieldId, path, vertex, point){
                that._editCallbacks.mapUnitPointMove(unit.getId(), fieldId, path, vertex, point);
            });
            overlay.bind('insertPoint',function(fieldId, path, vertex, point){
                that._editCallbacks.mapUnitPointInsert(unit.getId(), fieldId, path, vertex, point);
            });
            overlay.bind('deletePoint',function(fieldId, path, vertex){
                that._editCallbacks.mapUnitPointDelete(unit.getId(), fieldId, path, vertex);
            });
            overlay.bind('drag',function(fieldId, point){
                that._editCallbacks.mapUnitDrug(unit.getId(), fieldId, point)
            });
            overlay.bind('armyMovedToPoint', function(unitId, isInvisible){
                that._editCallbacks.armyMovedToPoint(unitId, isInvisible);
            });
        };
    }
}
