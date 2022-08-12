var React = require('react');
import { connect } from 'react-redux'
import * as popup_types from '../../actions/popup_types';
import { hidePopup } from '../../actions/actions';
import { Scrollbars } from 'react-custom-scrollbars';


import UnitInfo from '../popups/unit_info.jsx';
import EventInfo from '../popups/event_info.jsx';
import MyMaps from '../popups/my_maps.jsx';
import RegisterForm from '../popups/register_form.jsx';
import SigninOrRegisterForm from '../popups/signin_or_register_form.jsx';
import History from '../popups/history.jsx';
import Import from '../popups/import.jsx';
import SigninForm from '../popups/signin_form.jsx';
import ChronomapForm from '../popups/chronomap_form.jsx';
import UnitForm from '../popups/unit_form.jsx';
import UnitColorForm from '../popups/unit_form_color.jsx';

import UnitIconForm from '../popups/unit_form_icon.jsx';
import UnitCoordinates from '../popups/unit_coordinates.jsx';
import EventList from '../popups/events_edit.jsx';
import ChainForm from '../popups/chain_edit.jsx';
import EventEditPopup from '../popups/event_edit.jsx';
import UnitInfoEditPopup from '../popups/unit_info_edit.jsx';
import UnitTableForm from '../popups/unit_table.jsx';
import Saver from '../popups/saver.jsx';
import UnitTableTemplates from '../popups/unit_table_templates.jsx';
import MapInfo from '../popups/map_info.jsx';
import Objects from '../popups/objects.jsx';
import NoRightsMessage from '../popups/no_rights_message.jsx';
import Message from '../popups/message.jsx';
import ChainList from '../popups/chains.jsx';
import MainMenu from '../popups/main_menu.jsx';
import SettingsMenu from '../popups/settings_menu.jsx';
import Comment from '../popups/comment.jsx';


/**
    Component for popup window. Here we choose which popup will be displayed depend on popupType parameter.
    All popup types you can see in file actions/popup_types .
*/
class PopupArea extends React.Component {
    constructor(props) {
        super(props);
   }

