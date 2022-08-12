/**
 * Class container for unit overlays
 */

export class OverlayStorage {
    constructor(objectFactory) {
       this._overlays = {};
       this._objectFactory = objectFactory;
    }

    getOverlay(overlayType, id){
        if(!this._overlays[overlayType]){
            return null;
        }
        if(!this._overlays[overlayType][id]){
            return null;
        }
        return this._overlays[overlayType][id];
    };

    getOverlaysByType(overlayType){
        if(!this._overlays[overlayType]) return [];
        var resultOverlays = [];
        for(var overlayId in this._overlays[overlayType]){
            var overlay = this._overlays[overlayType][overlayId];
            resultOverlays.push(overlay);
        }
        return resultOverlays;
    };
    
    getOverlayTypes() {
        var objectTypes = {};
        for(var overlayType in this._overlays){
           objectTypes[overlayType]=1;
        }
        return objectTypes;
    }

    getAllOverlays(){
        var resultOverlays = [];
        for(var overlayType in this._overlays){
            for(var overlayId in this._overlays[overlayType]){
                resultOverlays.push(this._overlays[overlayType][overlayId]);
            }
        }
        return resultOverlays;
    };

    createOverlay(state, unit){
        var overlay = this._objectFactory.getObjectByUnit(state, unit);
       
        if(!overlay) {
            return;
        }
        if(!this._overlays[unit.getType()]) this._overlays[ unit.getType()] = {};
        this._overlays[unit.getType()][unit.getId()] = overlay;
        return overlay;
    };

    removeOverlay(overlayType, id) {
        delete this._overlays[overlayType][id];
    }

    clear() {
        this._overlays = {};
    }


}
