var React = require('react');
import { connect } from 'react-redux'
import { changeMapSetting, showPopup, zoomPlus, zoomMinus, hidePopup } from '../../actions/actions';


class SettingsMenu extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        var mainObject = this.props.time.getTimeObjectById('MAIN');
        
        return <div className="b-main-menu-popup">
        <div className="setting-checkboxes">
        { mainObject.getField('hasFog') &&
            <div>
               <input type='checkbox' id='dua' checked={this.props.mapSettings.fog} onChange={()=>{this.props.changeMapSetting('fog')}}/>
               <label htmlFor='dua'>{ this.props.labels['Hide unknown land'] }</label>
            </div>
        }
        <div>
            <input type='checkbox' id='di' checked={this.props.mapSettings.icons} onChange={()=>{this.props.changeMapSetting('icons')}}/>
            <label htmlFor='di'>{ this.props.labels['Show icons'] }</label>
        </div>
        <div>
            <input type='checkbox' id='dl' checked={this.props.mapSettings.labels} onChange={()=>{this.props.changeMapSetting('labels')}}/>
            <label htmlFor='dl'>{ this.props.labels['Show labels'] }</label>
        </div>
        </div>
        <span></span>
        <a key='zp' className='setting-link' onClick={()=>{this.props.zoomPlus()}} href="#">
                {this.props.labels['Zoom in'] }
            </a>
        <a key='zm' className='setting-link' onClick={()=>{this.props.zoomMinus()}} href="#">
                 {this.props.labels['Zoom out'] }
        </a>
        <span></span>
       
        
        </div>
    }

 
}

export default connect((state, ownProps) => ({
        labels: state.labels,
        mapSettings: state.mapSettings,
        time: state.time,
    }),
    (dispatch, ownProps) => {
        return {
            changeMapSetting: (settingKey) => {
                dispatch(changeMapSetting(settingKey));
            },
            zoomPlus: (eventId) => {
                dispatch(zoomPlus());
            },
            zoomMinus: (eventId) => {
                dispatch(zoomMinus());
            },
            hidePopup: (eventId) => {
                dispatch(hidePopup());
            }
        }
    }

)(SettingsMenu);


