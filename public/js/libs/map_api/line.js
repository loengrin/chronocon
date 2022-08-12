var $ = require("jquery");
import { UnitMarker } from './unit_marker.js'
import CommonLib from '../common/common_lib.js';
import { Overlay } from './overlay.js'

/**
 * Overlay for line or set of lines
 */
export class LineOverlay extends Overlay
{
    constructor(options){
        super(options.unitId, options.size, options.sizeMax);
        this.name = options.name;
        this._mapArea = options.mapArea;
        this._dashed = options.lineStyle == 'arrows' || options.lineStyle == 'dashed'; 
        this._lineStyle = options.lineStyle;
        this._isVisible = true;

        if(options.hasLabel && options.labelPoint){   
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
        this._createPolylines(options.branchs ? options.branchs :[options.points], options);
        this._color = options.color;
        this._zIndex = options.zIndex;
        this._width = options.width;
        this._opacity = options.fillOpacity;

        this._showLabel = options.showLabel; 
        this._selected = false;

        this._mouseOverFillColor = "#BBB";
        this._selectStrokeColor = '#00FF00';
        this._points = options.points;
        this._branchs = options.branchs;  
        this._mapArea = options.mapArea;
        this._size = options.size;
        this._sizeMax = options.sizeMax;
        this._options = options;

        this._arrowPolylines = {};
        this._setSegmentArrows();

        this._bindPolylineEvents(options.unitId);
        this._bindEditPolylineEvents(options.fieldId);
        CommonLib.mixinPublisher(this);   
    };

    _createPolylines(paths,options, keepExisted){
        var icons = null;
        if(options.lineStyle == 'arrow'){
            icons= [{
                    icon: { path :google.maps.SymbolPath.FORWARD_CLOSED_ARROW, strokeOpacity: options.fillOpacity, scale: options.width},
                    offset: '100%',
             }];
        }
        if(options.lineStyle == 'arrows'){
            icons= [{
                    icon: { path :google.maps.SymbolPath.FORWARD_CLOSED_ARROW, strokeOpacity: options.fillOpacity, scale: options.width},
                    offset: '0',
                    repeat: '30px'
             }];
        }

        if(options.lineStyle == 'dashed'){
            icons= [{
                    icon: {path: 'M 0,-1 0,1', strokeOpacity: options.fillOpacity, scale: options.width },
                    offset: '0',
                    repeat: '30px'
            }];
        }
        if(!keepExisted) {
            this._polylines = [];
        }
        for(var i=0;i<paths.length;i++){
            this._polylines.push(new google.maps.Polyline({
                path:options.mapArea.convertPoints(paths[i]),
                strokeColor: options.color,
                strokeOpacity: this._dashed ? 0 : options.fillOpacity,
                strokeWeight: options.width,
                zIndex:  parseInt(options.zIndex)+10,
                map: this._mapArea.getMap(),
                icons: icons
            }));
        }
    };

    _bindPolylineEvents(unitId){
        var that = this;
        for(var i=0;i<this._polylines.length;i++){
            google.maps.event.addListener(that._polylines[i],"mouseover",function(){
                for(var j=0;j<that._polylines.length;j++){
                  that._polylines[j].setOptions({strokeColor: that._mouseOverFillColor});
                }
            });

            google.maps.event.addListener(that._polylines[i],"mouseout",function(){
                for(var j=0;j<that._polylines.length;j++){
                    that._polylines[j].setOptions({strokeColor: that._color});
                }
                that.triggerCallback('mouseout');
            });

            google.maps.event.addListener(that._polylines[i], 'click', function() {
                that.triggerCallback('click');
            });

            (function(lineNum){
                google.maps.event.addListener(that._polylines[lineNum], 'rightclick', function(e) {
                    if(e.vertex !== undefined) {
                        e.path = lineNum;
                    }
                    if(that._mapArea.getKeyPressed() == 'D' && e.vertex !== undefined){
                      that.deletePoint(e.vertex, e.path);
                    }
                    else{
                      that.triggerCallback('rightclick',e);
                    }
                });
            })(i);

            google.maps.event.addListener(that._polylines[i],"mousemove",function(e){
                that.triggerCallback('mouseover', unitId);
            });
        }
    };

    _bindEditPolylineEvents(fieldId){
        var that = this; 
        if(!this._branchs){
            var path = this._polylines[0].getPath();
            google.maps.event.addListener(path, 'set_at', function(pointNumber) {
                var pathArray = path.getArray();
                var points = that._mapArea.convertGMapPoints(pathArray);

                var point = {
                    lat: points[pointNumber].lat,
                    lng: points[pointNumber].lng,
                }
                that.triggerCallback('movePoint', fieldId, 1, pointNumber, point);
                that._setSegmentArrows();
            });
            google.maps.event.addListener(path, 'insert_at', function(pointNumber) {
                var pathArray = path.getArray();
                var points = that._mapArea.convertGMapPoints(pathArray);

                var point = {
                    lat: points[pointNumber].lat,
                    lng: points[pointNumber].lng,
                }
                that.triggerCallback('insertPoint',fieldId, 1, pointNumber, point);
                that._setSegmentArrows();
            });
            google.maps.event.addListener(path, 'remove_at', function(pointNumber) {
                that.triggerCallback('deletePoint',fieldId,  1, pointNumber, fieldId);
            });      
        }
        else {
            for(var i=0;i<this._polylines.length;i++){
                this._bindEditBranchPolylineEvents(i, fieldId);
            }
        }
    };

    _bindEditBranchPolylineEvents(branchNumber, fieldId){
        var that = this;
        var path = this._polylines[branchNumber].getPath();
        google.maps.event.addListener(path, 'set_at', function(pointNumber) {
            var pathArray = path.getArray();
            var points = that._mapArea.convertGMapPoints(pathArray);
            var point = {lat: points[pointNumber].lat, lng: points[pointNumber].lng,}
            that.triggerCallback('movePoint', fieldId, branchNumber, pointNumber, point);
            that._setSegmentArrows();
        });
        google.maps.event.addListener(path, 'insert_at', function(pointNumber) {
            var pathArray = path.getArray();
            var points = that._mapArea.convertGMapPoints(pathArray);
            var point = {lat: points[pointNumber].lat, lng: points[pointNumber].lng,}
            that.triggerCallback('insertPoint',fieldId, branchNumber, pointNumber, point);
            that._setSegmentArrows();
        });
        google.maps.event.addListener(path, 'remove_at', function(pointNumber) {
            that.triggerCallback('deletePoint',fieldId,  branchNumber, pointNumber, fieldId);
            that._setSegmentArrows();
        });
    }

    hide(){
        this._isVisible = false;
        for(var i=0;i<this._polylines.length;i++){
            this._polylines[i].setMap(null);
        }
        if(this.labelOverlay){
            this.labelOverlay.hide();
        };
        this._deleteSegmentArrows();
    };

    show(){
        this._isVisible = true;
        for(var i=0;i<this._polylines.length;i++){
            this._polylines[i].setMap(this._mapArea.getMap());
        }
        if(this.labelOverlay && this._showLabel){
            this.labelOverlay.show();
        };
        this._setSegmentArrows(); 
    };

    select(){
        for(var i=0;i<this._polylines.length;i++){
            this._polylines[i].setOptions({strokeColor: this._selectStrokeColor});               
            this._polylines[i].setEditable(true);   
        }
        if(this.labelOverlay){
            this.labelOverlay.setIcon('/uploads/empty_marker_edit.png');   
            this.labelOverlay.select();
        };
        this._selected = true;
    };

    deselect(){
        for(var i=0;i<this._polylines.length;i++){
            this._polylines[i].setOptions({strokeColor: this._color});
            this._polylines[i].setEditable(false);   
        }
        if(this.labelOverlay){
            this.labelOverlay.setIcon('/uploads/empty_marker.png');    
            this.labelOverlay.deselect();
        };
        this._selected = false;
    };

    remove(){
        for(var i=0;i<this._polylines.length;i++){
            this._polylines[i].setMap(null); 
        }
        if(this.labelOverlay){
            this.labelOverlay.remove();
        }
        this._deleteSegmentArrows();
    };

    setColor(color){    
        this.color = color;
        for(var i=0;i<this._polylines.length;i++){  
            this._polylines[i].setOptions({strokeColor: color});
        }   
        this._setSegmentArrows();
    };

    setOpacity(opacity){
        if(!this._dashed){
            for(var i=0;i<this._polylines.length;i++){
                this._polylines[i].setOptions({strokeOpacity: opacity});
            }    
        }
        this._setSegmentArrows();
    };

    setBorders(borders, fieldId){
        
        if(borders.points){
            this._polylines[0].setPath(this._mapArea.convertPoints(borders.points));  
        }
        else{
           
            if(borders.branchs.length > this._polylines.length) {
                 var newBranchs = [];
                 for(var i=this._polylines.length; i < borders.branchs.length; i++) {
                     newBranchs.push(borders.branchs[i]);
                 }
                 this._createPolylines(newBranchs, this._options, true);
            }
           
            for(var i=0;i<this._polylines.length;i++){
                if(borders.branchs[i]) {
                    this._polylines[i].setPath(this._mapArea.convertPoints(borders.branchs[i]));
                }
                else {
                    this._polylines[i].setPath([]);
                }
            }
        }
        this._branchs = borders.branchs;
        this._points = borders.points;
        this._bindEditPolylineEvents(fieldId);
        this._bindPolylineEvents(this._options.unitId);
        this._setSegmentArrows();
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

    deletePoint(pointNumber, pathNumber){  
        this._polylines[pathNumber ? pathNumber : 0].getPath().removeAt(pointNumber); 
    };

    _setSegmentArrows(){
        if(this._lineStyle != 'arrow') return;
        if(!this._isVisible) return;
        this._deleteSegmentArrows();
        var segments = this._points ? [this._points] : this._branchs;
        for(var i=0;i<segments.length;i++){
            var icons= [{
                icon: { path :google.maps.SymbolPath.FORWARD_CLOSED_ARROW, strokeOpacity: this._opacity, scale: this.width},
                offset: '100%',
            }];
            if(!this._arrowPolylines[i]){
                this._arrowPolylines[i] = {};
            }
           
            for(var j=1;j<segments[i].length;j++){ 
                this._arrowPolylines[i][j] = (new google.maps.Polyline({
                    path:this._mapArea.convertPoints([segments[i][j-1],segments[i][j]]),
                    strokeOpacity: 0,
                    strokeColor: this._color,
                    strokeWeight: this._width,
                    zIndex:  parseInt(this._zIndex)+9,
                    map: this._mapArea.getMap(),
                    icons: icons
                }));
            }
        }
    };

    _deleteSegmentArrows(){
        if(this._lineStyle != 'arrow') return;
        for(var i in this._arrowPolylines){
            if(this._arrowPolylines[i] != undefined){
                for(var j in this._arrowPolylines[i]){
                    this._arrowPolylines[i][j].setMap(null);;
                }
            }
        }
    }
}

