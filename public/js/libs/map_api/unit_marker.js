import CommonLib from '../common/common_lib.js';
var $ = require("jquery");
import { Overlay } from './overlay.js'
var Label = require('./label');

/**
 * Overlay for citys and battles. It contains icon and label.
 */
export class UnitMarker extends Overlay
{
    constructor(options){
        super(options.unitId, options.size, options.sizeMax);
        var icon = options.icon ? options.icon : "/uploads/empty_marker.png";
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(options.point.lat, options.point.lng),
            icon: icon, 
            map: options.mapArea.getMap(),
            color: options.color,
            zIndex:1000,
            optimized:(options.animation !== undefined ? !options.animation : false)
        });
        this.label = new Label({
            name: options.name,
            icon: icon,
            showLabel: options.hasLabel && options.showLabel, 
            map: options.mapArea.getMap(),
            color: options.color,
            cls: options.cls,
            font: options.font
        });  
        this.label.bindTo('position', this.marker, 'position');
        this.label.bindTo('text', this.marker, 'position');     

        this._name = options.name;
        this._mapArea = options.mapArea;
        this._size = options.size;
        this._sizeMax = options.sizeMax;
        this._hasLabel = options.hasLabel;
        CommonLib.mixinPublisher(this); 
        this._bindMarkerEvents(options.unitId);
        this._hack();
    }

    _bindMarkerEvents(unitId){
        var that = this;
        google.maps.event.addListener(that.marker, 'click', function() {
            that.triggerCallback('click');
        });

        google.maps.event.addListener(that.marker, 'rightclick', function(e) {
            that.triggerCallback('rightclick',e);
        });

        google.maps.event.addListener(that.marker,"mouseover",function(){
            that.label.highlight();
            that.triggerCallback('mouseover', unitId);
            return false;
        });

        google.maps.event.addListener(that.marker,"mouseout",function(){
            that.label.dehighlight();
            that.triggerCallback('mouseout');
            return false;
        });

        google.maps.event.addListener(that.marker, 'dragend', function() {
            var point = {lat: that.marker.getPosition().lat(), lng: that.marker.getPosition().lng(),}
            that.triggerCallback('drag', point);
        });
    };

    show(){
        this.label.show();
        this.marker.setVisible(true);
    };
    
    hide(){    
        this.label.hide();
        this.marker.setVisible(false);;
    };

    select(noDrag){
        this.label.select();
        if(!noDrag) this.marker.setDraggable(true);
    };

    deselect(){
        this.label.deselect();
        this.marker.setDraggable(false);   
    };

    move(point){
        this.marker.setPosition(point);
    };  

    setIcon(icon){    
       var iconUrl = typeof icon == 'object' ? icon.left: icon;
       this.marker.setIcon(iconUrl);
       this.label.setIconSize(iconUrl);
       this._hack();
    };

    setName(name){
        this._name = name;
        this.label.setLabelText(name);
    };  

    showLabel(){
        if(!this._hasLabel) return;
        this.label.showLabelText();
    };

    hideLabel(){
        this.label.hideLabelText();
    };

    getSize(){
        return this._size;
    }; 

    setAnimation(isOn){
        this.marker.setOptions({optimized:!isOn});   
    };

    remove(){
        this.marker.setMap(null);   
        this.label.setMap(null); 
    };

    _hack(){
        var that = this;
        setTimeout(function(){
            that.marker.setPosition(that.marker.getPosition());       
        },1000);    
        setTimeout(function(){
            that.marker.setPosition(that.marker.getPosition());       
        },5000);  
        setTimeout(function(){
            that.marker.setPosition(that.marker.getPosition());       
        },10000);  
    };

    setColor(color){
        this.label.setColor(color);
    };

    setBorder(border){
        this.label.setBorder(border);
    };
  
}