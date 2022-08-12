var $ = require("jquery");

/**
 * Overlay for label on the map
 */
var Label = function (options) {
    this.setValues({map: options.map,style:{'zIndex':'1001'}});   
    var divOuter = $('<div>');
    $(divOuter).addClass('label_outer');   
    var divInner = $('<div>');
    $(divInner).append(options.showLabel ? options.name : "");   
    $(divInner).addClass('label_inner');  
    if(options.color) $(divInner).css({'color':options.color});  
    if(options.font) $(divInner).css({'font-family':options.font});  
    if(options.cls){
      $(divInner).addClass(options.cls);
    }

    $(divInner).addClass('noneborder');
    $(divOuter).append(divInner);   

    this.div_ = divOuter;    
    this.divInner_ = divInner;   
    this.setIconSize(options.icon); 
    this.name = options.name;
    this.showLabel = options.showLabel;  
};
Label.prototype = new google.maps.OverlayView;

Label.prototype.select = function(){
    $(this.divInner_).addClass('active_overlay');
    $(this.divInner_).removeClass('noneborder');
};

Label.prototype.deselect = function(){
    $(this.divInner_).removeClass('active_overlay');
    $(this.divInner_).addClass('noneborder');
};

Label.prototype.highlight = function(){
    $(this.divInner_).addClass('label_inner_highlighted');
};

Label.prototype.dehighlight = function(){
    $(this.divInner_).removeClass('label_inner_highlighted');
};

Label.prototype.show = function(){
    $(this.div_).css('visibility','visible');
};

Label.prototype.hide = function(){
    $(this.div_).css('visibility','hidden');
};

Label.prototype.onAdd = function() {
    var pane = this.getPanes().overlayLayer;

    $(pane).append(this.div_);
    var that = this;
    this.listeners_ = [
        google.maps.event.addListener(this, 'position_changed',function() { that.draw();}),
        google.maps.event.addListener(this, 'text_changed',function() { that.draw(); })
    ];
};

Label.prototype.onRemove = function() {
    $(this.div_).remove();
    for (var i = 0, I = this.listeners_.length; i < I; ++i) {
        google.maps.event.removeListener(this.listeners_[i]);
    }
};

Label.prototype.getHeight = function(){
    if(this.height === undefined){
        this.height = $(this.divInner_).height();
        if(!this.height) this.height = 0;
    }

    return this.height;
};

Label.prototype.setIconSize = function(icon) {
    var that = this;
    var image = new Image();
    image.onload = function(){
        that.iconHeight_ = this.height;
        that.iconWidth_ = this.width;
    };
    image.src = icon;
};

Label.prototype.draw = function() {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));
    var div = this.div_;
    $(div).css({left:position.x});
    $(div).css({top:position.y});

    var width = $(this.divInner_).width() > this.iconWidth_ ? $(this.divInner_).width() : this.iconWidth_;

    var topShift = this.iconHeight_ + this.getHeight()+3;
    $(this.divInner_).css({left: -$(this.divInner_).width()/2});       
    $(this.divInner_).css({top:-topShift});       
    $(this.divInner_).css({height:topShift});     
    $(this.divInner_).css({width:width});       
};

Label.prototype.showLabelText = function(){
    this.showLabel = true;
    $(this.divInner_).html(this.name);   
};
  
Label.prototype.hideLabelText = function(){
    this.showLabel = false;
    $(this.divInner_).html("");  
};

Label.prototype.setLabelText = function(text){
    if(!this.showLabel) return;
    this.name = text;
    this.showLabelText();
};

Label.prototype.setColor = function(color){
    $(this.divInner_).css({'color':color});  
};

Label.prototype.setBorder = function(border){
    $(this.divInner_).css({'border-width':border+'px'});  
};

module.exports = Label;