    render() {
        console.log(this.props);
        if(!this.props.isOpened){
            return false;
        }
        return  <div className={'b-popup-area '+(this.isShortWindow() ? 'b-popup-area-short' : '')} style={{'display':this.props.isOpened ? 'block': 'none'}}>
            <div className={"b-popup-wrapper "+
                    (this.hasCloseLink() ? 'b-popup-wrapper-hight-bottom ' : '')+
                    (this.isMenu() ? 'b-popup-wrapper-menu' : '') }>
                { !this.isMenu() &&
                    <div className="b-popup-close" onClick={() => this.hidePopup()}></div>
                }
                <h2 className="b-popup-title">{this.getPopupTitle() }</h2>
                <div className="b-popup-content">
                    {this.props.popupType == popup_types.SIGNIN &&
                        <SigninForm labels={this.props.labels}/>
                    }
                    {this.props.popupType == popup_types.REGISTER &&
                        <RegisterForm labels={this.props.labels}/>
                    }
                    {this.props.popupType == popup_types.SIGNIN_OR_REGISTER &&
                        <SigninOrRegisterForm labels={this.props.labels} callback={this.props.popupParams.callback}/>
                    }
                    {this.props.popupType == popup_types.MY_DATA &&
                        <RegisterForm labels={this.props.labels} myDataMode={true} myData={this.props.popupParams.myData}/>
                    }
                    {this.props.popupType == popup_types.MY_MAPS &&
                        <MyMaps labels={this.props.labels} chronomaps={this.props.popupParams.chronomaps} />
                    }
                    {this.props.popupType == popup_types.MAP_FORM &&
                        <ChronomapForm labels={this.props.labels} newMapMode={this.props.popupParams.newMapMode} />
                    }
                    {this.props.popupType == popup_types.UNIT_INFO &&
                        <UnitInfo
                            labels={this.props.labels}
                            unit={this.props.popupParams.unit}
                            time={this.props.time}
                            currentDate={this.props.currentDate}
                        />
                    }
                    {this.props.popupType == popup_types.UNIT_MAIN_SETTINGS &&
                        <UnitForm labels={this.props.labels}
                                  unit={this.props.popupParams.unit}
                                  newUnitMode={this.props.popupParams.newUnitMode}
                                  type={this.props.popupParams.type}
                                  time={this.props.time}
                                  currentDate={this.props.currentDate}
                        />
                    }
                    {this.props.popupType == popup_types.UNIT_DYNAMIC_ICON &&
                        <UnitIconForm labels={this.props.labels}
                              unit={this.props.popupParams.unit}
                              isNew={this.props.popupParams.isNew}
                              time={this.props.time}
                              currentDate={this.props.currentDate}
                        />
                    }
                    {this.props.popupType == popup_types.UNIT_DYNAMIC_COLOR &&
                        <UnitColorForm labels={this.props.labels}
                                  unit={this.props.popupParams.unit}
                                  isNew={this.props.popupParams.isNew}
                                  currentDate={this.props.currentDate}
                        />
                    }
                    {this.props.popupType == popup_types.UNIT_COORDINATES &&
                        <UnitCoordinates labels={this.props.labels}
                                   unit={this.props.popupParams.unit}
                                   path={this.props.popupParams.path}
                                   segmentNumber={this.props.popupParams.path}
                                   currentDate={this.props.currentDate}
                        />
                    }
                    {this.props.popupType == popup_types.CUSTOM &&
                        <div dangerouslySetInnerHTML={{__html:  this.props.popupParams.popupContent}} />
                    }
                    {this.props.popupType == popup_types.EVENT_LIST &&
                        <EventList
                            labels={this.props.labels}
                            time={this.props.time}
                            indexMode={this.props.popupParams && this.props.popupParams.indexMode ? this.props.popupParams.indexMode: this.props.indexMode}
                        />
                    }
                    {this.props.popupType == popup_types.EDIT_CHAIN &&
                        <ChainForm
                            labels={this.props.labels}
                            time={this.props.time}
                            chain={this.props.popupParams.chain}
                            isNew={this.props.popupParams.isNew}
                        />
                    }
                    {this.props.popupType == popup_types.EDIT_EVENT &&
                        <EventEditPopup
                        labels={this.props.labels}
                        time={this.props.time}
                        event={this.props.popupParams.event}
                        isNew={this.props.popupParams.isNew}
                        indexMode={this.props.popupParams.indexMode}
                        currentDate={this.props.currentDate}
                    />
                    }
                    {this.props.popupType == popup_types.UNIT_DESCRIPTION &&
                        <UnitInfoEditPopup
                            labels={this.props.labels}
                            unit={this.props.popupParams.unit}
                            isNew={this.props.popupParams.isNew}
                            isStatic={this.props.popupParams.isStatic}
                            dynamicDescription={this.props.popupParams.dynamicDescription}
                        />
                    }
                    {this.props.popupType == popup_types.UNIT_TABLE &&
                        <UnitTableForm
                            labels={this.props.labels}
                            unit={this.props.popupParams.unit}
                            isNew={this.props.popupParams.isNew}
                            isStatic={this.props.popupParams.isStatic}
                            dynamicTable={this.props.popupParams.dynamicTable}
                        />
                    }
                    {this.props.popupType == popup_types.SAVING_MAP &&
                        <Saver
                            labels={this.props.labels}
                            saveAsMode={this.props.popupParams.saveAsMode}
                        />
                    }
                    {this.props.popupType == popup_types.IMPORT_UNITS &&
                        <Import/>
                    }
                    {this.props.popupType == popup_types.TABLE_TEMPLATES &&
                        <UnitTableTemplates/>
                    }
                    {this.props.popupType == popup_types.HISTORY &&
                        <History mapId={this.props.mapId} mapVersion={this.props.mapVersion}/>
                    }
                    {this.props.popupType == popup_types.MAP_INFO &&
                        <MapInfo/>
                    }
                    {this.props.popupType == popup_types.OBJECT_LIST &&
                        <Objects/>
                    }
                    {this.props.popupType == popup_types.EVENT_INFO &&
                        <EventInfo event={this.props.popupParams.event}/>
                    }
                    {this.props.popupType == popup_types.NO_RIGHTS_MESSAGE &&
                        <NoRightsMessage/>
                    }
                    {this.props.popupType == popup_types.MESSAGE &&
                        <Message message = {this.props.popupParams.message}/>
                    }
                    {this.props.popupType == popup_types.CHAIN_LIST &&
                        <ChainList/>
                    }
                    {this.props.popupType == popup_types.MAIN_MENU &&
                        <MainMenu/>
                    }
                    {this.props.popupType == popup_types.SETTINGS_MENU &&
                        <SettingsMenu/>
                    }
                    {this.props.popupType == popup_types.COMMENT &&
                        <Comment/>
                    }
                </div>
                {this.hasCloseLink() &&
                    <div className='close-link'><div className='close-link-div'>
                    <span className='close-link-label b-button' onClick={() => this.hidePopup()} >
                    {this.props.labels['Close']}
                    </span>
                </div></div>
                }
            </div>
        </div>;
    }

