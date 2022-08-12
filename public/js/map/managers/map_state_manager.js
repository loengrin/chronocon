import { MapArea } from '../../libs/map_api/map.js'
var $ = require("jquery");

/**
  Class for managing map state changing event on map
*/
export class MapStateManager {
   
    constructor(callbacks) { 
        this._mapArea = null;
        this._callbacks = callbacks;
        this._mousePosition=null;
    }
    
    init(mainObject, mapState){
        console.log(mapState);
        this._mapArea = new MapArea(".b-map",
            {lat:45.44, lng:30.52},
            mainObject.getField('mapType'),
            mainObject.getField('mapTypeOptions')
        );
        if(mapState.mapCenter){
            this._mapArea.setMapCenter(mapState.mapCenter);
        }
        if(mapState.mapZoom){
            console.log(mapState);
            this._mapArea.setMapZoom(mapState.mapZoom);
        }
   
        this._bindMapEvents(this._callbacks);
        var that = this;
        setTimeout(function(){
            that._callbacks.mapStateChanged(that._getMapState());
        }, 1000);

    }
    
    getCallbacksWithMousePosition(callbacks) {
        return {
            unitClicked: (unit) => {
                callbacks.unitLeftClicked(unit);
            },
            unitMouseOver: (unitId) => {
                callbacks.unitMouseOver(unitId, this._mousePosition);
            },
            unitMouseOut: () => {
                callbacks.unitMouseOut();
            },
            unitRightClicked: (unit, vertex, path) => {
                callbacks.unitRightClicked(unit, vertex, path, this._mousePosition);
            },
            moveToArmyInvisiblePoint: (a) => {
                callbacks.unitRightClicked(unit, vertex, path, this._mousePosition);
            }
        }
    }
    

    _bindMapEvents(callbacks){
        var that = this;
        this._mapArea.bind('zoomChanged', function(){
            callbacks.mapStateChanged(that._getMapState());
            callbacks.zoomChanged(that._mapArea.getMapZoom());
        });

        this._mapArea.bind('centerChanged', function(){
            callbacks.mapStateChanged(that._getMapState());
        });

        this._mapArea.bind('click', function(){
            callbacks.mapLeftClicked();
        });

        $('.b-map-frame').mousemove(function(e){
            var offset = $('.b-map-frame').offset();
            if(!offset) {
                return;
            }
            that._mousePosition= {
                'x': e.clientX - offset.left,
                'y': e.clientY - offset.top
            }
        });
    };

    _getMapState() {
        return {
            mapCenter: this._mapArea.getMapCenter(),
            mapZoom: this._mapArea.getMapZoom(),
            mapFrame: this._mapArea.getMapFrame(),
        };
    }
    
    setMapPosition (mapCenter, mapZoom) {
        this._mapArea.setMapCenter(mapCenter);
//        if(mapZoom) {
//            this._mapArea.setMapZoom(parseInt(mapZoom));
//        }
    };
    
        
    setMapZoom (mapZoom) {
       this._mapArea.setMapZoom(parseInt(mapZoom));
    };
    
    getMapArea() {
        return this._mapArea;
    }
    
    setMapType(mapTypeId) {
        this._mapArea.setMapType(mapTypeId);
    }

}
