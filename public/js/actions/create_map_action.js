import Server from '../server/server.js';
import { showPopup } from '../actions/actions'
import Time from '../libs/time/time'
import { DateFormatter } from '../libs/date_formatter';
import * as popup_types from './popup_types';

/**
 * Action for new map creation
 */
export const createChronomap = (fields) => {
    return (dispatch, getState) => {
        var that = this;
        var state = getState();
        var sendFields = function(){
            var server = new Server;
            server.tracking("create map: "+fields.name);
            server.saveArticle(fields['article'], function(response) {
                fields['article'] = response.articleId;
                fields = prepareFields(fields, getState().user);
                var time = createTime(fields, state);
                time = createFog(time, state.labels);
                var saveFields = getSaveFields(time, fields,  state.labels);

                server.createChronomap(saveFields, function (response) {
                    location.href = "/" + fields['lang'] + "/map/id/" + response.mapId;
                });
            });
        }

        if(!getState().user){
            dispatch(showPopup(popup_types.SIGNIN_OR_REGISTER, {callback: ()=>{sendFields(fields);console.log('2222');}}));
        }
        else{
            sendFields(fields);
        }
    };
}

        
const prepareFields = (newFields, user) => {
    newFields['editors'] = newFields['editors'] !== '' ? newFields['editors'] : user.login;
    newFields['initialZoom'] = 3;
    var maxScaleTitleCount = Math.pow(2, newFields['maxScale'] - 1);
    if(newFields['mapType'] === 'FILE'){
        newFields['mapTypeOptions'] = {
            'file': newFields['file'], 
            'maxScale': newFields['maxScale'],
            'width' :  Math.floor(newFields['mapItemWidth']/maxScaleTitleCount),
            'height':  Math.floor(newFields['mapItemHeight']/maxScaleTitleCount)
        };
    }
    console.log(newFields, maxScaleTitleCount);
    delete newFields['file'];
    delete newFields['maxScale'];
    delete newFields['mapItemWidth'];
    delete newFields['mapItemHeight'];
    return newFields;
}

const createTime = (newFields, state) => {
    var time = new Time();
    var formatter = new DateFormatter(state.labels, state.lang, newFields['dateMode']);
    time.init(newFields['dateMode'],newFields['dateBegin'],newFields['dateEnd'], state.labels, formatter);
    var mainObject = time.addTimeObject('MAIN',newFields['dateBegin'],newFields['dateEnd']);
    mainObject.setFields(newFields);

    if(newFields['mapType'] === 'FILE'){
        mainObject.setField('mapTypeOptions',newFields['mapTypeOptions']);
    }

    return time;
}


const getSaveFields = (time, newFields, labels) => {
    var saveData = {
        objects:time.getSerializeData(),
        commitMessage:  labels['Creating map'], userCommitMessage:  "",
        name:  newFields['name'], lang: newFields['lang'], image: newFields['image'], description:  newFields['description'],
        openEditing: newFields['openEditing'], published: newFields['punlished'], editors: newFields['editors'],
        discussHref: newFields['discussHref'],article: newFields['article']
    };
    if(newFields['mapTypeOptions']){
        saveData.mapTypeOptions = newFields['mapTypeOptions'];
    }
    return saveData;
}

const createFog = (time, labels) => {
    var fogObject = time.addTimeObject('fog',time.getDateBegin(),time.getDateEnd());
    var rightPart = [{lat:85,lng:0},{lat:-85,lng:0},{lat:-85,lng:180},{lat:85,lng:180}];
    var leftPart = [{lat:85,lng:0},{lat:85,lng:-180},{lat:-85,lng:-180},{lat:-85,lng:0}];
    var window = [{lat:50,lng:-10},{lat:50,lng:54},{lat:25,lng:54},{lat:25,lng:-10}];
    fogObject.addTimeObjectField('dynamicTerritory',time.getDateBegin(),{"polygons":[rightPart,leftPart,window]});
    fogObject.setField('name', labels['Unknown area']);
    return time;
}
