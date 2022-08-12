import CommonLib from '../../libs/common/common_lib.js';

/**
  Class for managing current time step changes on the map
*/
export class RewindManager {
    constructor(overlayStorage, visibilityStorage) {
        this._visibilityStorage = visibilityStorage;  
        this._overlayStorage = overlayStorage;  
    }

    rewind(state, newStep, oldStep){
        if(oldStep !== null && newStep === oldStep + 1){
            this._processSplashes(state, newStep, false);
        }
        else if(oldStep !== null && newStep === oldStep - 1){
            this._processSplashes(state, oldStep, true);
        }
        else{
            this._goToStep(state, newStep);
        }
    }
    
    refresh(state, newStep) {
        this._goToStep(state, newStep);
    }

    _goToStep(state, step){
        this._clear();
        var objects;
        var objectTypes = {'city':1,'army':1,'region':1,'line':1,'fog':1,'event':1};
        if(!state.mapSettings.fog) delete objectTypes['fog'];
        if(!state.mapSettings.icons) {
            delete objectTypes['city'];
            delete objectTypes['army'];
        }
        for(var objectType in objectTypes){
            objects = state.time.getStepObjects(step, objectType);

            for(var i=0;i<objects.length;i++){
                this._makeUnitVisible(state, objects[i], step);
            }
        }
    };

    _clear(){
        for(var overlayType in this._overlayStorage.getOverlayTypes()) {
            var overlays = this._overlayStorage.getOverlaysByType(overlayType);
            for(var i=0; i < overlays.length; i++){
                this._visibilityStorage.setVisibilityFlag(overlayType, overlays[i].getId(), 'date', false)
            }
        }
    };

    _makeUnitVisible(state, unit, step){
        var that = this;
        if(!unit) return;
        var overlay =  this._overlayStorage.getOverlay(unit.getType(), unit.getId());

        if(!overlay){
            overlay = this._overlayStorage.createOverlay(state, unit);
       
            if(!overlay) {
                return;
            }
            if(unit.getType() == 'event') {
                 this._visibilityStorage.setVisibilityFlag(unit.getType(), unit.getId(), 'event', false);
            }
        }
        else{
            var date = state.time.getCalendar().getDateByStep(step);
            if (unit.getType() == 'line' || unit.getType() == 'region'|| unit.getType() == 'city'|| unit.getType() == 'army'){
                var dynamicStyleParamValue = unit.getTimeObjectFieldContainsDate('dynamicStyle',date).getValue();
                that._setDynamicStyle(unit.getType(),overlay,dynamicStyleParamValue);
            }
            if (unit.getType() == 'line' || unit.getType() == 'region' || unit.getType() == 'fog'){
                var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicTerritory',date);
                overlay.setBorders(timeObjectField.getValue(), timeObjectField.getId());
            }
        }
        
        this._visibilityStorage.setVisibilityFlag(unit.getType(), unit.getId(), 'date', true)
             
        return overlay;
    };


    _setDynamicStyle(type, overlay, dynamicStyle){
        if(type === 'city' || type === 'army'){
            var icon = typeof dynamicStyle.icon === 'object' ?
                {left: "/uploads/"+dynamicStyle.icon.left, right: "/uploads/"+dynamicStyle.icon.right } :
                "/uploads/"+dynamicStyle.icon;
            overlay.setIcon(icon);
        }
        if(type === 'line' || type === 'region'){
            overlay.setColor(dynamicStyle.color);
            if(overlay.setOpacity != undefined){
                overlay.setOpacity(dynamicStyle.opacity/100);
            }
       }
    };

  

    _processSplashes(state, step, playBack){
        var splashes;
        var objectTypes = {'city':1,'army':1,'region':1,'line':1,'fog':1,'event':1};

        if(!state.mapSettings.fog) delete objectTypes['fog'];
        if(!state.mapSettings.icons) {
            delete objectTypes['city'];
            delete objectTypes['army'];
        }

        for(var objectType in objectTypes){
            splashes = state.time.getStepSplashes(step, objectType);
           for(var i = 0; i < splashes.length; i++){
                var splash = splashes[i];
                var paramsStep = playBack ? step-1 : step;
                CommonLib.XOR(splash.splashType === 'create', playBack) ?
                    this._makeUnitVisible(state, splash.object, paramsStep) :
                    this._makeUnitInvisible(splash.object);
            }
        }

        var fieldTypes = {'dynamicTable':1,'dynamicTerritory':1,'dynamicStyle':1};
        for(var fieldType in fieldTypes){
            splashes = state.time.getStepSplashes(step, fieldType);
            for(var i = 0; i < splashes.length; i++){
                var splash = splashes[i];
                if(!CommonLib.XOR(splash.splashType === 'create', playBack)) continue;
                var unit = splash.object.getTimeObject();
                var overlay = this._overlayStorage.getOverlay(unit.getType(), unit.getId());

                if(fieldType === 'dynamicTerritory') {
                    overlay.setBorders(splash.object.getValue(),splash.object.getId());
                }
                if(fieldType === 'dynamicStyle') {
                    this._setDynamicStyle(unit.getType(),overlay,splash.object.getValue());
                }
            }
        }
    };
    
    _makeUnitInvisible(object){
        this._visibilityStorage.setVisibilityFlag(object.getType(), object.getId(), 'date', false);
    };
}
