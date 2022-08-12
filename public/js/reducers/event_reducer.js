/**
 * Set of functions for event actions 
 */

export const moveEventUp = (oldEvent, chainId, indexMode, state) => {
    var time = state.time.getCopy();
    var event = time.getTimeObjectById(oldEvent.getId());

    time.getIndexStore().moveEventUp(event, chainId, indexMode);
    return time;
}

export const moveEventDown = (oldEvent, chainId, indexMode, state) => {
    var time = state.time.getCopy();
    var event = time.getTimeObjectById(oldEvent.getId());

    time.getIndexStore().moveEventDown(event, chainId, indexMode);
    return time;
}

export const deleteEvent = (oldEvent, state) => {
    var time = state.time.getCopy();
    var event = time.getTimeObjectById(oldEvent.getId());

    event.deleteObject();
    var relatedObjects = getObjectsRelatedToEvent(event, time);
    for(var i=0; i < relatedObjects.length; i++){
        relatedObjects[i].setField('eventId', null);
    }
    time.getIndexStore().reinit();

    return time;
}

const getObjectsRelatedToEvent = (event, time) => {
    var objectTypes = {'city':1,'army':1,'region':1,'line':1};

    var objectsByEvent = [];
    for(var type in objectTypes){
        var objects = time.getObjectsOfType(type);
        for(var i=0; i < objects.length; i++){
            if(objects[i].getField('eventId') == event.getId()){
                objectsByEvent.push(objects[i]);
            }
        }
    }
    return objectsByEvent;
};


export const saveEvent = (eventId, fields, isNew, state) => {
    var time = state.time.getCopy();
    var event = time.getTimeObjectById(eventId);

    if(isNew){
        event = time.addTimeObject('event', fields['dateBegin'], fields['dateBegin']);
        event.setField('mapZoom', state.mapState.mapZoom);
        event.setField('arrowPoint',state.mapState.mapCenter);
        time.getIndexStore().updateEventOrder(event, time);
    }
    else{
        if(time.getCalendar().nE(event.getDateBegin(),fields['dateBegin'])){
            event.move(fields['dateBegin'],fields['dateBegin']);
            moveRelatedObjects(event, fields['dateBegin'], time);
            time.getIndexStore().updateEventOrder(event, time);
        }
    }

    time.getIndexStore().updateEventChains(event, fields['eventChains'])
    time.getIndexStore().reinit();

    var oldHasMarker = event.getField('showMarker') !== undefined;
    if(!oldHasMarker && fields['showMarker'] && !isNew){
        event.setField('arrowPoint',state.mapState.mapCenter);
    }

    event.setField('name',fields['name']);
    event.setField('description',fields['description']);
    event.setField('image',fields['image']);
    event.setField('showMarker',fields['showMarker']);
    event.setField('disableAnimation',fields['disableAnimation']);

    event.setField('comments',fields['comments']);
    event.setField('sources',fields['sources']);
    event.setField('progress',fields['progress']);
    event.setField('needHelp',fields['needHelp']);

    event.setField('article',fields['article']);

    return {
        event: event,
        time: time
    };
};

const moveRelatedObjects = (event, newDate, time) => {
    var relatedObjects = getObjectsRelatedToEvent(event, time);
    for(var i=0; i < relatedObjects.length; i++){
        relatedObjects[i].move(newDate, newDate);
    }
}

export const setScreen = (eventId, state) => {
    var time = state.time.getCopy();
    var event = time.getTimeObjectById(eventId);

    event.setField('mapZoom', state.mapState.mapZoom);
    return {
        unit: event,
        time: time
    };
}

export const toggleShowMarker = (event, state) => {
    var time = state.time.getCopy();
    var event = time.getTimeObjectById(event.getId());

    event.setField('showMarker', !event.getField('showMarker'));
    return {
        unit: event,
        time: time
    };
}


export const setEventMarkerOnUnit = (unitId, eventId, state) => {
    var time = state.time.getCopy();
    var unit = time.getTimeObjectById(unitId);
    var event = time.getTimeObjectById(eventId);
    console.log(unit,event);
    event.setField('arrowPoint',unit.getField('point'));
    event.setField('icon','/img/new/arrow_icon2.gif');
    event.setField('showMarker', true);
    return {
        event: event,
        time: time
    };
};