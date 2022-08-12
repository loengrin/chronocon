import { ArmyWayService } from '../libs/army_way_service'
import { OverlayStorage } from './storages/overlay_storage';
import { VisibilityStorage } from './storages/visibility_storage';
import { ObjectFactory } from './storages/object_factory';
import { RewindManager} from './managers/rewind_manager';
import { MapStateManager } from './managers/map_state_manager';
import { EventManager } from './managers/event_manager';
import { SelectManager } from './managers/select_manager';
import { ZoomManager } from './managers/zoom_manager';
import { ArmyManager } from './managers/army_manager';

/**
 * Main class for managing events on the map
 */
export class MapController {
    constructor(callbacks) {
        var that = this;
        callbacks.zoomChanged = (zoom) => {that.zoomChanged(zoom)}
        this._mapStateManager = new MapStateManager(callbacks);
       
        this._objectFactory = new ObjectFactory(
                this._mapStateManager.getCallbacksWithMousePosition(callbacks), 
                callbacks
        );
        this._overlayStorage = new OverlayStorage(this._objectFactory);
        this._visibilityStorage = new VisibilityStorage(this._overlayStorage);
        
        this._selectManager = new SelectManager(this._overlayStorage);
        this._rewindManager = new RewindManager(this._overlayStorage, this._visibilityStorage);
        this._eventManager = new EventManager(this._overlayStorage, this._visibilityStorage);
        this._zoomManager = new ZoomManager(this._overlayStorage, this._visibilityStorage);
        this._armyManager = new ArmyManager(this._overlayStorage, this._visibilityStorage);
        
        this.callbacks = callbacks;
    }
    

    init(mainObject, mapState, selectedUnit, calendar){
        console.log(mapState);
        this._mapStateManager.init(mainObject, mapState)
        this._armyWayService = new ArmyWayService(calendar);
       
        this._objectFactory.init(this._mapStateManager.getMapArea(), this._armyWayService),
        this._armyManager.init(this._mapStateManager.getMapArea(), this._armyWayService);

        this._overlayStorage.clear();
        this._visibilityStorage.clear();
        this._selectManager.selectOverlay(selectedUnit)
    }

    rewind(state, newStep, oldStep){
        this._rewindManager.rewind(state, newStep, oldStep);
        this._eventManager.rewind(state.time, newStep);
        this._armyManager.moveArmys(state.time, newStep, 0);
    }

    refresh(state, step){
        this._armyManager.setEditMode(state.editMode);
        this._rewindManager.refresh(state, step);
        this._eventManager.rewind(state.time, step);
        this.processEventChange(state.currentEvent, state.editMode);
        this._armyManager.moveArmys(state.time, step, 0);
        this._zoomManager.processZoomChange(this._mapStateManager.getMapArea().getMapZoom());
    }
    
    rewindFraction(state, step, fraction) {
         this._armyManager.moveArmys(state.time, step, fraction);
    }
    
    zoomChanged(zoom) {
        this._zoomManager.processZoomChange(zoom);
    }
 
    selectOverlay(unit){
        this._selectManager.selectOverlay(unit)
    };

    deselectOverlay(){
        this._selectManager.deselectOverlay()
    };

    redrawOverlay(state, unit){
        var overlay = this._overlayStorage.getOverlay(unit.getType(), unit.getId());
        if(overlay){
            overlay.hide();
            this._overlayStorage.removeOverlay(unit.getType(), unit.getId());
        }
        if(state.time.getCalendar().gE(state.currentDate,unit.getDateBegin()) &&
            state.time.getCalendar().lE(state.currentDate,unit.getDateEnd())){
            this._rewindManager._makeUnitVisible(state, unit, state.currentStep);
            this._zoomManager.processZoomChange(this._mapStateManager.getMapArea().getMapZoom());
            if(state.selectedUnit && state.selectedUnit.getId() === unit.getId()){
                this.selectOverlay(state.selectedUnit);
            }
        }
        if(unit.getType() === 'army') {
            this._armyManager._moveArmy(unit, state.currentStep, 0, state.time.getCalendar());  
        }
    }

    removeOverlay(unit){
        var overlay = this._overlayStorage.getOverlay(unit.getType(), unit.getId());
        if(!overlay) return;
        overlay.remove();
        this._overlayStorage.removeOverlay(unit.getType(), unit.getId());
    };
    
    setMapPosition(mapCenter, mapZoom) {
        this._mapStateManager.setMapPosition(mapCenter, mapZoom);
    }
    
    setMapZoom(mapZoom) {
        this._mapStateManager.setMapZoom(mapZoom);
    }
    
    setMapType(mapTypeId) {
        this._mapStateManager.setMapType(mapTypeId);
    }

    processEventChange(event, editMode) {
        if(!event) {
            return;
        }
        this._mapStateManager.setMapPosition(event.getField('arrowPoint'));
        
        //this._mapStateManager.setMapPosition(event.getField('arrowPoint'), event.getField('mapZoom'));
        this._eventManager.selectEvent(event, editMode);
        this._eventManager.showEventRelated(event);
    }
    
    searchOnMap(searchString) {
        this._mapStateManager.getMapArea().search(searchString);
    };

    hideSearchMarker() {
        this._mapStateManager.getMapArea().setSearchMarkerVisibility(false) ;
    };

    showSearchMarker() {
        this._mapStateManager.getMapArea().setSearchMarkerVisibility(true) ;
    };

    setLabelsVisibility (settingKey, settingValue) {
        var types = settingKey == 'infoboxes' ? {event:1} : {city:1,army:1,region:1,line:1}
        for(var overlayType in types){
            var overlays = this._overlayStorage.getOverlaysByType(overlayType);
            for (var i=0;i<overlays.length; i++) {
                settingValue ? overlays[i].showLabel() : overlays[i].hideLabel();
            }
        }
    };

    deletePoint(unit, vertex, path){
        var overlay = this._overlayStorage.getOverlay(unit.getType(), unit.getId());
        overlay.deletePoint(vertex,path);
    }
    
}
