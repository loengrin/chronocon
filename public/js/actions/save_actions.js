import Server from '../server/server.js';
import { signout, showMapSavePopup, initMap, hidePopup, showMessage} from '../actions/actions'

/**
 * Actions for saving map
 */

export const saveMap = (commitMessage, userCommitMessage) => {
    return (dispatch, getState) => {
        var state = getState();

        var saveData = getSaveFields(state.time, commitMessage, userCommitMessage);
        var server = new Server;
        dispatch(hidePopup());
        dispatch(showMessage(getState().labels['Saving...'], true));        
        server.saveChronomapVersion(state.mapId, state.mapVersion, saveData, function(response){
            if(response.result === 'NO RIGHTS'){
                dispatch(signout());
                dispatch(showMapSavePopup(false));
            }
            else {
                dispatch(initMap(state.mapId, response.version));
            }
        });

    };
}

export const createCopy = (commitMessage, userCommitMessage, newMapName) => {
    return (dispatch, getState) => {
        var state = getState();

        var saveData = getSaveFields(state.time, commitMessage, userCommitMessage);
        saveData.copyOfMapId = state.mapId;
        saveData.name = newMapName;
        saveData.published = false;
        saveData.openEditing = false;
        saveData.editors = state.user.login;
        dispatch(hidePopup());
        dispatch(showMessage(getState().labels['Saving...'], true));        
        var server = new Server;
        server.createChronomap(saveData, function(response){
            if(response.result === 'NO RIGHTS'){
                dispatch(signout());
                dispatch(showMapSavePopup(true));
            }
            else {
                dispatch(initMap(response.mapId,1));
            }
        });

    };
}

const getSaveFields = (time, commitMessage, userCommitMessage) => {
    var mapInfo = time.getTimeObjectById('MAIN');
    var saveData = {
        objects: time.getSerializeData(),
        commitMessage:  commitMessage, userCommitMessage:  userCommitMessage, name:  mapInfo.getField('name'),
        lang: mapInfo.getField('lang'),  image: mapInfo.getField('image'),   description:  mapInfo.getField('description'),
        openEditing:  mapInfo.getField('openEditing'),  published:   mapInfo.getField('published'),  editors: mapInfo.getField('editors'),
        discussHref:  mapInfo.getField('discussHref'),article:  mapInfo.getField('article'),
    };
    return saveData;
}

