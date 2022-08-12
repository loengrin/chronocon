var React = require('react');
import { connect } from 'react-redux'
import { saveUnit } from '../../actions/actions';

import DateSelectContainer from '../custom_tags/date_select.jsx';
import Select from '../custom_tags/select.jsx';
import ImageBlock from '../custom_tags/image_block.jsx';

import CommonLib from '../../libs/common/common_lib.js';
import { FormValidator } from '../../libs/form_validator';

/**
  Component for unit details form
*/
class UnitForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errors: [], fields: {}};
    }

    componentWillMount() {
        this.setStateByProps(this.props);
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }
    
    setStateByProps(props){
        console.log(props);
        var that = this;
        var unit = props.unit;
        var mainObject = props.time.getTimeObjectById('MAIN');

        var type = props.newUnitMode ? this.props.type : unit.getType();

        var minSize = mainObject.getField('mapType') == 'FILE' ? 1 : 1;
        var sizeMax = mainObject.getField('mapType') == 'FILE' ? mainObject.getField('mapTypeOptions').maxScale : 24;

        var isLineOrRegion = type === "region" || type === "line";
        var hasLineStyle = type === "line";
        var isArmyOrCity = type === 'city' || type === 'army';

        var fields = props.newUnitMode ? {
            name: '',
            dateBegin: props.currentDate,
            dateEnd: mainObject.getDateEnd(),
            eventId: null,
            size: minSize,
            sizeMax: sizeMax,
            hasLabel : 0,
            comments: '',
            sources: '',
            progress: '',
            needHelp: '',
            type: type,
        } : {
            name: props.unit.getField('name') ,
            dateBegin: props.unit.getDateBegin(),
            dateEnd: props.unit.getDateEnd(),
            eventId: props.unit.getField('eventId'),
            size: props.unit.getField('size') ,
            sizeMax: props.unit.getField('sizeMax'),
            hasLabel : props.unit.getField('staticStyle').hasLabel,
            comments: props.unit.getField('comments'),
            sources: props.unit.getField('sources'),
            progress: props.unit.getField('progress'),
            needHelp: props.unit.getField('needHelp'),
            type: type,
        };

        if (isLineOrRegion){
            if (props.newUnitMode){
                fields.width = type === 'region' ? 2 : 4;
                fields.zIndex = type === 'region' ? 3 : 7;
                fields.color = type === 'region' ? '#ff0000' : '#0000ff';
                fields.opacity = type === 'region' ? 50 : 90;
                fields.opacity = 100 - fields.opacity;
            }
            else {
                fields.width =  props.unit.getField('staticStyle').width;
                fields.zIndex =  props.unit.getField('staticStyle').zIndex;
            }
        }
        if(isArmyOrCity && props.newUnitMode){
            fields.icon = type === 'city' ? '_def_city_antic_big_red.png' : '_def_army_boat_red.png';
        }
        if(hasLineStyle){
            fields.lineStyle =  !props.newUnitMode ? props.unit.getField('lineStyle') : 'arrow';
        }

        this.setState({
            fields: fields,
            bindedToEvent: (fields.eventId != null),
            minSize:minSize,
            sizeMax:sizeMax,
            isLineOrRegion: isLineOrRegion,
            isArmyOrCity: isArmyOrCity,
            hasLineStyle: hasLineStyle,
            type: type,
        });
    }

    render() {
        var unit = this.props.unit;

        var labelsCallback = function(label){
            return this.props.labels[label] ? this.props.labels[label] : label;
        }
        var calendar = this.props.time.getCalendar();

        var mainObject = this.props.time.getTimeObjectById('MAIN');

        return <div className="b-unit-form">
            <h3>{this.props.labels['Description'] }</h3>
            <table className="show_object_table">
                <tbody>
                <tr>
                    <td>{this.props.labels['Title']}</td>
                    <td><input className="b-text-input js-name-field"
                               value={ this.state.fields.name }
                               onChange={(e) => {this.setField('name', e.target.value)}}
                    /></td>
                </tr>

                {this.state.bindedToEvent &&
                <tr>
                    <td>{this.props.labels['Event']}</td>
                    <td className='js-unit-event'>
                        <Select
                            options={this.getEventOptions()}
                            selectedOption={this.state.fields.eventId}
                            callback={(eventId) => {this.setField('eventId', eventId)}}
                        />
                    </td>
                </tr>
                }
                {!this.state.bindedToEvent &&
                <tr>
                    <td>{this.props.labels['Begin date']}</td>
                    <td className='js-unit-date-begin'>
                        <DateSelectContainer
                            dateBegin={mainObject.getDateBegin()}
                            dateEnd={mainObject.getDateEnd()}
                            currentDate={CommonLib.clone(this.state.fields.dateBegin)}
                            labels = {this.props.labels}
                            lang = {this.props.lang}
                            mode={calendar.getMode()}
                            calendar={calendar}
                            noYearLimits={false}
                            callbackFunction={(dateBegin) => {this.setField('dateBegin', dateBegin)}}
                        />
                    </td>
                </tr>
                }
                {!this.state.bindedToEvent &&
                <tr>
                    <td>{this.props.labels['End date']}</td>
                    <td className='js-unit-date-end'>
                        <DateSelectContainer
                            dateBegin={mainObject.getDateBegin()}
                            dateEnd={mainObject.getDateEnd()}
                            currentDate={CommonLib.clone(this.state.fields.dateEnd)}
                            mode={calendar.getMode()}
                            labels = {this.props.labels}
                            lang = {this.props.lang}
                            calendar={calendar}
                            noYearLimits={false}
                            callbackFunction={(dateEnd) => {this.setField('dateEnd', dateEnd)}}
                        />
                    </td>
                </tr>
                }
                <tr>
                    <td>{this.props.labels['Bind to event']}</td>
                    <td>
                        <input className='js-unit-bind-event' type="checkbox"
                               checked={ this.state.bindedToEvent ? "checked" : "" }
                               onChange={(e) => {this.setState({'bindedToEvent': e.target.checked})}}
                        />
                    </td>
                </tr>
                <tr>
                    <td>{this.props.labels['Min scale']}</td>
                    <td className='js-unit-size'>
                        <Select
                            intMode={true} min={this.state.minSize} max={this.state.sizeMax}
                            selectedOption={this.state.fields.size}
                            callback={(size) => {this.setField('size', size)}}
                        />
                    </td>
                </tr>
                <tr>
                    <td>{this.props.labels['Max scale']}</td>
                    <td className='js-unit-size-max'>
                        <Select
                            intMode={true} min={this.state.minSize} max={this.state.sizeMax}
                            selectedOption={this.state.fields.sizeMax}
                            callback={(sizeMax) => {this.setField('sizeMax', sizeMax)}}
                        />
                    </td>
                </tr>
                {this.state.isLineOrRegion &&
                    <tr>
                        <td>{this.props.labels['Width']}</td>
                        <td className='js-unit-width'>
                            <Select
                                intMode={true} min={this.state.type === 'region' ? 0 : 1} max={10}
                                selectedOption={this.state.fields.width}
                                callback={(width) => {this.setField('width', width)}}
                            />
                        </td>
                    </tr>
                }
                {this.state.hasLineStyle &&
                    <tr>
                        <td>{this.props.labels['Line style']}</td>
                        <td className='js-unit-line_style'>
                            <Select
                                options={{
                                    'solid':this.props.labels['Solid'],
                                    'dashed':this.props.labels['Dashed'],
                                    'arrow':this.props.labels['Arrow'],
                                    'arrows':this.props.labels['Arrows']
                                }}
                                selectedOption={this.state.fields.lineStyle}
                                callback={(lineStyle) => {this.setField('lineStyle', lineStyle)}}
                            />
                        </td>
                    </tr>
                }
                <tr>
                    <td>{this.props.labels['Show label']}</td>
                    <td>
                        <input className='js-unit-has-label' type="checkbox"
                               checked={this.state.fields.hasLabel ? "checked" : "" }
                               onChange={(e) => {this.setField('hasLabel', e.target.checked)}}
                        />
                    </td>
                </tr>
                {this.state.isLineOrRegion &&
                    <tr>
                        <td>{this.props.labels['Stacking order']}</td>
                        <td className='js-unit-z-index'>
                            <Select
                                intMode={true} min={1} max={10}
                                selectedOption={this.state.fields.zIndex}
                                callback={(zIndex) => {this.setField('zIndex', zIndex)}}
                            />
                        </td>
                    </tr>
                }
                {this.state.isLineOrRegion && this.props.newUnitMode  &&
                    <tr>
                        <td>{this.props.labels['Color']}</td>
                        <td>
                            <input className='js-unit-color' type="color" value={ this.state.fields.color }
                                   onChange={(e) => {this.setField('color', e.target.value)}}/>
                        </td>
                    </tr>
                }
                {this.state.isLineOrRegion && this.props.newUnitMode  &&
                    <tr>
                        <td>{this.props.labels['Transparent']}</td>
                        <td className='js-unit-transparent'>
                            <Select
                                options={this.getOpacityOptions()}
                                selectedOption={this.state.fields.opacity}
                                callback={(opacity) => {this.setField('opacity', opacity)}}
                            />
                        </td>
                    </tr>
                }
                </tbody>
            </table>
            <div className='b-editor-table'>
                <h3>{this.props.labels['Editor information'] }</h3>
                <table className='show_object_table'>
                    <tbody>
                    <tr>
                        <td>{ this.props.labels['Comments']}</td>
                        <td><textarea className='b-event-box-textarea'
                                      onChange={(e) => {this.setField('comments', e.target.value)}}
                                      value={ this.state.fields.comments } />
                        </td>
                    </tr>
                    <tr>
                        <td>{ this.props.labels['Sources']}</td>
                        <td><textarea className='b-event-box-textarea'
                                      onChange={(e) => {this.setField('sources', e.target.value)}}
                                      value={ this.state.fields.sources } />
                        </td>
                    </tr>
                    <tr>
                        <td>{ this.props.labels['Progress']}</td>
                        <td>
                            <Select
                                options={this.getProgressOptions()}
                                selectedOption={this.state.fields.progress}
                                callback={(progress) => {this.setField('progress', progress)}}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>{ this.props.labels['Need help']}</td>
                        <td><input type="checkbox"
                                   onChange={(e) => {this.setField('needHelp', e.target.checked)}}
                                   checked={ this.state.fields.needHelp } />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            {this.state.isArmyOrCity && this.props.newUnitMode &&
                <ImageBlock
                    labels={this.props.labels}
                    icon={this.state.fields.icon}
                    allowRotate={this.state.type=='army'}
                    unitType={this.state.type}
                    callback={(icon) => {this.setField('icon', icon)}}
                />
            }
            <a className="b-button b-save-button js-submit" onClick={()=>{this.save()}}>{this.props.labels['Save']}</a>
            <span className="b-error-span js-error">{this.state.errors.join(", ")}</span>
        </div>
    }

    getOpacityOptions() {
        var transparentArr = {};
        for(var i = 0;i<=100;i+=10) {
            transparentArr[i] = i+"%";
        }
        return transparentArr;
    }

    getProgressOptions() {
        var progressOptions = {};
        for(var i = 0;i<=100;i+=10){
            progressOptions[i] = i;
        }
        return progressOptions;
    }

    getEventOptions() {
        var options = {'':''};
        var events = this.props.time.getObjectsOfType('event');
        events.sort(function(a,b){
            if(a.getField('name') > b.getField('name')) return 1;
            if(a.getField('name') < b.getField('name')) return -1;
            return 0;
        });
        for(var i=0;i<events.length;i++){
            options[events[i].getId()] = events[i].getField('name');
        }
        return options;
    }

    setField(fieldName, fieldValue) {
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields: fields});
    }

    save() {
        var fields = this.state.fields;
        var validators = {
            'name': {'type':'NOT_EMPTY','errorLabel':this.props.labels['Empty name']},
            'datePair': {'type':'DATE_PAIR', 'errorLabel':this.props.labels['Begin date greater than end date']},
            'sizePair': {'type':'SIZE_PAIR', 'errorLabel':this.props.labels['Min size greater than max size']},
        }

        if(this.state.isArmyOrCity && this.newUnitMode){
            validators['icon'] ={'type':'NOT_EMPTY', 'errorLabel':'Not selected icon'}
        }
        fields.opacity = 100 - fields.opacity;
        
        var validator = new FormValidator();
        var errors =  validator.validate({
            fields:fields,
            validators:validators,
            calendar: this.props.time.getCalendar()
        }, true);
        if(errors.length){
            this.setState({errors:errors});
        }
        else {
            this.props.saveUnit(fields);
        }
      }
}

export default connect((state, ownProps) => ({
        labels: ownProps.labels,
        lang: state.lang,
        time: ownProps.time,
        currentDate: ownProps.currentDate,
        unit: ownProps.unit,
        newUnitMode: ownProps.newUnitMode,
        type:  ownProps.type,
    }),
    (dispatch, ownProps) => {
        return {
            saveUnit: (fields) => {
                dispatch(saveUnit(ownProps.unit, fields, ownProps.newUnitMode));
            },
        }
    }

)(UnitForm);


