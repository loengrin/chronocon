var $ = require("jquery");
import CommonLib from '../common/common_lib.js';

/**
 * Class for managing general map events, map initialization, map postition and zoom. Also search on the map.
 */
export class MapArea
{
    constructor(tag, point, mapType, mapTypeOptions){
        var zoom = mapType === 'FILE' ? 1: 9;
        var mapOptions = {
            center: new google.maps.LatLng(point.lat,point.lng),
            zoom: parseInt(zoom),
            mapTypeControl: false,
            streetViewControl: false,
            panControl: false,
            scaleControl: false,
            fullscreenControl: false,
            zoomControl: false,

            mapTypeId: mapType === 'SATELLITE' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP,
                style: google.maps.ZoomControlStyle.SMALL
            }
        };

        if(mapType === 'FILE'){
            mapOptions['mapTypeControlOptions'] = { mapTypeIds: ['file']};
        } 
        this._map = new google.maps.Map($(tag)[0], mapOptions); 
        if(mapType === 'FILE'){
            this._setFileMapTypeOptions(mapTypeOptions);
        }
        this._searchMarker = null;
        CommonLib.mixinPublisher(this);  
        this._bindMapEvents();
    };

    _setFileMapTypeOptions(mapTypeOptions){
        var dir = mapTypeOptions.file.substring(0,mapTypeOptions.file.indexOf('.'));
        var fileTypeOptions = {
            getTileUrl: function(coord, zoom) {
                var tileRange = 1 << (zoom-1);
                if(coord.x < 0 || coord.y < 0 || coord.x >= tileRange || coord.y >= tileRange ) return null;
                return '/uploads/'+dir+'/' + (zoom) + '/' + coord.x + '_' + coord.y + '.jpg';  
            },
            tileSize: new google.maps.Size(mapTypeOptions['width'], mapTypeOptions['height']),
            maxZoom: parseInt(mapTypeOptions.maxScale),
            minZoom: 1,   
            name: 'file',
            radius: 10000
        };

        function EvenMapProjection() {
            var xPerLng = mapTypeOptions['width']/180;
            var yPerLat = mapTypeOptions['height']/180;
            this.fromLatLngToPoint = function(latlng) {
                var x = (latlng.lng())*xPerLng;
                var y = (latlng.lat())*yPerLat;
                return new google.maps.Point(x, y);
            };
            this.fromPointToLatLng = function(point) {
                var lat = point.y/yPerLat;
                var lng = point.x/xPerLng;
                return new google.maps.LatLng(lat, lng);
            };
        }

        var fileMapType = new google.maps.ImageMapType(fileTypeOptions);
        fileMapType.projection = new EvenMapProjection();
        this._map.mapTypes.set('file', fileMapType);
        this._map.setMapTypeId('file');
    };

    _bindMapEvents(){
        var that = this;
        google.maps.event.addListener(that._map, 'zoom_changed', function() {
           that.triggerCallback('zoomChanged');
        });
        google.maps.event.addListener(that._map, 'center_changed', function() {
           that.triggerCallback('centerChanged');
        });
        google.maps.event.addListener(that._map, 'click', function() {
            that.triggerCallback('click');
        });
        window.onresize = function(){
            google.maps.event.trigger(that._map, 'resize');
        }
        that.keyPressed = null;
        $(document).keydown (function(e){
            that.keyPressed = String.fromCharCode(e.keyCode);
        });
        $(document).keyup(function(e){
            that.keyPressed = null
        });
        this._visibility = true;
    };

    getMap(){
        return this._map;
    };

    getMapCenter(){
        var center = this._map.getCenter();
        return {lat:parseFloat(center.lat()), lng:parseFloat(center.lng())};
    };

    getMapZoom(){
        return this._map.getZoom();     
    };

    getMapFrame(){
        var bounds = this._map.getBounds();
        if(!bounds) {
            return;
        }
        var width = bounds.getNorthEast().lat()-bounds.getSouthWest().lat();
        var height = bounds.getNorthEast().lng()-bounds.getSouthWest().lng();	
        return {width: width, height: height};
    };

    setMapCenter(point){
        var center = (this.convertPoints([point]))[0];
        this._map.setCenter(center);  
    };

    setMapZoom(zoom){
        this._map.setZoom(parseInt(zoom));     
    };
    
    setMapType(mapTypeId){
        this._map.setMapTypeId(mapTypeId === 'SATELLITE' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP);     
    };

    convertPoints(points){
        var mapPoints = [];
        for(var i=0;i<points.length;i++){
            if(!points[i]){console.log(points,i);console.trace()}
            mapPoints.push(new google.maps.LatLng(points[i].lat,points[i].lng, true));
        }
        return mapPoints;
    };

    convertGMapPoints(mapPoints){
        var points = [];
        for(var i=0;i<mapPoints.length;i++){
            points.push({lat:mapPoints[i].lat(),lng:mapPoints[i].lng()});
        }
        return points;
    };  

    getScreenPosition(position){
        var scale = Math.pow(2, this._map.getZoom());
        var nw = new google.maps.LatLng(
            this._map.getBounds().getNorthEast().lat(),
            this._map.getBounds().getSouthWest().lng()
        );
        var worldCoordinateNW = this._map.getProjection().fromLatLngToPoint(nw);
        var worldCoordinate = this._map.getProjection().fromLatLngToPoint(position);
        return {
            x:Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
            y:Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
        };      
    };

    search(search){
        var that = this;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': search}, function(results, status) {   
            if(!results.length){
                that._searchMarker.setVisible(false);
                return;
            }
            that._map.setCenter( results[0].geometry.location); 
            if(!that._searchMarker){
                that._searchMarker = new google.maps.Marker({
                    map: that._map,
                    position: results[0].geometry.location
                });      
            }
            else{
                that._searchMarker.setPosition(results[0].geometry.location);
            }   
            that._searchMarker.setVisible(true);
        });
    };

    setSearchMarkerVisibility(visibility){
        if(!this._searchMarker) return;
        this._searchMarker.setVisible(visibility);
    } 

    getKeyPressed(){
        return this.keyPressed;
    }
}
