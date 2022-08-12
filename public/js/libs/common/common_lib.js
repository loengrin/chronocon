var _ = require('lodash');

var CommonLib = {}

CommonLib.mixinPublisher = function(object){
    var callbacks = [];

    object.bind = function(event, callback){
        callbacks[event] = callback;
    }

    object.triggerCallback = function(){
        var argumentsArray =  Array.prototype.slice.call(arguments, 0);
        var event = argumentsArray[0];
        var params = argumentsArray.slice(1);
        if(callbacks[event]){
          callbacks[event].apply(null, params);
        }    
    }

    object.getCallback = function(event){
        return callbacks[event];
    }

    object.clearCallbacks = function(event){
        return callbacks[event] = undefined;
    }
    return object;
};


CommonLib.clone = function(obj) {
    return _.cloneDeep(obj);
}  

CommonLib.ksort = function(w) {
    var sArr = {};
    var tArr = [];
    var n = 0;
    for (i in w){
      tArr[n++] = i;
    }
    tArr = tArr.sort();
    n = tArr.length;
    for (var i=0; i<n; i++) {
      sArr[tArr[i]] = w[tArr[i]];
    }
    return sArr;
};

CommonLib.XOR = function(a,b){
    return ( a || b ) && !( a && b );
};	

CommonLib.getCoordLabel = function(coords, type){
    var cAbs = (coords>0 ? coords : -coords );  
    var d = parseInt(cAbs);
    var m = parseInt((cAbs - d) * 60);
    var s = parseInt((cAbs - d - m/60) * 3600 *100)/100;
    var add = type =='lat' ? (coords > 0 ? CHR.labels['N'] : CHR.labels['S']) : (coords > 0 ? CHR.labels['E'] : CHR.labels['W']); 
    return d+'° '+m+"′ "+s+'″ '+add;
};

CommonLib.getCoordFromLabel = function(stringVal){
    if(!stringVal) return null
    var posD = stringVal.indexOf('°');
    var posM = stringVal.indexOf('′');
    var posS = stringVal.indexOf('″');
    var d = stringVal.substring(0, posD).trim();
    var m = stringVal.substring(posD+1,posM).trim();
    var s = stringVal.substring(posM+1,posS).trim();
    stringVal = stringVal.replace(/\s+/g,"");
    var cAbs = stringVal.indexOf('W') !=-1 || stringVal.indexOf('S') !=-1|| stringVal.indexOf(CHR.labels['W']) !=-1 || stringVal.indexOf(CHR.labels['S']) != -1 ? -1 : 1;
    return  cAbs * (parseInt(d) + parseInt(m)/60 + parseInt(s)/3600);
};
export default CommonLib;