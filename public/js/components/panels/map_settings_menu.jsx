var React = require('react');
import { connect } from 'react-redux'
import { changeMapSetting, showPopup, toggleMapMenu, changeMapType, hideMapMenu } from '../../actions/actions';
import * as popup_types from '../../actions/popup_types';



class MapSettingsMenuArea extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return <div className="b-map-settings-area">     
            <div className="b-map-frame-settings">
                <button className="b-map-frame-settings_button b-button"
                    title={this.props.labels['Map Settings']}
                    onClick={()=>{this.props.toggleMapMenu()}} >
                </button>
            </div>
             <div className="b-map-settings-menu-area">
                <MapSettingsMenu 
                    changeMapSetting={this.props.changeMapSetting} 
                    showPopup={this.props.showPopup} 
                    showObjectList={this.props.showObjectList}
                    mapInfo={this.props.mapInfo}
                    labels={this.props.labels}
                    mapLoaded={this.props.mapLoaded}
                    mapSettings={this.props.mapSettings}
                    time={this.props.time}
                    isMapMenuDisplayed={this.props.isMapMenuDisplayed}
                    changeMapType={this.props.changeMapType}
                    mapTypeId={this.props.mapTypeId}
                />
            </div>
        </div>
               
    }
}

          
               
class MapSettingsMenu extends React.Component {
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
    }

    render(){
        if(!this.props.mapLoaded){
            return false;
        }
        if(!this.props.isMapMenuDisplayed){
          return false;
        }

        var items = this.getMenuItems();
        return <div className="b-settings-menu-wrapper">
            <div className="b-unit-menu">
                {items}
            </div>
        </div>
    }

    getMenuItems() {
        var items = [];
        
        items.push(<a key='md' onClick={()=>{this.props.mapInfo()}} href="#">
                    { this.props.labels['Map Description'] }
            </a>);
        items.push(<a key='mo' onClick={()=>{this.props.showObjectList()}} href="#">
                { this.props.labels['Map objects'] }
            </a>);
       
       if(this.props.mapTypeId != 'ROADMAP') {
            items.push(<a key='cmm' onClick={()=>{this.props.changeMapType('ROADMAP')}} href="#">
                { this.props.labels['Roadmap/Satellite'] } 
            </a>);
        }
        
        if(this.props.mapTypeId != 'SATELLITE') {
            items.push(<a key='cms' onClick={()=>{this.props.changeMapType('SATELLITE')}} href="#">
                { this.props.labels['Roadmap/Satellite'] }
            </a>);
        }
        
                    
        var mainObject = this.props.time.getTimeObjectById('MAIN');
        if(mainObject.getField('hasFog')) {
            items.push(<a key='dua' href="#">
               <input type='checkbox' id='dua' checked={this.props.mapSettings.fog} onChange={()=>{this.props.changeMapSetting('fog')}}/>
               <label htmlFor='dua'>{ this.props.labels['Hide unknown land'] }</label>
            </a>);
        }
        items.push(<a key='di'href="#">
            <input type='checkbox' id='di' checked={this.props.mapSettings.icons} onChange={()=>{this.props.changeMapSetting('icons')}}/>
                <label htmlFor='di'>{ this.props.labels['Show icons'] }</label>
            </a>);
        items.push(<a key='dl'href="#">
            <input type='checkbox' id='dl' checked={this.props.mapSettings.labels} onChange={()=>{this.props.changeMapSetting('labels')}}/>
                <label htmlFor='dl'>{ this.props.labels['Show labels'] }</label>
        </a>);
            
        return items;
    }

}

export default connect(
    (state, ownProps) => ({
        labels: state.labels,
        mapLoaded: state.mapLoaded,
        mapSettings: state.mapSettings,
        mapTypeId: state.mapTypeId,
        time: state.time,
        isMapMenuDisplayed: state.isMapMenuDisplayed
    }),
    (dispatch, ownProps) => {
        return {
            mapInfo: () => {
                dispatch(showPopup(popup_types.MAP_INFO));
                dispatch(hideMapMenu()); 
            },
            showObjectList: () => {
                dispatch(showPopup(popup_types.OBJECT_LIST));
                dispatch(hideMapMenu());
            },
            changeMapSetting: (settingKey) => {
                dispatch(changeMapSetting(settingKey));
            },
            toggleMapMenu: () => {
                dispatch(toggleMapMenu());
            },
            changeMapType: (mapTypeId) => {
                dispatch(changeMapType(mapTypeId));
            },
        }
    }
)(MapSettingsMenuArea);


