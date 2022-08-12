import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import 'babel-polyfill'
import createSagaMiddleware from 'redux-saga'
import {mainReducer} from '../reducers/main_reducer'
import {initMap} from '../actions/actions'
import React from 'react';
import ReactDOM from 'react-dom';
import Time from '../libs/time/time';
import Server from '../server/server.js';
import reduxCatch from 'redux-catch';
import App from '../components/app.jsx';
import mapSaga from '../sagas/map_saga'

function errorHandler(error, getState, lastAction, dispatch) {
  var server = new Server;
  server.jserrors(error, getState(), lastAction); 
}

const sagaMiddleware = createSagaMiddleware();
let store = createStore(mainReducer, {
    user:null,
    labels:window.ToJS.labels,
    lang:window.ToJS.lang,
    mapId:window.ToJS.mapId,
    mapVersion:window.ToJS.mapVersion,
    isMobile:window.ToJS.isMobile,
    isXXage:window.ToJS.isXXage,
    mapLoaded: false,
    mapRights: 'owner',
    url: window.location.href ,
    hreflangs:window.ToJS.hreflangs,
    mapSettings: {icons:true, labels: true, infoboxes: true, fog: false},
    mapState: {},
    time: new Time(),
    isPopupOpened: false,
    currentStep: 0,
    oldStep: null,
    popupType: 'CUSTOM',
    popupParams: {
        popupContent: '',
        popupTitle:  '',
    },
    isMenuDisplayed: false,
    isMainMenuDisplayed: false,
    isMapMenuDisplayed: false,
    isSearchBlockDisplayed: false,
    isTipDisplayed: false,
    tipParams: {},
    menuParams: {},
    editMode: false,
    currentPoint : {},
    screenZoom: 1,
    mobileEmulate: false,
    message: '',
    bigImageOpened: null,
}, applyMiddleware(thunk, sagaMiddleware, reduxCatch(errorHandler)));

ReactDOM.render(
    <Provider store={store}><App/></Provider>,
    document.getElementsByClassName('b-page-content')[0]
);
 
sagaMiddleware.run(mapSaga, store.dispatch);
store.dispatch(initMap(window.ToJS.mapId, window.ToJS.mapVersion ));

