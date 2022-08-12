import { UnitMarker } from './unit_marker.js'
import { Overlay } from './overlay.js'
var $ = require("jquery");
import CommonLib from '../common/common_lib.js';

/**
 * Overlay for movable unit. It contains of UnitMarker, polyline and labels
 */
export class ArmyOverlay extends Overlay
{
    constructor(options){
        super(options.unitId, options.size, options.sizeMax);
        this._mapArea = options.mapArea;
        this._name = options.name;
        this._formatter = options.formatter; 
        this._showLabel = options.showLabel;
        this._pointsWithDates = options.pointsWithDates;
        this._hasLabel = options.hasLabel;
        
        this._icon = options.icon;  
        this._armyMarker = new UnitMarker({
            point: options.pointsWithDates[0],
            name: options.name.toUpperCase(),
            icon: options.icon,
            tip: options.tip,
            color: '#fff',  
            animation: false,
            boldLabel: options.boldLabel,
            showLabel: options.showLabel,    
                hasLabel: options.hasLabel,
            mapArea: options.mapArea
        });

        this._polyline = new google.maps.Polyline({
            path:options.mapArea.convertPoints(options.pointsWithDates),
            icons: [{icon:  {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW}, offset: '100%'}],
            strokeColor: '#0A0',
            strokeOpacity: 1,
            strokeWeight: 1, 
            editable:true
        });

        this._selected = false;
        this._polylineLabels = null;
        CommonLib.mixinPublisher(this); 
        this._bindMarkerEvents(options.unitId);
        this._bindPolylineEvents();
    };

    _bindMarkerEvents(unitId){
        var that = this;
        that._armyMarker.bind('click', function(){
            that.triggerCallback('click');
        });

        that._armyMarker.bind('rightclick', function(e){
            that.triggerCallback('rightclick',e);
        });
        
        that._armyMarker.bind('mouseover', function(e){
            that.triggerCallback('mouseover',unitId);
        });
        
         that._armyMarker.bind('mouseout', function(e){
            that.triggerCallback('mouseout',unitId);
        });
    };
        
    _bindPolylineEvents(){
        var that = this;  
        google.maps.event.addListener(that._polyline.getPath(), 'remove_at', function(pointNumber) {
            that.triggerCallback('deletePoint',0,  0, pointNumber);
        });

        google.maps.event.addListener(that._polyline.getPath(), 'set_at', function(pointNumber) {
            var path = that._polyline.getPath().getArray();
            var points = that._mapArea.convertGMapPoints([path[pointNumber]]);

            var point = {lat: points[0].lat, lng: points[0].lng,}
            that.triggerCallback('movePoint', 0, 0, pointNumber, point);
        });

        google.maps.event.addListener(that._polyline.getPath(), 'insert_at', function(pointNumber) {
            var path = that._polyline.getPath().getArray();
            var points = that._mapArea.convertGMapPoints([path[pointNumber]]);

            var point = {lat: points[0].lat, lng: points[0].lng,}
            that.triggerCallback('insertPoint',0, 0, pointNumber, point);
        });

        google.maps.event.addListener(that._polyline, 'rightclick', function(e) {
            that.triggerCallback('rightclick',e);
        });
    };

    show(){
        this._armyMarker.show();
        if(this._selected){
            this._polyline.setMap(this._mapArea.getMap());     
            this._generatePolylineLabels();  
            this._showPolylineLabels();    
        }
    };

    hide(){
        this._armyMarker.hide();
        if(this._selected){
            this._polyline.setMap(null);
            this._hidePolylineLabels();
        }
    };

    select(){
        this._selected = true;
        this._armyMarker.select(true);
        this._polyline.setMap(this._mapArea.getMap());     
        this._generatePolylineLabels();  
        this._showPolylineLabels();    
    };

    deselect(){
        this._selected = false;
        this._armyMarker.deselect();        
        this._polyline.setMap(null);
        this._hidePolylineLabels();
    };

    _generatePolylineLabels(){
        this._hidePolylineLabels();
        this._polylineLabels = [];
        for(var i=0;i<this._pointsWithDates.length;i++){
            var unitMarker = new UnitMarker({
                point:this._pointsWithDates[i],
                color: '#AAA',
                showLabel: true,
                    hasLabel: true,
                name: (i+1)+(this._pointsWithDates[i].date ? ". "+this._formatter.getDateLabel(this._pointsWithDates[i].date) : "")+
                        (this._pointsWithDates[i].dateTo ? "-"+this._formatter.getDateLabel(this._pointsWithDates[i].dateTo) : ""),
                mapArea: this._mapArea
            });
            this._polylineLabels.push(unitMarker);
        }
    };

    _showPolylineLabels(){
        if(!this._polylineLabels) return;
        for(var i=0;i<this._polylineLabels.length;i++){
            this._polylineLabels[i].show();
        }
    };

    _hidePolylineLabels(){
        if(!this._polylineLabels) return;
        for(var i=0;i<this._polylineLabels.length;i++){
            this._polylineLabels[i].remove();
        }
    };

    setIcon(icon){
        if(icon == this._icon) return;
        this._icon = icon;
        this._armyMarker.setIcon(icon);
    };

    showLabel(){
        if(!this._hasLabel) return;
        this._armyMarker.showLabel();
        this._showLabel = true;  
    };

    hideLabel(){
        this._armyMarker.hideLabel();
        this._showLabel = false;
    };

    setAnimation(isOn){
        this._armyMarker.setAnimation(isOn);
    };

    allowInvisible(isOn){
        this._allowInvisible = isOn;  
    };

    move(point){    
        this._armyMarker.move(point);
    };

    remove(){
        this._armyMarker.remove();   
        this._polyline.setMap(null); 
        this._hidePolylineLabels();
    };

    deletePoint(pointNumber){  
        this._polyline.getPath().removeAt(pointNumber); 
    };
    
    getName(pointNumber){  
        return this._name;
    };
    
    setName(name){  
       this._name = name;
       this._armyMarker.setName(name);
    };
}
