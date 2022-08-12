import * as types from './action_types';
import * as popup_types from './popup_types';
import Server from '../server/server.js';

const COUNT_TICK_PER_SECOND = 10;

export const showPopup = (popupType, popupParams = null) => {
    return {
        type: types.SHOW_POPUP,
        popupType: popupType,
        popupParams: popupParams,
    };
}

export const hidePopup = () => {
    return {
        type: types.HIDE_POPUP,
    };
}

export const showMyDataPopup = () => {
    return (dispatch, getState) => {
       dispatch(showPopup(popup_types.MY_DATA, { myData: getState().user}));
    };
}

export const showMyMapsPopup = () => {
    return (dispatch, getState) => {
        var server = new Server;
        server.loadUserMaps(function(chronomaps) {
            dispatch(showPopup(popup_types.MY_MAPS, {chronomaps: chronomaps.maps}));
        });
    };
}

export const signin = (fields, nonAuthCallback, authCallback) => {
    return (dispatch, getState) => {
        var server = new Server;
        server.signin(getState().mapId, fields, function(authResult){
            if(authResult !== false){
                dispatch(signinSuccess(authResult.user, authResult.rights));
                if(authCallback) {
                    dispatch(authCallback());
                }
                server.tracking("signin: "+user.email);
            }
            else{
                nonAuthCallback();
            }
        });

    };
}

export const signinSuccess = (user, mapRights) => {
    return {
        type: types.SIGNIN_SUCCESS,
        user: user,
        mapRights: mapRights,
    }
}

export const initUser = () => {
    return (dispatch, getState) => {
        var server = new Server;
        server.getUser(function (authResult) {
            if (authResult !== false) {
                dispatch(initUserSuccess(authResult));
            }
        });
    };
}

export const initUserSuccess = (user) => {
    return {
        type: types.INIT_USER_SUCCESS,
        user: user
    }
}

export const signout = () => {
    return (dispatch, getState) => {
        var server = new Server;
        server.signout(null, function () {
            dispatch(signoutSuccess());
        });
    };

}

export const signoutSuccess = () => {
    return {
        type: types.SIGNOUT_SUCCESS,
    };
}

export const register = (fields, nonRegisterCallback, authCallback) => {
    return (dispatch, getState) => {
        var server = new Server;
        server.register(getState().mapId, fields, function(result){
            if (result !== false){
                fields.id = result.id;
                delete fields.password;
                dispatch(registerSuccess(fields, result.rights));
                if(authCallback) {
                    dispatch(authCallback());
                }
                 server.tracking("register: "+fields.email);
            }
            else {
                nonRegisterCallback();
            }
        });
    };
}

export const registerSuccess = (user, mapRights) => {
    return {
        type: types.REGISTER_SUCCESS,
        user: user,
        mapRights: mapRights,
    }
}

export const saveMyData = (fields) => {
    return dispatch => {
        var server = new Server;
        if(fields['password'] === ''){
            delete fields['password'];
            delete fields['passwordAgain'];
        }
        server.saveMyData(fields, function(result){
            if (result !== false){
                dispatch(saveMyDataSuccess(fields));
            }
        });
    };
}

export const saveMyDataSuccess = (user) => {
    return {
        type: types.SAVE_MY_DATA_SUCCESS,
        user: user
    }
}

export const deleteMap = (mapId) => {
    return dispatch => {
        var server = new Server;
        server.deleteChronomap(mapId);
        dispatch(deleteMapSuccess(fields));
    };
}

export const deleteMapSuccess = () => {
    return {
        type: types.DELETE_MAP_SUCCESS,
    }
}

