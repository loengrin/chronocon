import * as types from './action_types';

/**
 * Actions map events
 */

export const mapLeftClick = (unit) => {
    return {
        type: types.MAP_LEFT_CLICK,
    }
}

export const mapStateChanged = (mapState) => {
    return {
        type: types.MAP_STATE_CHANGED,
        mapState: mapState,
    }
}

export const mapUnitLeftClick = (unitId) => {
    return {
        type: types.MAP_UNIT_LEFT_CLICK,
        unitId: unitId,
    }
}

export const mapUnitRightClick = (unitId, path, vertex) => {
    return {
        type: types.MAP_UNIT_RIGHT_CLICK,
        unitId: unitId,
        path: path,
        vertex: vertex,
    }
}

export const mapUnitDrug = (unitId, fieldId, point) => {
    return {
        type: types.MAP_UNIT_DRUG,
        unitId: unitId,
        fieldId: fieldId,
        point: point
    }
}

export const mapUnitPointMove = (unitId, fieldId, path, vertex, point) => {
    return {
        type: types.MAP_UNIT_POINT_MOVE,
        unitId: unitId,
        fieldId: fieldId,
        path: path,
        vertex: vertex,
        point: point

    }
}

export const mapUnitPointInsert = (unitId, fieldId, path, vertex, point) => {
    return {
        type: types.MAP_UNIT_POINT_INSERT,
        unitId: unitId,
        fieldId: fieldId,
        path: path,
        vertex: vertex,
        point: point
    }
}

export const mapUnitPointDelete = (unitId, fieldId, path, vertex) => {
    return {
        type: types.MAP_UNIT_POINT_DELETE,
        unitId: unitId,
        fieldId: fieldId,
        path: path,
        vertex: vertex,
    }
}

export const mapUnitAddPolygon = (unitId) => {
    return {
        type: types.MAP_UNIT_ADD_POLYGON,
        unitId: unitId,
      }
}

export const mapUnitRemovePolygon = (unitId, path) => {
    return {
        type: types.MAP_UNIT_REMOVE_POLYGON,
        unitId: unitId,
        path: path,
    }
}

export const mapUnitAddBranch = (unitId) => {
    return {
        type: types.MAP_UNIT_ADD_BRANCH,
        unitId: unitId,
    }
}

export const mapUnitRemoveBranch = (unitId, path) => {
    return {
        type: types.MAP_UNIT_REMOVE_BRANCH,
        unitId: unitId,
        path: path,
    }
}

export const mapUnitRemovePoint = (unit, vertex, path) => {
    return {
        type: types.MAP_UNIT_DELETE_POINT,
        unit: unit,
        vertex: vertex,
        path: path,
    }
}

export const mapUnitArmyWayConnect = (unitId, vertex) => {
    return {
        type: types.MAP_UNIT_ARMY_WAY_CONNECT,
        unitId: unitId,
        vertex: vertex,
    }
}

export const mapUnitArmyWayDisconnectDate = (unitId, vertex) => {
    return {
        type: types.MAP_UNIT_ARMY_WAY_DISCONNECT_DATE,
        unitId: unitId,
        vertex: vertex,
    }
}

export const mapUnitArmyWayDisconnectDateTo = (unitId, vertex) => {
    return {
        type: types.MAP_UNIT_ARMY_WAY_DISCONNECT_DATE_TO,
        unitId: unitId,
        vertex: vertex,
    }
}

export const mapUnitArmyWaySetInvisible = (unitId, vertex) => {
    return {
        type: types.MAP_UNIT_ARMY_WAY_SET_INVISIBLE,
        unitId: unitId,
        vertex: vertex,
    }
}

export const setEventMarkerOnUnit = (eventId, unitId) => {
    return {
        type: types.SET_EVENT_MARKER_ON_UNIT,
        unitId: unitId,
        eventId: eventId,
    }
}

