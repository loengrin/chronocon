<?php

use App\Http\Controllers\PageController;


$isXXAge = Request::getHost() == 'xxage.ru';

Route::get('/img/{img}', function(){
   App::abort(404,'Image not exists');
});

Route::get('/img/{img}', function(){
    App::abort(404,'Image not exists');
});

Route::get('/uploads/{img}', function(){
   App::abort(404,'Image not exists');
});

Route::get('/performance-now.js.map', function(){
    App::abort(404,'Image not exists');
});

Route::post('/jserrors', 'Controller@logJsError');


Route::get('/', 'ChronomapController@index')->middleware('lang');
if($isXXAge) {
  Route::get('/', 'ChronomapController@xxAge')->middleware('lang');
}
Route::get('/{lang}', 'ChronomapController@index')->middleware('lang');
Route::get('/{lang}/users-maps', 'ChronomapController@usersMaps')->middleware('lang');


Route::get('{lang}/about', 'PageController@about')->middleware('lang');
Route::get('{lang}/contacts', 'PageController@contacts')->middleware('lang');
Route::get('{lang}/docs', 'PageController@docs')->middleware('lang');
Route::get('{lang}/docs/{page}', 'PageController@docs')->middleware('lang');
Route::get('{lang}/progress', 'PageController@progress')->middleware('lang');
Route::get('{lang}/donate', 'PageController@donate')->middleware('lang');

Route::get('/user/get/{login?}', 'UserController@get');
Route::post('/user/signin', 'UserController@signin')->middleware('lang');
Route::get('/user/signout', 'UserController@signout');
Route::post('/user/register', 'UserController@register')->middleware('lang');
Route::post('/user/update', 'UserController@update');
Route::get('/user/tracking/{action}', 'UserController@insertTracking');


Route::get('{lang}/id/{id}', 'ChronomapController@mapInfoById')->middleware('lang');
Route::get('{lang}/{url}', 'ChronomapController@mapInfoByUrl')->middleware('lang');

Route::get('{lang}/id/{mapId}/chain/id/{chainId}', 'ChronomapController@chainByIdAndMapId')->middleware('lang');
Route::get('{lang}/{mapUrl}/chain/id/{chainId}', 'ChronomapController@chainByIdAndMapUrl')->middleware('lang');


Route::get('{lang}/map/id/{id}', 'ChronomapController@chronomapById')->middleware('lang');
Route::get('{lang}/map/id/{id}/version/{version}', 'ChronomapController@chronomapById')->middleware('lang');
Route::get('{lang}/map/{url}', 'ChronomapController@chronomapByUrl')->middleware('lang');
Route::get('{lang}/map/{url}/version/{version}', 'ChronomapController@chronomapByUrl')->middleware('lang');

Route::get('/article/get/{articleId?}', 'ArticleController@get');
Route::post('/article/set', 'ArticleController@set');

Route::post('/ajax/chronomaps/create/', 'ChronomapController@create');
Route::get('/ajax/chronomaps/by-user', 'ChronomapController@getByUser');
Route::get('/ajax/chronomaps/init', 'ChronomapController@init')->middleware('lang');
Route::post('/ajax/chronomaps/{mapId}/versions/create', 'ChronomapController@createVersion');
Route::get('/ajax/chronomaps/{mapId}/versions/get', 'ChronomapController@getVersions');
Route::get('/ajax/chronomaps/{mapId}/delete', 'ChronomapController@delete');
Route::get('/ajax/chronomaps/{mapId}/versions/deleteLast', 'ChronomapController@deleteLastVersion');

Route::get('/ajax/chronomaps/{mapId}/getObjects', 'ChronomapController@getObjectsGroupedByTypes');
Route::post('/ajax/chronomaps/{mapId}/getObjects', 'ChronomapController@getObjectsByIds');
Route::get('/ajax/chronomaps/forImport', 'ChronomapController@getForImport');
Route::post('/ajax/chronomaps/saveComment', 'ChronomapController@chronomapComment');

Route::get('/ajax/images/get/{type}', 'ImageController@getDefaultIcons');
Route::post('/ajax/images/save/{type}', 'ImageController@saveImage');
Route::get('/ajax/images/rotate/{image}', 'ImageController@rotateImage');

View::composer('headers.menu', function($view){
    $view->with('menuItems', PageController::getMenu());
});