export const initMap = (mapId, mapVersion) => {
    return (dispatch, getState) => {
        var server = new Server;
        dispatch(showMessage(getState().labels["Loading..."], true));
        dispatch(initMapStarted(mapId, mapVersion));
        server.loadMap(mapId, mapVersion, function (settings) {
            if (settings !== false) {
                dispatch(initMapSuccess(settings.objects, settings.baseUrl, settings.user, settings.rights));
                dispatch(showMessage(getState().labels['Map loaded']));

              
                //dispatch(showPopup(popup_types.CHAIN_LIST));
                server.tracking("initMap "+getState().mapId+" ("+getState().time.getTimeObjectById('MAIN').getField('name')+")");
            }
        });
    };
}

export const initMapStarted = (mapId, mapVersion) => {
    return {
        type: types.INIT_MAP_STARTED,
        mapId: mapId,
        mapVersion: mapVersion,
       }
}

export const initMapSuccess = (objects, baseUrl, user, mapRights) => {
    return {
        type: types.INIT_MAP_SUCCESS,
        objects: objects,
        baseUrl: baseUrl,
        user: user,
        mapRights: mapRights
    }
}

export const rewind = (step, source) => {
    return {
        type: types.REWIND,
        step: step,
        source: source,
    }
}

export const rewindToEvent = (event, chainId) => {
    console.log(event, chainId);
    return {
        type: types.REWIND_TO_EVENT,
        event: event,
        chainId: chainId,
    }
}

export const showList = () => {
    return {
        type: types.SHOW_LIST,
    }
}

export const showChain = (chainId) => {
    return {
        type: types.SHOW_CHAIN,
        chainId: chainId,
    }
}


export const playToEvent = (event, chainId) => {
    return (dispatch, getState) => {
        var eventBeginStep = getState().time.getCalendar().getStepByDate(event.getDateBegin());
        var toStep = eventBeginStep !== undefined ? eventBeginStep : getState().time.getCountSteps();

        var currentTick = 0;
        var countTicks = ( toStep - getState().currentStep) * COUNT_TICK_PER_SECOND;
        var playerInterval = 1000/COUNT_TICK_PER_SECOND;
        if(!countTicks){
            dispatch(playToEventFinished(toStep, event, chainId));
        }

        var tick = function(){
            currentTick++;

            if(currentTick >= countTicks){
                dispatch(playToEventFinished(toStep, event, chainId));
                return;
            }

            var currentStep = getState().currentStep;
            if(currentTick % COUNT_TICK_PER_SECOND === 0) {
                currentStep++;
                dispatch(rewind(currentStep,'tick'));
            }
            var fraction = (currentTick % COUNT_TICK_PER_SECOND)/COUNT_TICK_PER_SECOND;
            dispatch(playToEventTick(currentStep, fraction));

            setTimeout(function(){tick();}, playerInterval);
        };
        setTimeout(function(){tick();}, playerInterval);
        
        dispatch(playToEventStarted(event, chainId));
    };
}

export const playToEventStarted = (event, chainId) => {
   return {
        type: types.PLAY_TO_EVENT_STARTED,
        event: event,
        chainId: chainId,
    }
}

export const playToEventTick = (step, fraction) => {
    return {
        type: types.PLAY_TO_EVENT_TICK,
        step: step,
        fraction: fraction
    }
}

export const playToEventFinished = (step, event, chainId) => {
    return {
        type: types.PLAY_TO_EVENT_FINISHED,
        step: step,
        event: event,
        chainId: chainId,
    }
}

export const setIndexMode = (indexMode) => {
    return {
        type: types.SET_INDEX_MODE,
        indexMode: indexMode,
    }
}


export const changeActualPoint = (point) => {
    return {
        type: types.CHANGED_ACTUAL_POINT,
        point: point,
    }
}

export const hideUnitMenu = () => {
    return {
        type: types.HIDE_UNIT_MENU,
    }
}

export const toggleMainMenu = () => {
    return {
        type: types.TOGGLE_MAIN_MENU,
    }
}

export const toggleMapMenu = () => {
    return {
        type: types.TOGGLE_MAP_MENU,
    }
}

export const hideMapMenu = () => {
    return {
        type: types.HIDE_MAP_MENU,
    }
}

