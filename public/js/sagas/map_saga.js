import { call, put, select, takeEvery, takeLatest, take } from 'redux-saga/effects'
import { channel } from 'redux-saga';
import { MapController } from '../map/map_controller';
import * as types from '../actions/action_types';
import * as popup_types from '../actions/popup_types';
import { showPopup, selectUnit, showUnitMenu, showUnitTip, hideUnitTip, changeMapSetting, unitClicked, hideUnitMenu, deselectUnit, hideMapMenu  } from '../actions/actions';
import { mapUnitDrug, mapStateChanged, mapUnitPointMove, mapUnitPointInsert, mapUnitPointDelete } from '../actions/map_actions';

/**
 * Saga for connection between main application and map module. 
 * For details see readme.md
 */

const customChannel = channel();

var mapController = new MapController({
    unitLeftClicked: (unit) => {
        customChannel.put(unitClicked(unit));
    },
    unitRightClicked: (unit, vertex, path, mousePosition) => {
        customChannel.put(showUnitMenu(unit, vertex, path, mousePosition));
    },
    unitMouseOver: (unitId, mousePosition) => {
        customChannel.put(showUnitTip(unitId, mousePosition));
    },
    unitMouseOut: () => {
        customChannel.put(hideUnitTip());
    },
    mapStateChanged: (mapState) => {
        customChannel.put(mapStateChanged(mapState));
    },
    mapUnitDrug: (unitId, fieldId, point) => {
        customChannel.put(mapUnitDrug(unitId, fieldId, point));
    },
    mapUnitPointMove: (unitId, fieldId, path, vertex, point) => {
        customChannel.put(mapUnitPointMove(unitId, fieldId, path, vertex, point));
    },
    mapUnitPointInsert: (unitId, fieldId, path, vertex, point) => {
        customChannel.put(mapUnitPointInsert(unitId, fieldId, path, vertex, point));
    },
    mapUnitPointDelete: (unitId, fieldId, path, vertex) => {
        customChannel.put(mapUnitPointDelete(unitId, fieldId, path, vertex));
    },
    mapLeftClicked: () => {
        customChannel.put(hideUnitMenu());
        customChannel.put(hideMapMenu());
        customChannel.put(deselectUnit());
    },
});

function* initMap(dispatch) {
    const state = yield select();

    mapController.init(state.time.getTimeObjectById('MAIN'), state.mapState, state.selectedUnit, state.time.getCalendar());
    mapController.refresh(state, state.currentStep);

    while (true) {
        const action = yield take(customChannel);
        yield put(action);
    }
}

function* rewind(action) {
    const state = yield select();
    mapController.rewind(state, state.currentStep, state.oldStep);
}

function* rewindToEvent(action) {
    yield rewind(action);
    const state = yield select();
    mapController.processEventChange(action.event, state.editMode);
}

function* playToEventTick(action) {
    const state = yield select();
    mapController.rewindFraction(state, action.step, action.fraction);
}

function* redrawOverlay(action) {
    const state = yield select();
    mapController.redrawOverlay(state, action.unit);
    if(action.unit.getType() == 'event') {
        mapController.processEventChange(action.unit, state.editMode);
    }
}

function* redrawOverlayIfNeeded(action) {
    console.log(action);
    if(action.unit) {
         const state = yield select();
         mapController.redrawOverlay(state, action.unit);
         if(action.unit.getType() == 'event') {
            mapController.processEventChange(action.unit, state.editMode);
         }
    }
}

function* redrawOverlays(action) {
    const state = yield select();
    for(var i=0; i< action.units.length; i++) {
        mapController.redrawOverlay(state, action.units[i]);
    }
}

function* removeOverlay(action) {
    const state = yield select();
    mapController.removeOverlay(action.unit);
}

function* showSearchMarker(action) {
    mapController.showSearchMarker();
}

function* hideSearchMarker(action) {
    mapController.hideSearchMarker();
}

function* searchOnMap(action) {
    mapController.searchOnMap(action.searchString);
}

function* changeSetting(action) {
    const state = yield select();
    if(action.settingKey == 'labels' || action.settingKey == 'infoboxes'){
        mapController.setLabelsVisibility(action.settingKey, state.mapSettings[action.settingKey]);
    }
    else {
        mapController.refresh(state, state.currentStep);
    }
}

function* goToUnit(action) {
    const state = yield select();
    mapController.setMapPosition(state.mapState.mapCenter, state.mapState.mapZoom);
}

function* setMapZoom(action) {
    const state = yield select();
    mapController.setMapZoom(action.mapZoom);
}

function* deletePoint(action) {
    mapController.deletePoint(action.unit, action.vertex, action.path);
}

