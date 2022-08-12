import { changeArmyWayBeginAndEnd } from './unit_reducer';

/**
 * Function for changing map properties
 */


export const saveMapInfo = (newFields, state) => {
    var time = state.time.getCopy();

    var mainObject = time.getTimeObjectById('MAIN');
    var datesChanges = time.getCalendar().nE(newFields.dateBegin,mainObject.getDateBegin()) ||
        state.time.getCalendar().nE(newFields.dateEnd,mainObject.getDateEnd());

    time.getCalendar().setDateBegin(newFields.dateBegin);
    time.move(newFields.dateBegin,newFields.dateEnd);
    mainObject.move(newFields.dateBegin,newFields.dateEnd);
    mainObject.setFields(newFields);

    if(datesChanges) {
        var armys = time.getObjectsOfType('army');
        for (var i = 0; i < armys.length; i++) {
            changeArmyWayBeginAndEnd(armys[i], time, state.mapState.mapFrame);
        }
        var events = time.getObjectsOfType('event');
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            event.move(event.getDateBegin(), event.getDateBegin());
        }
    }

    return time;
}
