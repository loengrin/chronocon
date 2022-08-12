var $ = require("jquery");

var Server = function(){
}

Server.prototype._sendRequest = function(url, params, callback, data){
  var paramString = "";
  for(var paramKey in params){
    paramString += "&"+paramKey+"="+params[paramKey];
  }
 // console.log(data, JSON.stringify(data));
  $.ajax({
    url: url+(paramString ? "?"+paramString.substring(1) : ""),
    type: (data ? "POST" : "GET"),
    data: (data ? JSON.stringify(data): ""),
    success: function(ajax_data){   
   //     console.log(ajax_data);
      if(callback) callback(ajax_data);
    },
  });   
};

Server.prototype.getUploadedImage = function(imageName){
  return "/uploads/"+imageName;    
}

Server.prototype.loadMap = function(mapId, version, callback){
  var request = {'mapId':mapId,'version':version};
  this._sendRequest('/ajax/chronomaps/init',request, callback);
}

Server.prototype.signout = function(mapId, callback){
  var request = mapId ? {'mapId':mapId} : {};
  this._sendRequest('/user/signout',request, callback);
}

Server.prototype.register = function(mapId, fields, callback){
  var request = mapId ? {'mapId':mapId} : {};
  this._sendRequest('/user/register',request, callback, fields);
}

Server.prototype.saveMyData = function(fields, callback){
  this._sendRequest('/user/update',[], callback, fields);
}

Server.prototype.signin = function(mapId, fields, callback){
  var request = mapId ? {'mapId':mapId} : {};
  this._sendRequest('/user/signin',request, callback, fields);
}

Server.prototype.loadUserData = function(login, callback){
   this._sendRequest('/user/get'+(login ? '/'+login : ''),[], callback);
}

Server.prototype.tracking = function(action){
   this._sendRequest('/user/tracking/'+action,[]);
}

Server.prototype.loadDefaultIcons = function(unitType, callback){
  this._sendRequest('/ajax/images/get/'+unitType,null, callback);
}

Server.prototype.createChronomap = function(fields, callback){
  this._sendRequest('/ajax/chronomaps/create/',null, callback, fields);
}

Server.prototype.saveArticle = function(article, callback){  
   this._sendRequest('/article/set', null, callback, {'article':article});
}

Server.prototype.saveChronomapVersion = function(mapId, currentVersion, fields, callback){
  fields['currentVersion'] = currentVersion;
  this._sendRequest('/ajax/chronomaps/'+mapId+'/versions/create', null, callback, fields);
}

Server.prototype.loadPublishedMaps = function(lang, callback){
  this._sendRequest('/ajax/chronomaps/forImport', null, callback);
}

Server.prototype.loadChronomapObjects = function(mapId, callback){
  this._sendRequest('/ajax/chronomaps/'+mapId+'/getObjects', null, callback);
}

Server.prototype.loadObjectsByIds = function(mapId, objectsIds, callback){
  this._sendRequest('/ajax/chronomaps/'+mapId+'/getObjects', null, callback, objectsIds);
}

Server.prototype.loadChronomapVersions = function(mapId, callback){
  this._sendRequest('/ajax/chronomaps/'+mapId+'/versions/get', null, callback);
}

Server.prototype.deleteLastVersions = function(mapId, callback){
  this._sendRequest('/ajax/chronomaps/'+mapId+'/versions/deleteLast', null, callback);
}

Server.prototype.deleteChronomap = function(mapId){
  this._sendRequest('/ajax/chronomaps/'+mapId+'/delete',null);
}

Server.prototype.loadUserMaps = function(callback){
  this._sendRequest('/ajax/chronomaps/by-user', [], callback);
}

Server.prototype.initPage = function(callback){
  this._sendRequest('/user/get',[], callback);
}

Server.prototype.getUser = function(callback){
    this._sendRequest('/user/get',[], callback);
}

Server.prototype.rotateIcon = function(filename, callback){
  this._sendRequest("/ajax/images/rotate/"+filename, null, callback);
}

Server.prototype.jserrors = function(error, state, lastAction){
  this._sendRequest('/jserrors',[], null, {message: error.message, stack: error.stack});
}

Server.prototype.saveComment = function(fields, callback){
  this._sendRequest('/ajax/chronomaps/saveComment',[], callback, fields);
}


Server.prototype.getArticleText = function(articleId, callback){
  var prepareArticle = function(article){
    return article ? article.replace(/\n/g, "<br>"): "";
  };
  if(!articleId || !articleId.length) {
    callback();
    return;
  }
  var hasLocalStorage = typeof(window.localStorage) !== 'undefined';
  var article = null;
  if(hasLocalStorage){
    article = window.localStorage.getItem('article_'+articleId);
    if(article){
      callback(prepareArticle(article));
      return;
    }
  }    
  this._sendRequest('/article/get/'+articleId, null, function(response){
    if(hasLocalStorage){
       window.localStorage.setItem('article_'+articleId, response.article);
    }
    callback(prepareArticle(response.article));
  });          
}


module.exports = Server;
       