function* reinitArmy(action) {
    const state = yield select();
    var unit = state.time.getTimeObjectById(action.unitId);
    if(unit.getType() == 'army') {
        mapController.redrawOverlay(state, unit)
    }
 }

function* selectUnitOnMap(action) {
    const state = yield select();
    if(state.editMode) {
        mapController.selectOverlay(action.unit);
    }
}

function* deselectUnitOnMap(action) {
    const state = yield select();
    if(state.editMode) {
        mapController.deselectOverlay(state, action.unit);
    }
}

function* changedEditMode(action) {
    const state = yield select();
    mapController.refresh(state, state.currentStep);
}

function* changedMapType(action) {
    mapController.setMapType(action.mapTypeId);
}


function* mapSaga() {
    yield takeEvery(types.INIT_MAP_SUCCESS, initMap);
    yield takeEvery(types.REWIND, rewind);
    yield takeEvery(types.SAVE_MAP_INFO, rewind);
   
    yield takeEvery(types.PLAY_TO_EVENT_TICK, playToEventTick);
    
    yield takeEvery(types.SAVE_UNIT_SUCCESS, redrawOverlay);
    yield takeEvery(types.SAVE_DYNAMIC_STYLE, redrawOverlay);
    yield takeEvery(types.DELETE_DYNAMIC_STYLE, redrawOverlay);
    yield takeEvery(types.SAVE_UNIT_COORDINATES, redrawOverlay);
    yield takeEvery(types.COPY_UNIT, redrawOverlay);
    yield takeEvery(types.DELETE_UNIT, removeOverlay);
    yield takeEvery(types.SAVE_EVENT_SUCCESS, redrawOverlay);
    yield takeEvery(types.SET_EVENT_MARKER_ON_UNIT, redrawOverlay);
    
    
    
    yield takeEvery(types.MAP_UNIT_ADD_POLYGON, redrawOverlay);
    yield takeEvery(types.MAP_UNIT_REMOVE_POLYGON, redrawOverlay);
    yield takeEvery(types.MAP_UNIT_ADD_BRANCH, redrawOverlay);
    yield takeEvery(types.MAP_UNIT_REMOVE_BRANCH, redrawOverlay);
    yield takeEvery(types.SAVE_DYNAMIC_TERRITORY, redrawOverlay);
    yield takeEvery(types.DELETE_DYNAMIC_TERRITORY, redrawOverlay);
    yield takeEvery(types.IMPORT_UNITS_SUCCESS, redrawOverlays);
    
    yield takeEvery(types.MAP_UNIT_ARMY_WAY_CONNECT, redrawOverlay);
    yield takeEvery(types.MAP_UNIT_ARMY_WAY_DISCONNECT_DATE, redrawOverlay);
    yield takeEvery(types.MAP_UNIT_ARMY_WAY_DISCONNECT_DATE_TO, redrawOverlay);
    yield takeEvery(types.MAP_UNIT_ARMY_WAY_SET_INVISIBLE, redrawOverlay);
    yield takeEvery(types.SET_EVENT_SHOW_MARKER, redrawOverlay);

    yield takeEvery(types.SHOW_SEARCH_BLOCK, showSearchMarker);
    yield takeEvery(types.HIDE_SEARCH_BLOCK, hideSearchMarker);
    yield takeEvery(types.SEARCH_ON_MAP, searchOnMap);
    
    yield takeEvery(types.CHANGE_MAP_SETTING, changeSetting);
    yield takeEvery(types.SET_UNIT_SCREEN, goToUnit);
    yield takeEvery(types.SET_MAP_ZOOM, setMapZoom);
   
    yield takeEvery(types.MAP_UNIT_DELETE_POINT, deletePoint);
    
    yield takeEvery(types.MAP_UNIT_POINT_MOVE, reinitArmy);
    yield takeEvery(types.MAP_UNIT_POINT_INSERT, reinitArmy);
    yield takeEvery(types.MAP_UNIT_POINT_DELETE, reinitArmy);
 
    yield takeEvery(types.UNIT_SELECT, selectUnitOnMap);
    yield takeEvery(types.UNIT_DESELECT, deselectUnitOnMap);

    yield takeEvery(types.REWIND_TO_EVENT, rewindToEvent);
    yield takeEvery(types.PLAY_TO_EVENT_FINISHED, rewindToEvent);

    yield takeEvery(types.ENABLE_EDIT_MODE, changedEditMode);
    yield takeEvery(types.DISABLE_EDIT_MODE, changedEditMode);
    
    yield takeEvery(types.CHANGE_MAP_TYPE, changedMapType);
    yield takeEvery(types.MAP_UNIT_DRUG, redrawOverlayIfNeeded);
}

export default mapSaga;