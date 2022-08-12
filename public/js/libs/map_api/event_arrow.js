var $ = require("jquery");
import CommonLib from '../common/common_lib.js';
import { Overlay } from './overlay.js'

/**
 * Overlay for event marking arrow
 */
export class EventArrowOverlay extends Overlay
{
    constructor(options){
        super(options.unitId);
        
        this._mapArea = options.mapArea;
        this.arrowPoint = options.arrowPoint;

        this._showLabel = options.showLabel; 
        this.icon = options.icon ? options.icon : '/img/new/arrow_icon.gif'; 
        this.color = "#f00";
        this.actualColor = "#f00";
        this.selectedColor = "#0f0";
        this.strokeColor = "#000";
        this.strokeOpacity = 1;
        this.fillOpacity = 0.5;
        this.strokeWeight = 3.0;
        this.scale = 10;
        this.actualScale = 15;
        var that = this;
        this.isSelected = false;
        this.isActual = false;

        this._name =options.name;
        this.arrow =  new google.maps.Marker({
            position: new google.maps.LatLng({
                lat: parseFloat(this.arrowPoint.lat),
                lng: parseFloat(this.arrowPoint.lng),
            }),
            icon: this.getIcon(),
            map: options.mapArea.getMap(),
            zIndex:1200,
        });
        
        CommonLib.mixinPublisher(this);

        google.maps.event.addListener(that.arrow, 'click', function() {
            that.triggerCallback('click');
        });
        
        google.maps.event.addListener(that.arrow, 'rightclick', function(e) {
            that.triggerCallback('rightclick',e);
        });

        google.maps.event.addListener(that.arrow,"mouseover",function(){
            that.triggerCallback('mouseover', options.unitId);
        });

        google.maps.event.addListener(that.arrow,"mouseout",function(){
            that.triggerCallback('mouseout');
        });

        google.maps.event.addListener(that.arrow, 'dragend', function() {
            var point = {lat: that.arrow.getPosition().lat(), lng: that.arrow.getPosition().lng(),}
            that.triggerCallback('drag', point);
        });
    };

    getIcon() {
        if(this.isActual) { 
            return this.icon;
        }
        
        var that = this;
        var fillColor = this.isActual ? this.actualColor : this.color;
        var scale = this.isActual ? this.actualScale : this.scale;
//        var symbol = this.isActual ? google.maps.SymbolPath.BACKWARD_CLOSED_ARROW : 
//                google.maps.SymbolPath.CIRCLE;
        var symbol = google.maps.SymbolPath.CIRCLE;
        var strokeColor = this.isSelected ? this.selectedColor : this.strokeColor;
        return {
             path: symbol,
             fillOpacity: that.fillOpacity,
             fillColor: fillColor,
             strokeOpacity: that.strokeOpacity,
             strokeColor: strokeColor,
             strokeWeight: that.strokeWeight,
             scale: scale,
             zIndex:1200,
        };
    }

    hide() {
        this.arrow.setMap(null);
    }

    show(){
        if(!this._showLabel)return;
        this.arrow.setMap(this._mapArea.getMap());
    };

    select(){
      this.isSelected = true;
      this.arrow.setIcon(this.getIcon());
      
      this.arrow.setDraggable(true);
    };

    deselect(){
        this.isSelected = false;
        this.arrow.setIcon(this.getIcon());
    }; 

    setActual(isActual){
        this.isActual = isActual;
        this.arrow.setIcon(this.getIcon());
      };

    remove(){
        this.arrow.setMap(null);
    };

    showLabel(){
        this._showLabel = true;
        if(this._visibility){
          this.show();
        }
    };

    hideLabel(){
        this.hide();
        this._showLabel = false;
    };
}