export const selectUnit = (unit) => {
    return {
        type: types.UNIT_SELECT,
        unit: unit
    }
}


export const mouseMove = (point) => {
    return {
        type: types.MOUSE_MOVE,
        point: point
    }
}

export const showUnitMenu = (unit, vertex, path, mousePosition) => {
    return {
        type: types.SHOW_UNIT_MENU,
        unit: unit,
        vertex: vertex,
        path: path,
        mousePosition: mousePosition,
    }
}

export const saveUnit = (unit, fields, isNew) => {
    return (dispatch, getState) => {
        var saveResult = dispatch(saveUnitSuccess(unit, fields, isNew));
      
        var calendar = getState().time.getCalendar();
        var currentStep = getState().currentStep;
        if(calendar.getStepByDate(saveResult.unit.getDateBegin()) > currentStep
            || calendar.getStepByDate(saveResult.unit.getDateEnd()) < currentStep) {
        
           dispatch(rewind(calendar.getStepByDate(saveResult.unit.getDateBegin()),'save'));
        } 
    }
}

export const saveUnitSuccess = (unit, fields, isNew) => {
    return {
        type: types.SAVE_UNIT_SUCCESS,
        unit: unit,
        fields: fields,
        isNew: isNew,
    }
}

export const saveDynamicStyle = (unit, dynamicStyle, isNew) => {
    return {
        type: types.SAVE_DYNAMIC_STYLE,
        unit: unit,
        dynamicStyle: dynamicStyle,
        isNew: isNew,
    }
}

export const saveUnitCoordinates = (unit, coordinates, segmentNumber) => {
    return {
        type: types.SAVE_UNIT_COORDINATES,
        unit: unit,
        coordinates: coordinates,
        segmentNumber: segmentNumber,
    }
}

export const deleteUnit = (unit) => {
    return {
        type: types.DELETE_UNIT,
        unit: unit,
    }
}

export const copyUnit = (unit) => {
    return {
        type: types.COPY_UNIT,
        unit: unit,
    }
}

export const deselectUnit = () => {
    return {
        type: types.UNIT_DESELECT,
    }
}

export const deleteDynamicStyle = (unit) => {
    return {
        type: types.DELETE_DYNAMIC_STYLE,
        unit: unit,
    }
}

export const moveEventUp = (event, chainId, indexMode) => {
    return {
        type: types.MOVE_EVENT_UP,
        event: event,
        chainId: chainId,
        indexMode: indexMode,
    }
}

export const moveEventDown = (event, chainId, indexMode) => {
    return {
        type: types.MOVE_EVENT_DOWN,
        event: event,
        chainId: chainId,
        indexMode: indexMode,
    }
}

export const deleteEvent = (event) => {
    return {
        type: types.DELETE_EVENT,
        event: event,
    }
}

export const moveChainUp = (chainId) => {
    return {
        type: types.MOVE_CHAIN_UP,
        chainId: chainId,
    }
}

export const moveChainDown = (chainId) => {
    return {
        type: types.MOVE_CHAIN_DOWN,
        chainId: chainId,
    }
}

export const deleteChain = (chainId) => {
    return {
        type: types.DELETE_CHAIN,
        chainId: chainId,
    }
}

export const saveChain = (chainId, fields, isNew) => {
    return {
        type: types.SAVE_CHAIN,
        chainId: chainId,
        fields: fields,
        isNew: isNew,
    }
}

export const saveEvent = (eventId, fields, isNew) => {
     return (dispatch, getState) => {
        var saveResult = dispatch(saveEventSuccess(eventId, fields, isNew));
      
        var calendar = getState().time.getCalendar();
        var currentStep = getState().currentStep;
        if(calendar.getStepByDate(saveResult.unit.getDateBegin()) != currentStep) {
           dispatch(rewindToEvent(saveResult.unit));
        } 
    }
}

