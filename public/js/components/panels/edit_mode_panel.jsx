var React = require('react');
import { connect } from 'react-redux'
import { showPopup, showSearchBlock, showMapSavePopup, changeMapSetting } from '../../actions/actions'
import * as popup_types from '../../actions/popup_types';


/**
Component for buttons in the bottom of map page. It became visible when user turns map to edit mode.
*/
class EditModePanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
console.log(this.props.currentPoint);
      return <div>
        <div className="b-create-section">
          <div className="b-add-objects-panel">
            <button className="b-add-objects-panel__city b-button"
                    title={this.props.labels['Create fixed unit']}
                    onClick={()=>{this.props.createUnit('city')}}>
            </button>
            <button className="b-add-objects-panel__region b-button"
                    title={this.props.labels['Create region']}
                    onClick={()=>{this.props.createUnit('region')}}>
            </button>
            <button className="b-add-objects-panel__line b-button"
                    title={this.props.labels['Create line']}
                    onClick={()=>{this.props.createUnit('line')}}>
            </button>
            <button className="b-add-objects-panel__army b-button"
                    title={this.props.labels['Create moving unit']}
                    onClick={()=>{this.props.createUnit('army')}}>
            </button>
          </div>
        </div>
        <div className="b-position-section">
          <table>
            <tbody>
            <tr>
              <th>{this.props.labels['Scale']}:</th>
              <td className="b-position-panel__zoom">{this.props.mapState.mapZoom}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="b-position-section">
          <table>
            <tbody>
            {this.props.currentPoint.lat &&
                <tr className="b-position-panel__coords">
                    <th>{this.props.labels['Lat']}:</th>
                    <td className="b-position-panel__lat">{this.getCoordLabel(this.props.currentPoint.lat,'lat')}</td>
                </tr>
            }
            {this.props.currentPoint.lng &&
                <tr className="b-position-panel__coords">
                    <th>{this.props.labels['Lng']}:</th>
                    <td className="b-position-panel__lng">{this.getCoordLabel(this.props.currentPoint.lng,'lng')}</td>
                </tr>
            }
            </tbody>
          </table>
        </div>
        <div className="b-buttons-section">
          <button className="b-edit-mode-buttons__settings-button b-button"
                  title={this.props.labels['Map settings']} onClick={()=>{this.props.showMapForm()}}>
          </button>
          <button className="b-edit-mode-buttons__history-button b-button"
                  title={this.props.labels['History']} onClick={()=>{this.props.history()}}>
          </button>
          <button className="b-edit-mode-buttons__objects-button b-button"
                  title={this.props.labels['Map objects']} onClick={()=>{this.props.showObjects()}}>
          </button>
          <button className="b-edit-mode-buttons__copy-button b-button"
                  title={this.props.labels['Save copy']} onClick={()=>{this.props.saveMap(true)}}>
          </button>
          <button className="b-edit-mode-buttons__import-button b-button"
                  title={this.props.labels['Import objects']} onClick={()=>{this.props.importInits()}}>
          </button>
          <button className="b-edit-mode-buttons__mobile_emulate-button b-button"
                  title={this.props.labels['Mobile version screen size']} onClick={()=>{this.props.mobileEmulate()}}>
          </button>
          <button className="b-edit-mode-buttons__search-button b-button"
                  title={this.props.labels['Search']} onClick={()=>{this.props.showSearchBlock()}}>
          </button>
          <button className="b-edit-mode-buttons__table_templates-button b-button"
                  title={this.props.labels['Table templates']} onClick={()=>{this.props.tableTemplates()}}>
          </button>

          <button className="b-edit-mode-buttons__save-button b-button" onClick={()=>{this.props.saveMap(false)}}>
              {this.props.labels['Save']}
          </button>
        </div>
      </div>
    }

    getCoordLabel(coords, type) {
        var cAbs = (coords>0 ? coords : -coords );
        var d = parseInt(cAbs);
        var m = parseInt((cAbs - d) * 60);
        var s = parseInt((cAbs - d - m/60) * 3600 *100)/100;
        var add = type =='lat' ? (coords > 0 ? this.props.labels['N'] : this.props.labels['S']) :
            (coords > 0 ? this.props.labels['E'] : this.props.labels['W']);
        return d+'° '+m+"′ "+s+'″ '+add;
    };
}

export default connect((state, ownProps) => ({
        labels: state.labels,
        mapState: state.mapState,
        currentPoint: state.currentPoint,
     }),
    (dispatch, ownProps) => {
        return {
            createUnit: (type) => {
                dispatch(showPopup(popup_types.UNIT_MAIN_SETTINGS, {newUnitMode: true, type:type}));
            },
            saveMap: (saveAsMode) => {
                dispatch(showMapSavePopup(saveAsMode));
            },
            importInits: () => {
                dispatch(showPopup(popup_types.IMPORT_UNITS));
            },
            tableTemplates: () => {
                dispatch(showPopup(popup_types.TABLE_TEMPLATES));
            },
            history: () => {
                dispatch(showPopup(popup_types.HISTORY));
            },
            showObjects: () => {
                 dispatch(showPopup(popup_types.OBJECT_LIST));
            },
            showSearchBlock: () => {
                dispatch(showSearchBlock());
            },
            showMapForm: () => {
                dispatch(showPopup(popup_types.MAP_FORM, {newMapMode: false}))
            },
            mobileEmulate: () => {
                dispatch(changeMapSetting('mobileEmulate'));
            }

        }
    }
)(EditModePanel);
