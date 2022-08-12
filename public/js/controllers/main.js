import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import {mainReducer} from '../reducers/main_reducer'
import {initUser} from '../actions/actions'
import React from 'react';
import ReactDOM from 'react-dom';
import MainMenuArea from '../components/panels/main_menu_area.jsx';
import PopupArea from '../components/panels/popup_area.jsx';
import NewMapButton from '../components/panels/new_map_button.jsx';
import Server from '../server/server.js';
import reduxCatch from 'redux-catch';

function errorHandler(error, getState, lastAction, dispatch) {
  var server = new Server;
  server.jserrors(error, getState(), lastAction); 
}

let store = createStore(mainReducer,{
    user:null,
    labels:window.ToJS.labels,
    lang:window.ToJS.lang,
    hreflangs:window.ToJS.hreflangs,
    popupType: 'CUSTOM',
    isMobile:window.ToJS.isMobile,
}, applyMiddleware(thunk, reduxCatch(errorHandler)))

ReactDOM.render(
    <Provider store={store}><MainMenuArea isOpened={!window.ToJS.isMobile}/></Provider>,
    document.getElementsByClassName('b-main-menu-wrapper')[0]
);
ReactDOM.render(
    <Provider store={store}><PopupArea/></Provider>,
    document.getElementsByClassName('b-popup-area-wrapper')[0]
);

store.dispatch(initUser());



