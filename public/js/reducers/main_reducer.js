import * as types from '../actions/action_types';
import { getStateByUrl, getUrlByState } from './url_reducer';
import { initTime, addImportedObjects, saveTableTemplates } from './time_reducer';
import { saveUnit, saveUnitCoordinates, deleteUnit, copyUnit, 
    saveDynamicStyle, deleteDynamicStyle,
    saveDescription, deleteDescription,
    saveTable, deleteTable, getMapCenterOnUnit,
    saveDynamicTerritory, deleteDynamicTerritory } from './unit_reducer';
import { moveEventUp, moveEventDown, deleteEvent, saveEvent, setScreen, toggleShowMarker,
    setEventMarkerOnUnit  } from './event_reducer';
import { moveChainUp, moveChainDown, deleteChain, saveChain  } from './chain_reducer';
import { mapUnitDrug, mapUnitPointMove, mapUnitPointInsert, mapUnitPointDelete,
addPolygon, deletePolygon, addBranch, deleteBranch,
mapUnitArmyWayConnect ,mapUnitArmyWayDisconnectDate, mapUnitArmyWayDisconnectDateTo, mapUnitArmyWaySetInvisible
} from './map_reducer';
import { saveMapInfo } from './map_info_reducer';
import { Tracking } from '../server/tracking.js';