export const saveEventSuccess = (eventId, fields, isNew) => {
    return {
        type: types.SAVE_EVENT_SUCCESS,
        eventId: eventId,
        fields: fields,
        isNew: isNew,
    }
}

export const saveUnitDescription = (unitId, fields, isStatic, dynamicDescriptionId, isNew) => {
    return {
        type: types.SAVE_DESCRIPTION,
        unitId: unitId,
        fields: fields,
        isStatic: isStatic,
        dynamicDescriptionId: dynamicDescriptionId,
        isNew: isNew,
    }
}

export const deleteUnitDescription = (unitId, dynamicDescriptionId) => {
    return {
        type: types.DELETE_DESCRIPTION,
        unitId: unitId,
        dynamicDescriptionId: dynamicDescriptionId,
    }
}

export const saveUnitTable = (unitId, fields, isStatic, dynamicTableId, isNew) => {
    return {
        type: types.SAVE_TABLE,
        unitId: unitId,
        fields: fields,
        isStatic: isStatic,
        dynamicTableId: dynamicTableId,
        isNew: isNew,
    }
}

export const deleteUnitTable = (unitId, dynamicTableId) => {
    return {
        type: types.DELETE_TABLE,
        unitId: unitId,
        dynamicTableId: dynamicTableId,
    }
}

export const importUnits = (chronomapId, objectIds) => {
    return (dispatch, getState) => {
        var server = new Server;
        server.loadObjectsByIds(chronomapId, objectIds, function(objects) {
            dispatch(importUnitsSuccess(objects));
            dispatch(hidePopup());
        });
    };
}

export const importUnitsSuccess = (objects) => {
    return {
        type: types.IMPORT_UNITS_SUCCESS,
        objects: objects,
    }
}

export const saveTableTemplates = (templates) => {
    return {
        type: types.SAVE_TABLE_TEMPLATES,
        templates: templates,
    }
}

export const showSearchBlock = () => {
    return {
        type: types.SHOW_SEARCH_BLOCK,
    }
}

export const hideSearchBlock = () => {
    return {
        type: types.HIDE_SEARCH_BLOCK,
    }
}

export const searchOnMap = (searchString) => {
    return {
        type: types.SEARCH_ON_MAP,
        searchString: searchString,
    }
}

export const changeMapSetting = (settingKey) => {
    return {
        type: types.CHANGE_MAP_SETTING,
        settingKey: settingKey,
    }
}

export const goToUnit = (unit) => {
    return (dispatch, getState) => {
        var state = getState();
        
        var step = state.time.getCalendar().getStepByDate(unit.getDateBegin())
        dispatch(rewind(step,'goToUnit'));
        if(unit.getField('eventId')) {
            var event = state.time.getTimeObjectById(unit.getField('eventId'));
            dispatch(rewindToEvent(event));
        }      
        dispatch(setUnitScreen(unit));
    };
    
}

export const setUnitScreen = (unit) => {
    return {
        type: types.SET_UNIT_SCREEN,
        unit: unit,
    }
}

export const saveMapInfo = (fields, isNew) => {
    return {
        type: types.SAVE_MAP_INFO,
        fields: fields,
        isNew: isNew,
    }
}

export const showUnitTip = (unitId, mousePosition) => {
    return {
        type: types.SHOW_UNIT_TIP,
        mousePosition: mousePosition,
        unitId: unitId,
      }
}

export const hideUnitTip = () => {
    return {
        type: types.HIDE_UNIT_TIP,
    }
}

export const saveDynamicTerritory = (unitId) => {
    return {
        type: types.SAVE_DYNAMIC_TERRITORY,
        unitId: unitId,
    }
}

export const deleteDynamicTerritory = (unitId) => {
    return {
        type: types.DELETE_DYNAMIC_TERRITORY,
        unitId: unitId,
    }
}

export const setEventScreen = (eventId) => {
    return {
        type: types.SET_EVENT_SCREEN,
        eventId: eventId,
    }
}

