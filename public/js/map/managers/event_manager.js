/**
  Class for managing map state changing event on map
*/
export class EventManager {
   
    constructor(overlayStorage, visibilityStorage) {
        this._visibilityStorage = visibilityStorage;  
        this._overlayStorage = overlayStorage;  
        this._eventRelatedObjects = {};
        this._actualEvent = null;
    }

    rewind(time, step){
        this._eventRelatedObjects = {};
        var objectTypes = {'city':1,'army':1,'region':1,'line':1};
        for(var objectType in objectTypes){
            var units = time.getStepObjects(step, objectType);
   
            for(var i=0;i<units.length;i++){
                this._saveIfEventRelated(units[i]);
            }
        }
        if(this._actualEvent) {
            this._visibilityStorage.setVisibilityFlag(this._actualEvent.getType(), this._actualEvent.getId(), 'event', false)
        }
        this._hidelAllEventRelated();
    }
    
    selectEvent(event, editMode) {
        this._hidelAllEventRelated();
        this.showEventRelated(event);
        this._showEventMarkerPosition(event, editMode);
    }

    _saveIfEventRelated(unit){
        var eventId = unit.getField('eventId');
        if(eventId){
            if(!this._eventRelatedObjects[eventId]){
                this._eventRelatedObjects[eventId] = [];
            }
            this._eventRelatedObjects[eventId].push(unit);
        }
    }

    showEventRelated(currentEvent){
        if(!currentEvent){
            return;
        }
        if(!this._eventRelatedObjects[currentEvent.getId()]){
            return;
        }
        for(var i=0; i < this._eventRelatedObjects[currentEvent.getId()].length; i++){
            var unit = this._eventRelatedObjects[currentEvent.getId()][i];
            this._visibilityStorage.setVisibilityFlag(unit.getType(), unit.getId(), 'by_event', true)
        }
    }

    _hidelAllEventRelated(){
        for(var eventId in this._eventRelatedObjects){
            for(var i=0; i < this._eventRelatedObjects[eventId].length; i++){
                var unit =  this._eventRelatedObjects[eventId][i];
                this._visibilityStorage.setVisibilityFlag(unit.getType(), unit.getId(), 'by_event', false)
            }
        }
    }

    _showEventMarkerPosition (event, editMode) {
        if (!event) {
            return;
        }
        var overlay = this._overlayStorage.getOverlay(event.getType(), event.getId());
         console.log(event, editMode,overlay);
       
        if (!overlay) {
            return;
        }
        console.log("!!!",editMode,event.getField('showMarker'));
        if(editMode || event.getField('showMarker')){
            this._visibilityStorage.setVisibilityFlag(event.getType(), event.getId(), 'event', true)
            overlay.setActual(event.getField('showMarker') ? true : false);
            this._actualEvent = event;
        }   
    }
}
