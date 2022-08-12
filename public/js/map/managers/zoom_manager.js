/**
  Class for managing zoom changing event on map
*/
export class ZoomManager {
   
    constructor(overlayStorage, visibilityStorage) {
        this._visibilityStorage = visibilityStorage;  
        this._overlayStorage = overlayStorage;  
    }

    processZoomChange(zoom){
        for(var overlayType in this._overlayStorage.getOverlayTypes()) {
            var overlays = this._overlayStorage.getOverlaysByType(overlayType);
            
            for(var i=0; i < overlays.length; i++){
                var overlay = overlays[i];
                var greaterBottomLimit = !overlay.getSize() || parseInt(overlay.getSize()) <= zoom;
                var lessTopLimit = !overlay.getSizeMax() || parseInt(overlay.getSizeMax()) >= zoom;
                var visibleBySize = lessTopLimit && greaterBottomLimit; 
              
                this._visibilityStorage.setVisibilityFlag(overlayType, overlay.getId(), 'zoom', visibleBySize)
            }
        }
    }
    
    
}
