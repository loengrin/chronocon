var $ = require("jquery");
import { UnitMarker } from './unit_marker.js'
import { Overlay } from './overlay.js'
import CommonLib from '../common/common_lib.js';

/**
 * Overlay for region or set of regions
 */
export class RegionOverlay extends Overlay
{
    constructor(options){
        super(options.unitId, options.size, options.sizeMax);
        this.polygonPaths = options.polygons;
        this._mapArea = options.mapArea;

        this.color = options.color,
        this.polygonOverlay = new google.maps.Polygon({
            paths:this._getConveredPolygons(this.polygonPaths),
            strokeColor: options.color,
            strokeOpacity: 1,
            zIndex: parseInt(options.zIndex)+10,
            strokeWeight: options.strokeWeight,
            fillColor: options.color,
            fillOpacity: options.fillOpacity,
            map: this._mapArea.getMap()
        });     

        if(options.hasLabel){
            this.labelOverlay = new UnitMarker({
                point:options.labelPoint,
                name: options.name,
                showLabel: options.showLabel,
                hasLabel: true,
                size: options.size,
                sizeMax: options.sizeMax,
                color: '#ccc',//options.color,
                mapArea: this._mapArea
            });
            var that = this;
            this.labelOverlay.bind('drag',function(point){
                that.triggerCallback('drag', options.fieldId,  point);
            });
        }

        this._selected = false;
        this._showLabel = options.showLabel;
        this._name = options.name;
        this._size = options.size;
        this._sizeMax = options.sizeMax;
        this._bindPolygonEvents(options.unitId);
        this._bindEditPolygonsEvents(options.fieldId);
        CommonLib.mixinPublisher(this); 
        this.mouseOverFillColor = options.mouseOverFillColor ? options.mouseOverFillColor : "#BBB";
        this.selectStrokeColor = '#00FF00';
      };

    _getConveredPolygons(polygonPaths){
        var pathArray = [];
        for(var i=0;i<polygonPaths.length; i++){
            pathArray.push(this._mapArea.convertPoints(polygonPaths[i]));
        } 
        return pathArray;
    };

    _bindPolygonEvents(unitId){
        var that = this;
        google.maps.event.addListener(that.polygonOverlay,"mouseover",function(){
            that.polygonOverlay.setOptions({fillColor: that.mouseOverFillColor});
        });

        google.maps.event.addListener(that.polygonOverlay,"mouseout",function(){
            that.polygonOverlay.setOptions({fillColor: that.color});
            that.triggerCallback('mouseout');
        });

        google.maps.event.addListener(that.polygonOverlay,"mousemove",function(e){
            that.triggerCallback('mouseover', unitId);
        }); 

        google.maps.event.addListener(that.polygonOverlay, 'click', function(event) {
            that.triggerCallback('click');
        });    

        google.maps.event.addListener(that.polygonOverlay, 'rightclick', function(e) {
            if(that._mapArea.getKeyPressed() == 'D' && e.vertex !== undefined){
                that.deletePoint(e.vertex, e.path);
            }
            else {
                that.triggerCallback('rightclick',e);
            }
        });
    };

    _bindEditPolygonEvents(polygonNumber, fieldId){
        var that = this;
        var paths = this.polygonOverlay.getPaths().getArray();
        var path = paths[polygonNumber];
        google.maps.event.addListener(path, 'set_at', function(pointNumber) {
            var pathArray = path.getArray();
            var points = that._mapArea.convertGMapPoints(pathArray);
            var point = {lat: points[pointNumber].lat, lng: points[pointNumber].lng,}
            that.triggerCallback('movePoint', fieldId, polygonNumber, pointNumber, point);
        });
        google.maps.event.addListener(path, 'insert_at', function(pointNumber) {
            var pathArray = path.getArray();
            var points = that._mapArea.convertGMapPoints(pathArray);
            var point = {lat: points[pointNumber].lat, lng: points[pointNumber].lng,}
            that.triggerCallback('insertPoint',fieldId, polygonNumber, pointNumber, point);
        });
        google.maps.event.addListener(path, 'remove_at', function(pointNumber) {
            that.triggerCallback('deletePoint',fieldId,  polygonNumber, pointNumber);
        });
    };

    _bindEditPolygonsEvents(fieldId){
        for(var i=0; i < this.polygonPaths.length; i++){          
            this._bindEditPolygonEvents(i, fieldId);
        }    
    };

    setBorders(borders, fieldId){
        this.polygonOverlay.setPaths(this._getConveredPolygons(borders.polygons));    
        this.polygonPaths = borders.polygons;
        this._bindEditPolygonsEvents(fieldId);
    };

    setColor(color){    
        this.color = color;
        this.polygonOverlay.setOptions({
            strokeColor: this._selected ? this.selectStrokeColor : color, 
            fillColor:color
        });
    };

    setOpacity(opacity){    
        this.polygonOverlay.setOptions({fillOpacity: opacity});    
    };

    hide(){
        this.polygonOverlay.setMap(null);      
        if(this.labelOverlay){
            this.labelOverlay.hide();
        };
    };

    show(){
        this.polygonOverlay.setMap(this._mapArea.getMap());   
         if(this.labelOverlay && this._showLabel){
            this.labelOverlay.show();
        };
     };

    select(){
        this.polygonOverlay.setOptions({strokeColor: this.selectStrokeColor});               
        this.polygonOverlay.setEditable(true);   
        if(this.labelOverlay){
            this.labelOverlay.setIcon('/uploads/empty_marker_edit.png');   
            this.labelOverlay.select();
        };
        this._selected = true;
    };

    deselect(){
        this.polygonOverlay.setOptions({strokeColor: this.color});
        this.polygonOverlay.setEditable(false);  
        if(this.labelOverlay){
            this.labelOverlay.setIcon('/uploads/empty_marker.png');    
            this.labelOverlay.deselect();
        };
        this._selected = false;
    }; 

    remove(){
        this.polygonOverlay.setMap(null); 
        if(this.labelOverlay){
            this.labelOverlay.remove();
        }
    };

    showLabel(){
        if(!this.labelOverlay) return;  
        this._showLabel = true;
        if(this._visibility){
            this.labelOverlay.show();
        }
    };

    hideLabel(){
        if(!this.labelOverlay) return;
        this.labelOverlay.hide();
        this._showLabel = false;
    };

    deletePoint(pointNumber, polygonNumber){  
        var paths = this.polygonOverlay.getPaths().getArray(); 
        paths[polygonNumber].removeAt(pointNumber); 
    };
}
