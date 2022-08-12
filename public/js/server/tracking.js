var $ = require("jquery");
import Server from './server.js';
import * as types from '../actions/action_types';
import * as popup_types from '../actions/popup_types';

import { DateFormatter } from '../libs/date_formatter';


export class Tracking {
    trackIfNeed(action, state){
        var server = new Server;
    
        switch (action.type) {
            case types.REWIND_TO_EVENT:
                server.tracking("rewind to event: "+ action.event.getField('name'));
                break;
            case types.PLAY_TO_EVENT:
                server.tracking("play to event: "+ action.event.getField('name'));
                break;
            case types.REWIND:
                if(action.source != 'tick'){
                    var formatter = new DateFormatter(state.labels, state.lang, state.time.getCalendar().getMode())
                    server.tracking("rewind: "+ formatter.getDateLabel(state.time.getCalendar().getDateByStep(action.step))+", source:"+action.source);
                }
                break;
            case types.SET_INDEX_MODE:
                server.tracking("set index mode: "+ action.indexMode);
                break;
            case types.SHOW_CHAIN:
                var allChains = state.time.getIndexStore().getAllChains();
                server.tracking("select chain: "+ allChains[action.chainId].name);
                break;
            case types.SHOW_LIST:
                server.tracking("show list, index_mode: "+ state.indexMode);
                break;
            case types.ENABLE_EDIT_MODE:
                server.tracking("enable edit mode");
                break;
            case types.DISABLE_EDIT_MODE:
                server.tracking("disable edit mode");
                break;
            case types.CHANGE_MAP_TYPE:
                server.tracking("change map type: "+action.mapTypeId);
                break;
            case types.SET_MAP_ZOOM:
                server.tracking("set map zoom: "+action.mapZoom);
                break;
            case types.CHANGE_MAP_TYPE:
                server.tracking("change map type: "+action.mapTypeId);
                break;
            case types.SHOW_POPUP:
                var additional = '';
                if(action.popupType == popup_types.UNIT_INFO) {
                    additional = ", unit="+action.popupParams.unit.getField('name');
                }
                server.tracking("show popup: "+action.popupType+additional);
                break;
            case types.HIDE_POPUP:
                server.tracking("hide popup");
                break;

        }
    }
}