    getPopupTitle(){
        switch (this.props.popupType){
            case popup_types.CUSTOM:{
                return this.props.popupParams.popupTitle;
            }
            case popup_types.SIGNIN:{
                return this.props.labels['Signin'];
            }
            case popup_types.REGISTER:{
                return this.props.labels['Register'];
            }
            case popup_types.SIGNIN_OR_REGISTER:{
                return this.props.labels['Signin']+" / "+this.props.labels['Register'];
            }
            case popup_types.MY_DATA:{
                return this.props.labels['My data'];
            }
            case popup_types.MY_MAPS:{
                return this.props.labels['My maps'];
            }
            case popup_types.MAP_FORM:{
                return this.props.popupParams.newMapMode ?
                    this.props.labels['New map'] :
                    this.props.labels['Map settings'];
            }
            case popup_types.UNIT_INFO:{
                return this.props.popupParams.unit.getField('name');
            }
            case popup_types.UNIT_MAIN_SETTINGS:{
                return !this.props.popupParams.newUnitMode ?
                    this.props.popupParams.unit.getField('name') :
                    this.props.labels['New unit'];
            }
            case popup_types.UNIT_DYNAMIC_ICON:{
                return this.props.popupParams.unit.getField('name');
            }
            case popup_types.UNIT_DYNAMIC_COLOR:{
                return this.props.popupParams.unit.getField('name');
            }
            case popup_types.UNIT_COORDINATES:{
                return this.props.popupParams.unit.getField('name');
            }
            case popup_types.UNIT_DESCRIPTION:{
                return this.props.popupParams.unit.getField('name');
            }
            case popup_types.UNIT_TABLE:{
                return this.props.popupParams.unit.getField('name');
            }
            case popup_types.EVENT_LIST:{
                return  this.props.labels['Event management'];
            }
            case popup_types.EDIT_CHAIN:{
                return !this.props.popupParams.isNew ?
                    this.props.popupParams.chain.name :
                    this.props.labels['New event chain'];
            }
            case popup_types.SAVING_MAP:{
                return this.props.labels['Save changes'];
            }
            case popup_types.IMPORT_UNITS:{
                console.log('Import objects',this.props.labels);
                return this.props.labels['Import objects'];
            }
            case popup_types.TABLE_TEMPLATES:{
                return this.props.labels['Table templates'];
            }
            case popup_types.HISTORY:{
                return this.props.labels['Changing history'];
            }
            case popup_types.MAP_INFO:{
                return this.props.labels['Introduction'];
            }
            case popup_types.OBJECT_LIST:{
                return this.props.labels['Objects'];
            }
            case popup_types.EVENT_INFO:{
                return this.props.popupParams.event.getField('name');
            }
            case popup_types.EDIT_EVENT:{
                    return !this.props.popupParams.isNew ?
                    this.props.popupParams.event.getField('name') :
                    this.props.labels['New event'];
                return 
            }
            case popup_types.EVENT_INFO:{
                return this.props.popupParams.event.getField('name');
            }
            case popup_types.NO_RIGHTS_MESSAGE:{
                return this.props.labels['No Right'];
            }
            case popup_types.CHAIN_LIST:{
                return this.props.labels['No Right'];
            }
            case popup_types.MAIN_MENU:{
                return this.props.labels['Main Menu'];
            }
            case popup_types.SETTINGS_MENU:{
                return this.props.labels['Settings Menu'];
            }
            case popup_types.COMMENT:{
                return this.props.labels['Feedback'];
            }
        }
    }

    hidePopup() {
        this.props.hidePopup();
    }
    
    hasCloseLink() {
        
        return this.props.popupType == popup_types.UNIT_INFO || 
                this.props.popupType == popup_types.EVENT_INFO || 
                this.props.popupType == popup_types.MAP_INFO || 
                this.props.popupType == popup_types.SETTINGS_MENU;
    }
    
    isMenu() {
        return this.props.popupType == popup_types.MAIN_MENU ;
   //             || this.props.popupType == popup_types.SETTINGS_MENU;
               
    }

    isShortWindow() {
        var shortWindowPopups = [
                popup_types.SIGNIN, popup_types.NO_RIGHTS_MESSAGE, popup_types.MAIN_MENU,
                popup_types.SETTINGS_MENU
        ]

        return shortWindowPopups.indexOf(this.props.popupType) != -1;

    }
}



export default connect((state, ownProps) => ({
        isOpened: state.isPopupOpened,
        popupType: state.popupType,
        popupParams: state.popupParams,
        labels: state.labels,
        time: state.time,
        currentDate: state.currentDate,
        indexMode: state.indexMode,
        mapId: state.mapId,
        mapVersion: state.mapVersion,
    }),
    (dispatch, ownProps) => {
        return {
            signin: () => {
                dispatch({type: 'SHOW_SIGNIN_POPUP'})
            },
            hidePopup: () => {
                dispatch(hidePopup());
            }
        }
    }

)(PopupArea);