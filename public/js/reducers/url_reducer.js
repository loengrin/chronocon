import { getMapCenterOnUnit  } from './unit_reducer';
import * as popup_types from '../actions/popup_types';

/**
 * Functions getStateByUrl, getUrlByState for url generation from state
 * and restoring state from url
 */

export const getStateByUrl = (url, time, isXXage) => {
    var indexStore = time.getIndexStore();
    var state = {};
    if(url && getParamFromUrl(url, 'loadUnitId', true)){
        state = initStateByLoadedUnit(url, time);
    }
    else if(url && getParamFromUrl(url, 'loadEventId', true)){
        state = initStateByLoadedEvent(url);
    }
    else if(url && getDateFromUrl(url, time)){
        console.log(url);
        state = initStateByAll(url, time);
    }
    else {
        var defaultIndexMode = indexStore.getDefaultIndexMode();
        var firstEventId = indexStore.getFirstEvent(defaultIndexMode);
        var zoom = time.getTimeObjectById('MAIN').getField('initialZoom');
        if (firstEventId) {
        //if (firstEventId && !indexStore.hasChainsMode()) {
            var firstEvent = time.getTimeObjectById(firstEventId['eventId']);
            state = initStateByEvent(firstEvent,firstEventId['chainId'],defaultIndexMode, time, zoom, indexStore.hasChainsMode());
            if(isXXage) {
                 state.currentEvent = firstEvent;
                 state.currentChain = firstEventId['chainId'];
                 state.listShowed = false;
                 console.log(state);
            }
        }
        else {
            state = initDefaultState(defaultIndexMode, zoom);
        }
        //state = initDefaultState(defaultIndexMode);
    }
    console.log(state);
    return state;
}

const getParamFromUrl = (url, param, nonDigit) => {
    var re = new RegExp(param+"(?:/|=)("+(nonDigit ? '[\\w|.]+' : '[\\d|.]+')+")");
    var matchs = url.match(re);
    return matchs && matchs[1] ?  (nonDigit ? matchs[1]: parseInt(matchs[1])) : null;
};

const initStateByLoadedUnit = (url, time) => {
    var unitId = getParamFromUrl(url, 'loadUnitId', true);
    var selectedUnit = time.getTimeObjectById(unitId);
    return setStateByUnit(selectedUnit, time);
}

const setStateByUnit = (selectedUnit, time) => {
    return {
        selectedUnit: selectedUnit,
        mapState : {
            mapZoom: 2 + parseInt(selectedUnit.getField('size')) < parseInt(selectedUnit.getField('sizeMax')) ?
            2 + parseInt(selectedUnit.getField('size')) : parseInt(selectedUnit.getField('size')),
            mapCenter: getMapCenterOnUnit(selectedUnit, selectedUnit.getDateBegin()),
        },
        currentStep: time.calendar.getStepByDate(selectedUnit.getDateBegin())
    }
}

const initStateByLoadedEvent = (url, time) => {
    var eventId = getParamFromUrl(url, 'loadEventId', true);
    var currentEvent = time.getTimeObjectById(eventId);

    return {
        indexMode: 'dates',
        currentEvent: currentEvent,
        currentChain: null,
        mapState:{mapZoom: currentEvent.getField('mapZoom'), mapCenter: currentEvent.getField('arrowPoint')},
        currentStep: time.calendar.getStepByDate(currentEvent.getDateBegin())
    }
}

const initStateByEvent = (event, chainId, indexMode, time, zoom, listShowed) =>{
    var state = {
        indexMode: indexMode,
        listShowed: listShowed,
 //       currentEvent: event,
 //       currentChain: chainId,
        mapState:{mapZoom: (zoom ? zoom : event.getField('mapZoom')), mapCenter: event.getField('arrowPoint')},
 //       currentStep: time.calendar.getStepByDate(event.getDateBegin())
    }
    if(!listShowed) {
        state.currentChain = time.getIndexStore().NO_CHAIN;
    }
    
    return state;
}

