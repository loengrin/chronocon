var React = require('react');
import { connect } from 'react-redux'
import {showPopup, selectUnit, deselectUnit, deleteUnit, copyUnit, deleteDynamicStyle,
    saveDynamicTerritory, deleteDynamicTerritory, showMessage, rewindToEvent, setEventScreen, toggleEventShowMarker} from '../../actions/actions';
import {mapUnitAddBranch, mapUnitRemoveBranch, mapUnitAddPolygon, mapUnitRemovePolygon, mapUnitRemovePoint,
    mapUnitArmyWayConnect, mapUnitArmyWayDisconnectDate, mapUnitArmyWayDisconnectDateTo, mapUnitArmyWaySetInvisible, setEventMarkerOnUnit} from '../../actions/map_actions';

import * as popup_types from '../../actions/popup_types';
import { ArmyWayService } from '../../libs/army_way_service'
import { DateFormatter } from '../../libs/date_formatter';


/**
Component for unit menu. It bacame visible when user clicks right mouse button on unit in edit mode.
*/
class UnitMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }
    
    setStateByProps(props){
          this.setState({
            formatter: new DateFormatter(props.labels, props.lang, props.time.getCalendar().getMode())
        });
    }

    render(){
        
    console.log(this.props);
        if(!this.props.isMenuDisplayed || !this.props.unit){
          return false;
        }

        var items = this.getMenuItems();
        var position = this.props.mousePosition;
        return <div className="b-unit-menu-wrapper" style={{left:position.x,top:position.y}}>
            <div className="b-unit-menu">
                {items}
            </div>
        </div>
    }

    getMenuItems() {
        var items;
        if(this.props.unit.getType() === 'army' && this.props.vertex !== undefined){
            items = this.getArmyWayMenuItems(this.props.unit, this.props.vertex);
        }
        else if((this.props.unit.getType() === 'region' || this.props.unit.getType() === 'fog') && this.props.path !== undefined){
            items = this.getRegionMenuItems(this.props.unit, this.props.path,  this.props.vertex);
        }
        else if(this.props.unit.getType() === 'line' && this.props.vertex !== undefined){
            items = this.getLineMenuItems(this.props.unit, this.props.path, this.props.vertex);
        }
        else if(this.props.unit.getType() === 'event'){
            items = this.getEventMenuItems(this.props.unit);
        }
        else{
            items = this.getUnitMenuItems(this.props.unit);
        }
        return items;
    }

    _objectIsUnit(unit) {
        return ['city','army','region','line'].indexOf(unit.getType()) !== -1;
    }

    _objectHasIcon(unit) {
        return ['city','army'].indexOf(unit.getType()) !== -1;
    }

    _objectHasTerritory(unit) {
        return ['region','line','fog'].indexOf(unit.getType()) !== -1;
    }

    getUnitMenuItems(unit) {
        var items = [];
        if(this._objectIsUnit(unit)){
            items.push(<a key='dw' onClick={()=>{this.showPopup(popup_types.UNIT_INFO)}} href="#">
                {this.props.labels['Description window']}
                </a>);
        }

        if(this._objectIsUnit(unit)){
            items.push(<a key='ms' onClick={()=>{this.showPopup(popup_types.UNIT_MAIN_SETTINGS)}} href="#">
                {this.props.labels['Main settings']}
            </a>);
        }

        if(this._objectIsUnit(unit)){
            items.push(<span key='delim1'/>);
            var popupType = this._objectHasIcon(unit) ? popup_types.UNIT_DYNAMIC_ICON : popup_types.UNIT_DYNAMIC_COLOR;

            var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicStyle',this.props.currentDate);
            var datesLabel = this.state.formatter.getDateLabel(timeObjectField.getDateBegin())+"-"+this.state.formatter.getDateLabel(timeObjectField.getDateEnd());
            var label = this._objectHasIcon(unit) ? this.props.labels['Current icon'] : this.props.labels['Current color'];
            items.push(<a key='dse' onClick={()=>{this.showPopup(popupType, {isNew: false})}} href="#">
                {label+' ('+datesLabel+")"}
            </a>);

            if(this.props.time.getCalendar().nE(this.props.currentDate,timeObjectField.getDateBegin())){
                var datesLabel = this.state.formatter.getDateLabel(this.props.currentDate)+"-"+this.state.formatter.getDateLabel(timeObjectField.getDateEnd());
                label = this._objectHasIcon(unit) ? this.props.labels['New icon'] : this.props.labels['New color'];
                items.push(<a key='dsn' onClick={()=>{this.showPopup(popupType, {isNew: true})}} href="#">
                    {label+' ('+datesLabel+")"}
                </a>);

            }
            if(this.props.time.getCalendar().nE(unit.getDateBegin(),timeObjectField.getDateBegin())){
                label = this._objectHasIcon(unit) ? this.props.labels['Remove current icon'] : this.props.labels['Remove current color'];
                items.push(<a key='dsd' onClick={()=>{this.deleteDynamicStyle(this.props.unit)}} href="#">
                    {label}
                </a>);

            }
        }

        if(this._objectHasTerritory(unit)){
            var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicTerritory',this.props.currentDate);
            if(this.props.time.getCalendar().nE(this.props.currentDate,timeObjectField.getDateBegin())){
                items.push(<span key='delim2'/>);

                var datesLabel = this.state.formatter.getDateLabel(this.props.currentDate)+"-"+this.state.formatter.getDateLabel(timeObjectField.getDateEnd());
                items.push(<a key='dtn' onClick={()=>{this.props.newDynamicTerritory(this.props.unit)}} href="#">
                    {this.props.labels['New territory']+'('+datesLabel+")"}
                </a>);
            };
            if(this.props.time.getCalendar().nE(unit.getDateBegin(),timeObjectField.getDateBegin())){
                items.push(<span key='delim3'/>);

                items.push(<a key='dtd' onClick={()=>{this.props.deleteDynamicTerritory(this.props.unit)}} href="#">
                    {this.props.labels['Remove current territory']}
                </a>);
            }
            items.push(<a key='uc' onClick={()=>{this.showPopup(popup_types.UNIT_COORDINATES)}} href="#">
                {this.props.labels['Coordinates']}
            </a>);
        };

        items.push(<span key='delim4'/>);
        if(unit.getType() !== 'fog'){
            items.push(<a key='co' onClick={()=>{this.props.copyUnit(this.props.unit)}} href="#">
                {this.props.labels['Copy object']}
            </a>);
            items.push(<a key='ro' onClick={()=>{this.deleteUnit(this.props.unit)}} href="#">
                {this.props.labels['Remove object']}
            </a>);
        };
        
         if(this.props.currentEvent && this.props.unit.getType() == 'city'){
            items.push(<a key='semou' onClick={()=>{this.props.setEventMarkerOnUnit(this.props.unit, this.props.currentEvent)}} href="#">
                {this.props.labels['Set current event marker']}
            </a>);

        };

        items.push(<a key='ds' onClick={()=>{this.props.deselectUnit()}} href="#">
            {this.props.labels['Deselect']}
        </a>);
        return items;
    };
  
    getEventMenuItems(unit) {
        var items = [];
        items.push(<a key='gte' onClick={()=>{this.props.rewindToEvent(unit)}} href="#">
            {this.props.labels['Move to event']}
            </a>);
    /*
        items.push(<a key='sec' onClick={()=>{this.props.eventSetScreen(unit, this.props.labels['Map zoom saved for event'])}} href="#">
            {this.props.labels['Set map zoom']}
            </a>);
            */
        items.push(<a key='tesm' onClick={()=>{this.props.toggleEventShowMarker(unit)}} href="#">
            {unit.getField('showMarker') ? this.props.labels['Hide event marker'] : this.props.labels['Show event marker']}
            </a>);
        return items;
    }


  getRegionMenuItems(unit, pathNumber, vertexNumber){
      var items = [];
      var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicTerritory',this.props.currentDate);

      items.push(<a key='ap' onClick={()=>{this.props.addPolygon(this.props.unit)}} href="#">
          {this.props.labels['Add polygon']}
      </a>);

      if(timeObjectField.getValue().polygons.length > 1){
          items.push(<a key='rp' onClick={()=>{this.props.removePolygon(this.props.unit, this.props.path)}} href="#">
              {this.props.labels['Remove polygon']}
          </a>);
      }
      if(vertexNumber !== undefined){
          items.push(<a key='rpo' href="#"
                        onClick={()=>{this.props.removePoint(this.props.unit, this.props.vertex, this.props.path)}}>
              {this.props.labels['Remove point']}
          </a>);
      }
      items.push(<a key='ucr' href="#"
                    onClick={()=>{this.showPopup(popup_types.UNIT_COORDINATES, {'path':this.props.path})}}>
          {this.props.labels['Coordinates']}
      </a>);
      return items;
  };

  getLineMenuItems(unit, lineNumber, vertexNumber){
      var items = [];
      var timeObjectField = unit.getTimeObjectFieldContainsDate('dynamicTerritory',this.props.currentDate);

      items.push(<a key='al' onClick={()=>{this.props.addBranch(this.props.unit)}} href="#">
          {this.props.labels['Add line']}
      </a>);

      if(timeObjectField.getValue().branchs && timeObjectField.getValue().branchs.length > 1){
          items.push(<a key='rl' onClick={()=>{this.props.removeBranch(this.props.unit, this.props.path)}} href="#">
              {this.props.labels['Remove line']}
          </a>);
      }
      if(vertexNumber !== undefined){
          items.push(<a key='rpol' href="#"
                        onClick={()=>{this.props.removePoint(this.props.unit, this.props.vertex, this.props.path)}}>
              {this.props.labels['Remove point']}
          </a>);
      }
      items.push(<a key='ucl' href="#"
                    onClick={()=>{this.showPopup(popup_types.UNIT_COORDINATES, {'path':this.props.path})}}>
          {this.props.labels['Coordinates']}
      </a>);
      return items;
  };

  getArmyWayMenuItems(unit, vertex){
      var items = [];
      var armyWay = unit.getField('pointsWithDates');
      var armyWayService = new ArmyWayService(this.props.time.getCalendar())
      if(vertex != 0 && vertex != armyWay.length-1 ){
          var pointIndex = armyWayService.getPointIndex(unit.getField('pointsWithDates'), this.props.currentDate, this.props.time.getCalendar() );
          if(pointIndex !== vertex){
              var connectLabel = this.props.labels['Bind point to date']+' - '+this.state.formatter.getDateLabel(this.props.currentDate);
              items.push(<a key='awc'  href="#"
                            onClick={()=>{this.props.armyWayConnect(this.props.unit, this.props.vertex)}}>
                  {connectLabel}
              </a>);
          }
          items.push(<a key='rpoa' href="#"
                        onClick={()=>{this.props.removePoint(this.props.unit, this.props.vertex, this.props.path)}}>
              {this.props.labels['Remove point']}
          </a>);
      }

      if(armyWay[vertex].date && this.props.time.getCalendar().nE(unit.getDateBegin(),armyWay[vertex].date) &&
          this.props.time.getCalendar().nE(unit.getDateEnd(),armyWay[vertex].date)){
          var label = this.props.labels['Unbind point from date']+' - '+this.state.formatter.getDateLabel(armyWay[vertex].date) ;
          items.push(<a key='awdd' href="#"
                        onClick={()=>{this.props.armyWayDisconnectDate(this.props.unit, this.props.vertex)}}>
              {label}
          </a>);
      }
      if(armyWay[vertex].dateTo && this.props.time.getCalendar().nE(unit.getDateEnd(),armyWay[vertex].dateTo)){
          var label = this.props.labels['Unbind point from date']+' - '+this.state.formatter.getDateLabel(armyWay[vertex].dateTo) ;
          items.push(<a key='awddt' href="#"
                        onClick={()=>{this.props.armyWayDisconnectDateTo(this.props.unit, this.props.vertex)}}>
              {label}
          </a>)
      }
      if(armyWay[vertex].date){
          var invisibleLabel = armyWay[vertex].invisible ? this.props.labels['Show in point'] : this.props.labels['Hide in point'];
          items.push(<a key='awsi' href="#"
                        onClick={()=>{this.props.armyWaySetInvisible(this.props.unit, this.props.vertex)}} >
              {invisibleLabel}
          </a>)
      }
      return items;
  };

  showPopup(popupType, params){
      if(!params){
          params = {};
      }
      console.log(popupType);
      switch (popupType){
          case popup_types.UNIT_INFO:
              this.props.selectUnit(this.props.unit);
              this.props.showPopup(popupType, {unit: this.props.unit});
              break;
          case popup_types.UNIT_MAIN_SETTINGS:
              this.props.showPopup(popupType, {unit: this.props.unit, newUnitMode:false});
              break;
          case popup_types.UNIT_DYNAMIC_ICON:
              this.props.showPopup(popupType, {unit: this.props.unit, isNew:params.isNew});
              break;
          case popup_types.UNIT_DYNAMIC_COLOR:
              this.props.showPopup(popupType, {unit: this.props.unit, isNew:params.isNew});
              break;
          case popup_types.UNIT_COORDINATES:
              this.props.showPopup(popupType, {unit: this.props.unit, path: params.path});
              break;
      }
  }

    deleteUnit(unit){
      if (confirm(this.props.labels['Remove object']+"?")) {
          this.props.deleteUnit(unit, this.props.labels['Object removed']);
      }
    }

    deleteDynamicStyle(unit){
        if (confirm(this.props.labels['Remove current territory']+"?")) {
            this.props.deleteDynamicStyle(unit);
        }
    }

}