export const setMapZoom = (mapZoom) => {
    return {
        type: types.SET_MAP_ZOOM,
        mapZoom: mapZoom,
    }
}

export const toggleEventShowMarker = (unit) => {
    return {
        type: types.SET_EVENT_SHOW_MARKER,
        unit: unit,
    }
}

export const showMapSavePopup = (saveAsMode) => {
    return (dispatch, getState) => {
        var state = getState();

        if(!state.user){
            dispatch(showPopup(popup_types.SIGNIN_OR_REGISTER, {callback: () => {
                return showMapSavePopup(saveAsMode);
            }}));
        }
        else {
            if(state.mapRights != 'owner' && state.mapRights != 'editor' && !saveAsMode) {
                dispatch(showPopup(popup_types.NO_RIGHTS_MESSAGE));
            }
            else {
                dispatch(showPopup(popup_types.SAVING_MAP, {saveAsMode: saveAsMode}));
            }
        }
    };
}

export const zoomPlus = (step) => {
    return {
        type: types.ZOOM_PLUS,
        step: step
    }
}

export const zoomMinus = (step) => {
    return {
        type: types.ZOOM_MINUS,
        step: step
    }
}

export const enableEditMode = () => {
    
    return (dispatch, getState) => {
        dispatch(setEnabledEditModeState());
        if(getState().selectedUnit) {
            dispatch(selectUnit(getState().selectedUnit));
        }
        dispatch(showMessage(getState().labels["Edit mode enabled"]));
        
    };
}

export const setEnabledEditModeState = () => {
    return {
        type: types.ENABLE_EDIT_MODE
    }
}

export const disableEditMode = () => {
    return (dispatch, getState) => {
        dispatch(deselectUnit());
        dispatch(setDisabledEditModeState());
    };
}

export const setDisabledEditModeState = () => {
    return {
        type: types.DISABLE_EDIT_MODE
    }
}

export const showMessage = (message, isLoading) => {
    return dispatch => {
        dispatch(displayMessage(message, isLoading));
        if(!isLoading) {
            setTimeout(function () {
                dispatch(hideMessage());
            }, 3000);
        }
    };
}

export const displayMessage = (message, isLoading) => {
    return {
        type: types.DISPLAY_MESSAGE,
        message: message,
        isLoading: isLoading,
    }
}

export const hideMessage = () => {
    return {
        type: types.HIDE_MESSAGE,
    }
}

export const unitClicked = (unit) => {
    return (dispatch, getState) => {
        if(!getState().editMode && unit.getType() === 'fog'){
            if(confirm(getState().labels['Disable unknown area']+'?')) {
                dispatch(changeMapSetting('fog'));
            }
            return;
        }
        if(!getState().editMode && unit.getType() === 'event'){
            dispatch(rewindToEvent(unit))
            return;
        }

        if(!getState().editMode) {
            dispatch(showPopup(popup_types.UNIT_INFO, {unit: unit}));
        }
        dispatch(selectUnit(unit));
    };
}

export const openBigImage = (bigImage) => {
    return {
        type: types.OPEN_BIG_IMAGE,
        bigImage: bigImage
    }
}

export const hideBigImage = (bigImage) => {
    return {
        type: types.HIDE_BIG_IMAGE,
    }
}

export const changeMapType = (mapTypeId) => {
    return {
        type: types.CHANGE_MAP_TYPE,
        mapTypeId: mapTypeId
    }
}

export const saveComment = (email, subject, message) => {
    return (dispatch, getState) => {
        var server = new Server;
        server.tracking("signin: "+subject);
        var fields = {
            email: email,
            subject: subject,
            message: message,
            mapId: getState().mapId,
        }
        server.saveComment(fields, function (saveResult) {
            if (saveResult !== false) {
                dispatch(hidePopup());
                dispatch(showMessage(getState().labels['Message saved successfully']));
            }
        });
    };
}