export const mainReducer = (state = {}, action) => {
    if(action.type != types.SHOW_UNIT_TIP && action.type != types.MAP_STATE_CHANGED && action.type != types.HIDE_UNIT_TIP) {
        console.log(state, action);
        var track = new Tracking;
        track.trackIfNeed(action, state);
    }
    switch (action.type) {
        case types.INIT_MAP_STARTED:
            return Object.assign({},
                state, {
                    mapId: action.mapId,
                    mapVersion: action.mapVersion,
                    mapLoaded: false,
            });
        case types.INIT_MAP_SUCCESS:
            var time = initTime(action.objects, state);
            var allState = Object.assign({},
                state,
                getStateByUrl(state.url, time, state.isXXage),
                {time:time,  mapLoaded: true},
                {baseUrl: action.baseUrl}
            );
            allState.url = getUrlByState(allState);
            allState.user = action.user;
            allState.mapRights = action.mapRights;
            allState.currentDate = allState.time.getCalendar().getDateByStep(allState.currentStep);

            var mapSettings = Object.assign({},state.mapSettings, {
                fog: time.getTimeObjectById('MAIN').getField('hasFog')
            });
            allState.mapSettings = mapSettings;
            allState.mapTypeId = time.getTimeObjectById('MAIN').getField('mapType');

            return allState;

        case types.REWIND:
            var oldStep = state.currentStep;

            var newState = Object.assign({},
                state, {
                    currentStep: action.step,
                    oldStep: oldStep,
                    currentEvent: null,
                    currentChain: null,
                    isMenuDisplayed: false,
                    listShowed: false,
                    currentDate: state.time.getCalendar().getDateByStep(action.step),
                }
            );
            newState.url = getUrlByState(newState);
            return newState;

        case types.REWIND_TO_EVENT:
            var oldStep = state.currentStep;
            var eventBeginStep = state.time.getCalendar().getStepByDate(action.event.getDateBegin());
            var chainId = action.chainId;
            if(state.indexMode == 'chains' && !chainId){
                chainId = state.time.getIndexStore().getFirstEventChain(action.event);
            }
            var newState = Object.assign({},
                state, {
                    currentStep: eventBeginStep,
                    currentDate: state.time.getCalendar().getDateByStep(eventBeginStep),
                    oldStep: oldStep,
                    currentEvent: action.event,
                    currentChain: chainId,
                    isMenuDisplayed: false,
                    listShowed: false,
                }
            );
          
            newState.url = getUrlByState(newState);
            return newState;
        case types.SHOW_LIST: 
            return Object.assign({}, state, {
               currentEvent: null,  listShowed: true, currentChain: null
            });    
         case types.SHOW_CHAIN: 
            return Object.assign({}, state, {
               currentEvent: null, listShowed: false, currentChain: action.chainId
            });    
        case types.PLAY_TO_EVENT_STARTED: 
            return Object.assign({}, state, {
               playToEventInProcess: true 
            });
         

        case types.PLAY_TO_EVENT_FINISHED:
            var oldStep = state.currentStep;
            var newState = Object.assign({},
                state, {
                    currentStep: action.step,
                    currentDate: state.time.getCalendar().getDateByStep(action.step),
                    oldStep: oldStep,
                    currentEvent: action.event,
                    currentChain: action.chainId,
                    listShowed: false,
                    url: getUrlByState(state),
                    isMenuDisplayed: false,
                    playToEventInProcess: false 
                }
            );
            newState.url = getUrlByState(newState);
            return newState;
        case types.SET_INDEX_MODE:
            if(action.indexMode == state.indexMode){
                return state;
            }
//            var newChainId;
//            if(action.indexMode == 'chains'){
//                var indexStore = state.time.getIndexStore();
//                if(state.currentEvent) {
//                    newChainId = indexStore.getFirstEventChain(state.currentEvent);
//                }
//                else {
//                    newChainId = indexStore.hasChainsMode() ? null : indexStore.NO_CHAIN;
//                }
//            }
//            if(action.indexMode == 'dates'){
//                newChainId = null;
//            }
            var indexStore = state.time.getIndexStore();
            var newState = Object.assign({},
                state,  {
                    indexMode: action.indexMode,
                    currentChain: action.indexMode == 'chains' && !indexStore.hasChainsMode() ? indexStore.NO_CHAIN : null,
                    currentEvent: null,
                    listShowed: action.indexMode == 'chains' && !indexStore.hasChainsMode() ? false : true,
                    url: getUrlByState(state),
                }
            );
            newState.url = getUrlByState(newState);
            return newState;

        

        case types.MOUSE_MOVE:
            return Object.assign({},
                state, { mousePosition: action.point}
            );

        case types.UNIT_SELECT:
            var allState = Object.assign({}, state, {
                selectedUnit: action.unit,
                currentPoint:  action.unit.getField('point') ?  action.unit.getField('point') : {},
            });
            allState.url = getUrlByState(allState);
            return allState;
        case types.UNIT_DESELECT:
            var allState = Object.assign({}, state, {
                selectedUnit: null,
                currentPoint: {},
                isMenuDisplayed: false
            });
            allState.url = getUrlByState(allState);
            return allState;

        case types.SHOW_POPUP:
            return Object.assign({}, state, {
                isPopupOpened: true,
                popupType: action.popupType,
                popupParams: action.popupParams,
                isMenuDisplayed: false,
            });
        case types.HIDE_POPUP:
            var newState = Object.assign({}, state, {
                isPopupOpened: false,
                selectedUnit: null
            });
            if(state.mapId) {
                newState.url = getUrlByState(newState);
            }
            return newState;
        case types.SHOW_UNIT_MENU:
            if(!state.editMode) {
                return state;
            }
            return Object.assign({}, state, {
                isMenuDisplayed: true,
                menuParams: {
                    unit: action.unit,
                    vertex: action.vertex,
                    path: action.path,
                    mousePosition: action.mousePosition,
                }
            });
        case types.HIDE_UNIT_MENU:
            return Object.assign({}, state, {
                isMenuDisplayed: false,
            });
        case types.TOGGLE_MAIN_MENU:
            return Object.assign({}, state, {
                isMainMenuDisplayed: !state.isMainMenuDisplayed,
            });
        case types.TOGGLE_MAP_MENU:
            return Object.assign({}, state, {
                isMapMenuDisplayed: !state.isMapMenuDisplayed,
            });
        case types.HIDE_MAP_MENU:
            return Object.assign({}, state, {
                isMapMenuDisplayed: false,
            });
        case types.MAP_STATE_CHANGED:
            var allState = Object.assign({}, state, { mapState: action.mapState});
            allState.url = getUrlByState(allState);
            return allState;
        case types.SAVE_UNIT_SUCCESS:
            var saveResult = saveUnit(action.unit, action.isNew, action.fields, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isPopupOpened: false,
            });
        case types.SAVE_DYNAMIC_STYLE:
            var saveResult = saveDynamicStyle(action.unit, action.isNew, action.dynamicStyle, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isPopupOpened: false,
            });
        case types.DELETE_DYNAMIC_STYLE:
            var saveResult = deleteDynamicStyle(action.unit, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isPopupOpened: false,
                isMenuDisplayed: false,
            });
        case types.SAVE_UNIT_COORDINATES:
            var saveResult = saveUnitCoordinates(action.unit, action.coordinates, action.segmentNumber, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isPopupOpened: false,
            });
        case types.DELETE_UNIT:
            var time = deleteUnit(action.unit, state);
            return Object.assign({}, state, {
                time: time,
                isPopupOpened: false,
                isMenuDisplayed: false,
            });
        case types.COPY_UNIT:
            var saveResult = copyUnit(action.unit, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isPopupOpened: false,
                isMenuDisplayed: false,
            });
        case types.MOVE_EVENT_UP:
            var time = moveEventUp(action.event, action.chainId, action.indexMode, state);
            return Object.assign({}, state, {
                time: time,
            });
        case types.MOVE_EVENT_DOWN:
            var time = moveEventDown(action.event, action.chainId, action.indexMode, state);
            return Object.assign({}, state, {
                time: time,
            });
        case types.DELETE_EVENT:
            var time = deleteEvent(action.event, state);
            return Object.assign({}, state, {
                time: time,
                currentEvent:null,
            });
        case types.SAVE_EVENT_SUCCESS:
            var saveResult = saveEvent(action.eventId, action.fields, action.isNew, state);
            action.unit = saveResult.event;
            return Object.assign({}, state, {
                time: saveResult.time,
                currentEvent: saveResult.event,
            });
        case types.MOVE_CHAIN_UP:
            var time = moveChainUp(action.chainId, state);
            return Object.assign({}, state, {
                time: time,
            });
        case types.MOVE_CHAIN_DOWN:
            var time = moveChainDown(action.chainId, state);
            return Object.assign({}, state, {
                time: time,
            });
        case types.DELETE_CHAIN:
            var time = deleteChain(action.chainId, state);
            return Object.assign({}, state, {
                time: time,
            });
        case types.SAVE_CHAIN:
            var time = saveChain(action.chainId, action.fields, action.isNew, state);
            return Object.assign({}, state, {
                time: time,
            });
        case types.SAVE_DESCRIPTION:
            var saveResult = saveDescription(
                action.unitId,
                action.isNew,
                action.isStatic,
                action.dynamicDescriptionId,
                action.fields,
                state
            );
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.DELETE_DESCRIPTION:
            var saveResult = deleteDescription(action.unitId, action.dynamicDescriptionId, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.SAVE_TABLE:
            var saveResult = saveTable(
                action.unitId,
                action.isNew,
                action.isStatic,
                action.dynamicTableId,
                action.fields,
                state
            );
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.DELETE_TABLE:
            var saveResult = deleteTable(action.unitId, action.dynamicTableId, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.IMPORT_UNITS_SUCCESS:
            var saveResult = addImportedObjects(action.objects, state);
            action.units = saveResult.units;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.SAVE_TABLE_TEMPLATES:
            var time = saveTableTemplates(action.templates, state);
            return Object.assign({}, state, {
                time: time,
            });
        case types.MAP_UNIT_DRUG:
            var saveResult = mapUnitDrug(action.unitId, action.fieldId, action.point, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {time: saveResult.time, currentPoint:  action.point});
        case types.MAP_UNIT_POINT_MOVE:
            var time = mapUnitPointMove(action.unitId, action.fieldId, action.path, action.vertex, action.point, state);
            return Object.assign({}, state, {time: time, currentPoint:  action.point});
        case types.MAP_UNIT_POINT_INSERT:
            var time = mapUnitPointInsert(action.unitId, action.fieldId, action.path, action.vertex, action.point, state);
            return Object.assign({}, state, {time: time, currentPoint:  action.point});
        case types.MAP_UNIT_POINT_DELETE:
            var time = mapUnitPointDelete(action.unitId, action.fieldId, action.path, action.vertex, state);
            return Object.assign({}, state, {time: time});
        case types.SHOW_SEARCH_BLOCK: return Object.assign({}, state, {isSearchBlockDisplayed: true});
        case types.HIDE_SEARCH_BLOCK: return Object.assign({}, state, {isSearchBlockDisplayed: false});
        case types.CHANGE_MAP_SETTING:
            var mapSettings = Object.assign({}, state.mapSettings);
            mapSettings[action.settingKey] = !mapSettings[action.settingKey];
            return Object.assign({}, state, { mapSettings: mapSettings});
        case types.SET_UNIT_SCREEN:
            var mapCenter = getMapCenterOnUnit(action.unit, action.unit.getDateBegin());
            var mapZoom = 2+parseInt(action.unit.getField('size')) < parseInt(action.unit.getField('sizeMax')) ?
                            2+parseInt(action.unit.getField('size')) : parseInt(action.unit.getField('size'));
                    
            return Object.assign({}, state, {
                mapState: {mapCenter: mapCenter, mapZoom: mapZoom},
                isPopupOpened: false
            });
        case types.SET_MAP_ZOOM:
             return Object.assign({}, state, {
                mapState: {mapCenter:state.mapCenter , mapZoom: action.mapZoom}
            });
        case types.SAVE_MAP_INFO:
            var time = saveMapInfo(action.fields, state);

            var mapSettings = Object.assign({},state.mapSettings, {
                fog: time.getTimeObjectById('MAIN').getField('hasFog'),
                selectedUnit:null
            });

            return Object.assign({}, state, {
                time: time,
                isPopupOpened: false,
                mapSettings: mapSettings,
            });

        case types.MAP_UNIT_ADD_POLYGON:
            var saveResult = addPolygon(action.unitId, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.MAP_UNIT_REMOVE_POLYGON:
            var saveResult = deletePolygon(action.unitId, action.path, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.MAP_UNIT_ADD_BRANCH:
            var saveResult = addBranch(action.unitId, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.MAP_UNIT_REMOVE_BRANCH:
            var saveResult = deleteBranch(action.unitId, action.path, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.MAP_UNIT_DELETE_POINT:
            return Object.assign({}, state, {
                isMenuDisplayed: false,
            });
        case types.SIGNIN_SUCCESS:
            return Object.assign({}, state, {
                isPopupOpened: false,
                user: action.user ? action.user : null,
                mapRights:action.user ? action.mapRights : null
            });
        case types.REGISTER_SUCCESS:
            return Object.assign({}, state, {
                isPopupOpened: false,
                user: action.user ? action.user : null,
                mapRights:action.user ? action.mapRights : null
            });
        case types.SAVE_MY_DATA_SUCCESS:
            return Object.assign({}, state, {
                isPopupOpened: false,
                user: action.user ? action.user : null
            });
        case types.INIT_USER_SUCCESS:
            return Object.assign({}, state, {
                user: action.user.email ? action.user : null
            });
        case types.SIGNOUT_SUCCESS:
            return Object.assign({}, state, {
                user: null,
                isPopupOpened: false,
            });
        case types.DELETE_MAP_SUCCESS:
            return Object.assign({}, state, {
                user: state.user,
                isPopupOpened: true,
            });
        case types.SHOW_UNIT_TIP:
            var newUnit = state.time.getTimeObjectById(action.unitId);
            if(!newUnit){
                return Object.assign({}, state, { isTipDisplayed: false,});
            }
            var oldUnit = state.tipParams.unitId ? state.time.getTimeObjectById(state.tipParams.unitId) : null;
            var noNeedShowNewTip = (newUnit.getType() == 'region' || newUnit.getType() == 'line')
                && oldUnit && (oldUnit.getType() == 'city' || oldUnit.getType() == 'army' || oldUnit.getType() == 'event');
            return Object.assign({}, state, {
                isTipDisplayed: true,
                tipParams: {
                    unitId: noNeedShowNewTip ? state.tipParams.unitId : action.unitId,
                    mousePosition: action.mousePosition,
                }
            });
        case types.HIDE_UNIT_TIP:
            return Object.assign({}, state, {
                isTipDisplayed: false,
                tipParams: {
                    unitId: null,
                }
            });
        case types.SAVE_DYNAMIC_TERRITORY:
            var saveResult = saveDynamicTerritory(action.unitId, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isMenuDisplayed: false,
            });
        case types.DELETE_DYNAMIC_TERRITORY:
            var saveResult = deleteDynamicTerritory(action.unitId, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isMenuDisplayed: false,
            });

        case types.MAP_UNIT_ARMY_WAY_CONNECT:
            var saveResult = mapUnitArmyWayConnect(action.unitId, action.vertex, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isMenuDisplayed: false,
            });
        case types.MAP_UNIT_ARMY_WAY_DISCONNECT_DATE:
            var saveResult = mapUnitArmyWayDisconnectDate(action.unitId, action.vertex, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isMenuDisplayed: false,
            });
        case types.MAP_UNIT_ARMY_WAY_DISCONNECT_DATE_TO:
            var saveResult = mapUnitArmyWayDisconnectDateTo(action.unitId, action.vertex, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isMenuDisplayed: false,
            });
        case types.MAP_UNIT_ARMY_WAY_SET_INVISIBLE:
            var saveResult = mapUnitArmyWaySetInvisible(action.unitId, action.vertex, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
                isMenuDisplayed: false,
            });
        case types.SET_EVENT_SCREEN:
            var saveResult = setScreen(action.eventId, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.SET_EVENT_SHOW_MARKER:
            var saveResult = toggleShowMarker(action.unit, state);
            action.unit = saveResult.unit;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
          case types.SET_EVENT_MARKER_ON_UNIT:
            var saveResult = setEventMarkerOnUnit(action.unitId, action.eventId, state);
            console.log(saveResult);
            action.unit = saveResult.event;
            return Object.assign({}, state, {
                time: saveResult.time,
            });
        case types.ZOOM_PLUS:
            return Object.assign({}, state, {
                screenZoom:state.screenZoom+(action.step ? action.step : 0.1),
            });
            
        case types.ZOOM_MINUS:
            return Object.assign({}, state, {
                screenZoom: state.screenZoom-(action.step ? action.step : 0.1),
            });
        case types.ENABLE_EDIT_MODE:
            return Object.assign({}, state, {editMode: true,});
        case types.DISABLE_EDIT_MODE:
            return Object.assign({}, state, {editMode: false,});
        case types.DISPLAY_MESSAGE:
            return Object.assign({}, state, {message: action.message, isLoading: action.isLoading});
        case types.HIDE_MESSAGE:
            return Object.assign({}, state, {message: '', isLoading: false});
        case types.OPEN_BIG_IMAGE:
            return Object.assign({}, state, {bigImageOpened: action.bigImage});
        case types.HIDE_BIG_IMAGE:
            return Object.assign({}, state, {bigImageOpened: null});
        case types.CHANGE_MAP_TYPE:
            return Object.assign({}, state, {
                mapTypeId: action.mapTypeId,
            });
        default:
            return state
    }


}