export default connect(
    (state, ownProps) => ({
        time: state.time,
        currentDate: state.currentDate,
        currentEvent: state.currentEvent,
        isMenuDisplayed: state.isMenuDisplayed,
        labels: state.labels,
        lang: state.lang,
        unit: state.menuParams.unit ? state.time.getTimeObjectById(state.menuParams.unit.getId()) : null,
        path: state.menuParams.path,
        vertex: state.menuParams.vertex,
        mousePosition: state.menuParams.mousePosition,
    }),
    (dispatch, ownProps) => {
        return {
            showPopup: (type, params) => {
                dispatch(showPopup(type, params));
            },
            selectUnit: (unit) => {
                dispatch(selectUnit(unit));
            },
            deleteDynamicStyle: (unit) => {
                dispatch(deleteDynamicStyle(unit));
            },
            newDynamicTerritory: (unit) => {
                dispatch(saveDynamicTerritory(unit.getId()));
            },
            deleteDynamicTerritory: (unit) => {
                dispatch(deleteDynamicTerritory(unit.getId()));
            },
            copyUnit: (unit) => {
                dispatch(copyUnit(unit));
            },
            deleteUnit: (unit, label) => {
                dispatch(deleteUnit(unit));
                dispatch(showMessage(label));
            },
            deselectUnit: () => {
                dispatch(deselectUnit());
            },

            addPolygon: (unit) => {
                dispatch(mapUnitAddPolygon(unit.getId()));
            },
            removePolygon: (unit, path) => {
                dispatch(mapUnitRemovePolygon(unit.getId(), path));
            },
            addBranch: (unit) => {
                dispatch(mapUnitAddBranch(unit.getId()));
            },
            removeBranch: (unit, path) => {
                dispatch(mapUnitRemoveBranch(unit.getId(), path));
            },
            removePoint: (unit, vertex, path) => {
                dispatch(mapUnitRemovePoint(unit, vertex, path));
            },

            armyWayConnect: (unit, vertex) => {
                dispatch(mapUnitArmyWayConnect(unit.getId(), vertex));
            },
            armyWayDisconnectDate: (unit, vertex) => {
                dispatch(mapUnitArmyWayDisconnectDate(unit.getId(), vertex));
            },
            armyWayDisconnectDateTo: (unit, vertex) => {
                dispatch(mapUnitArmyWayDisconnectDateTo(unit.getId(), vertex));
            },
            armyWaySetInvisible: (unit, vertex) => {
                dispatch(mapUnitArmyWaySetInvisible(unit.getId(), vertex));
            },
            rewindToEvent: (unit) => {
                dispatch(rewindToEvent(unit));
            },
            eventSetScreen: (event, label) => {
                dispatch(setEventScreen(event.getId()));
                dispatch(showMessage(label));
            },
            toggleEventShowMarker: (event) => {
                dispatch(toggleEventShowMarker(event));
            },
            setEventMarkerOnUnit: (unit, event) => {
                 dispatch(setEventMarkerOnUnit(event.getId(), unit.getId()));
            }
            
        }
    }
)(UnitMenu);


