/**
 * Class for managing units visiblity depend on visibility flags
 */
export class VisibilityStorage {
    constructor(overlayStorage) {
        this._overlayStorage = overlayStorage;  
    }
    
    clear() {
         this._visibilityFlags = {};
    }
    
    setVisibilityFlag(objectType, objectId, flagKey, flagValue) {
        var oldVisibility = this._getTotalVisibility(objectType, objectId);
       
        if(!this._visibilityFlags[objectType]) {
            this._visibilityFlags[objectType] = {};
        }
        if(!this._visibilityFlags[objectType][objectId]) {
            this._visibilityFlags[objectType][objectId] = {};
        }
        this._visibilityFlags[objectType][objectId][flagKey] = flagValue;
        this._checkAction(objectType, objectId, oldVisibility);
    }
    
    _getTotalVisibility(objectType, objectId) {
        if(!this._visibilityFlags[objectType]) {
            return null;
        }
         if(!this._visibilityFlags[objectType][objectId]) {
            return null;
        }
        var totalVisibility = true;
        for(var visibilityFlag in this._visibilityFlags[objectType][objectId]) {
            totalVisibility = totalVisibility && this._visibilityFlags[objectType][objectId][visibilityFlag];
        }
        return totalVisibility;
    }
    
    _checkAction(objectType, objectId, oldVisibility) {
        var newVisibility = this._getTotalVisibility(objectType, objectId);
         if(newVisibility === oldVisibility) {
            return;
        }
        var overlay = this._overlayStorage.getOverlay(objectType, objectId);
        if(!overlay) {
            return;
        }
        if(objectType == 'event') {
             //   console.trace();
             //   console.log(this._visibilityFlags[objectType][objectId],newVisibility);
        }
        if(newVisibility) {
            overlay.show();
        }
        else {
            overlay.hide();
        }
    }   
}