const  initStateByAll = (url, time) => {
    var date = url ? getDateFromUrl(url, time) : null;
    var step = date ? time.calendar.getStepByDate(date) : 0;
    var state = {mapState:{}};
    state.currentStep = step;

    var newMapCenter = {'lat':parseFloat(getParamFromUrl(url, 'lat', true)),'lng':parseFloat(getParamFromUrl(url, 'lng', true))};
    if(newMapCenter.lat && newMapCenter.lng ) {
        state.mapState.mapCenter = newMapCenter;
    }
    var newMapZoom = getParamFromUrl(url, 'zoom');
    if(newMapZoom) {
        state.mapState.mapZoom = newMapZoom;
    }

    var unitId = getParamFromUrl(url, 'unitId', true);
    var selectedUnit = unitId ? time.getTimeObjectById(unitId) : null;
    if(selectedUnit){
        state.selectedUnit = selectedUnit;
    }

    var eventId = getParamFromUrl(url, 'eventId', true);
    var currentEvent = eventId ? time.getTimeObjectById(eventId) : null;
    if(currentEvent){
        state.currentEvent = currentEvent;
    }

    var indexMode = getParamFromUrl(url, 'indexMode', true);
    if(indexMode){
        state.indexMode = indexMode == "null" ? null : indexMode;
    }
    
    var listShowed = getParamFromUrl(url, 'listShowed', true);
    if(listShowed){
        state.listShowed = true;
    }

    var chainId = getParamFromUrl(url, 'chainId', true);
    if(chainId){
        state.currentChain = chainId;
    }
    return state;
}

const getDateFromUrl = (url, time) =>{
    var mode = time.getCalendar().getMode();

    var date = {};
    var matchs = url.match(/year=(-?\d+)/i);
    if(!matchs || !matchs[1]) return null;
    date.year =  matchs[1];

    if(mode === 'day' || mode === 'month'|| mode === 'hour'){
        var matchs = url.match(/month=(\d+)/i);
        if(!matchs || !matchs[1]) return null;
        date.month = matchs[1];
    }

    if(mode === 'day' || mode === 'hour'){
        var matchs = url.match(/day=(\d+)/i);
        if(!matchs || !matchs[1]) return null;
        date.day =  matchs[1];
    }

    if(mode === 'hour'){
        var matchs = url.match(/hour=(\d+)/i);
        if(!matchs || !matchs[1]) return null;
        date.hour =  matchs[1];
    }
    return date;
} ;

const initDefaultState = (defaultIndexMode,zoom) =>{
    return {
        currentEvent: null,
        currentChain: null,
        indexMode: null,
        mapState: { mapZoom: zoom ? zoom : 4, mapCenter: {lat:40.17, lng:4.83}},
        currentStep: 0
    }
}

export const getUrlByState = (state) => {
    console.log(state);
    //console.trace();
    var url = state.isXXage ? '#' : state.baseUrl + '#';
    var currentDate =  state.time.getCalendar().getDateByStep(state.currentStep);
    url += getDateUrl(currentDate, state.time.getCalendar().getMode());
    url += "&zoom=" + state.mapState.mapZoom;
    url += state.mapState.mapCenter ? "&lat=" + state.mapState.mapCenter.lat + "&lng=" + state.mapState.mapCenter.lng : "";
    if (!state.editMode) {
        url += state.selectedUnit ? "&unitId=" + state.selectedUnit.getId() : "";
    }
    url += state.currentEvent ? "&eventId=" + state.currentEvent.getId() : "";
    url += '&indexMode=' + state.indexMode;
    if (state.indexMode == 'chains') {
        url += state.currentChain ? "&chainId=" + state.currentChain : "";
    }
    if (state.listShowed) {
        url += "&listShowed=" + state.listShowed;
    }
    url = url.replace('\?&','?');
    return url;
};

const getDateUrl = (date, dateMode) => {
    switch(dateMode){
        case 'century':
        case 'decade':
        case 'series':
        case 'year': return 'year='+date.year;
        case 'month': return 'year='+date.year+"&month="+date.month;
        case 'day': return 'year='+date.year+"&month="+date.month+"&day="+date.day;
        case 'hour': return 'year='+date.year+"&month="+date.month+"&day="+date.day+"&hour="+date.hour;
    }
}



