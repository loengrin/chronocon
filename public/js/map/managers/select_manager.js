/**
  Class for managing object selection event on map
*/
export class SelectManager {
   
    constructor(overlayStorage) {
        this._selectedOverlay = null;
        this._overlayStorage = overlayStorage;
    }

    selectOverlay(unit){
        if(!unit) {
            return;
        }
        var that = this;
        this.deselectOverlay();
        var overlay = this._overlayStorage.getOverlay(unit.getType(), unit.getId());
        if(!overlay) return;
        overlay.select();
        this._selectedOverlay = overlay;
    };

    deselectOverlay(){
        if(this._selectedOverlay) {
            this._selectedOverlay.deselect();
        }
    };

}
