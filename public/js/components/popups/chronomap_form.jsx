var React = require('react');
import DateSelectContainer from '../custom_tags/date_select.jsx';
import Select from '../custom_tags/select.jsx';
import ImageSelector from '../custom_tags/image_selector.jsx';
import { FormValidator } from '../../libs/form_validator';


import { connect } from 'react-redux'
import { Calendar } from '../../libs/time/calendar/calendar.js';
import { saveMapInfo } from '../../actions/actions';
import { createChronomap } from '../../actions/create_map_action';
import Server from '../../server/server.js';

/**
  Component for map settings form
*/
class ChronomapForm extends React.Component {
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
        var that = this;
        
        
        
        var fields = {
            name: !props.newMapMode ? props.chronomap.getField('name') : '',
            description: !props.newMapMode ? props.chronomap.getField('description') : '',
            image: !props.newMapMode ? props.chronomap.getField('image') : 'default_map_title.jpg',
            lang: !props.newMapMode ? props.chronomap.getField('lang') : props.lang,
            mapType: !props.newMapMode ? props.chronomap.getField('mapType') : 'SATELLITE',
            dateMode: !props.newMapMode ? props.chronomap.getField('dateMode') : 'month',
            hasFog: !props.newMapMode ? props.chronomap.getField('hasFog') : false,
            animation: !props.newMapMode ? props.chronomap.getField('animation') : false,
            initialZoom: !props.newMapMode && props.chronomap.getField('initialZoom') ? props.chronomap.getField('initialZoom') : 3,

            dateBegin: !props.newMapMode ? props.chronomap.getDateBegin() : {year:1990, month:9,day:7, hour: 6},
            dateEnd: !props.newMapMode ? props.chronomap.getDateEnd() : {year:1991, month:9,day:7, hour: 18},

            published: !props.newMapMode ? props.chronomap.getField('published') : false,
            openEditing: !props.newMapMode ? props.chronomap.getField('openEditing') : false,
            editors: !props.newMapMode ? props.chronomap.getField('editors') : props.userLogin,

            file: !props.newMapMode && props.chronomap.getField('mapTypeOptions') ?
                props.chronomap.getField('mapTypeOptions').file : '',
            maxScale: !props.newMapMode &&  props.chronomap.getField('mapTypeOptions') ?
                props.chronomap.getField('mapTypeOptions').maxScale : 3,
            article: ''
        };
        console.log(fields, props);

        if(fields.dateMode === 'decade' || this.state.fields.dateMode === 'century'){
            fields.dateEnd = Object.assign({}, fields.dateEnd, {year: fields.dateEnd.year+1});
        }

        this.setState({fields: fields});
        if(!props.newMapMode){
            var minSize = props.chronomap.getField('mapType') == 'FILE' ? 1 : 1;
            var sizeMax = props.chronomap.getField('mapType') == 'FILE' ? props.chronomap.getField('mapTypeOptions').maxScale : 24;
            this.setState({
                minSize:minSize,
                sizeMax:sizeMax
           });
        }


        if(!props.newMapMode) {
            var articleId = this.props.chronomap.getField('article');
            if (articleId) {
                var server = new Server;
                server.getArticleText(articleId, function (article) {
                    article = article.replace(/<br>/g, "\n");
                    fields['article'] = article;
                    that.setState({fields: fields});
                });
            }
        }
    }

    render() {
        console.log('render', this.state, this.props);
        var that = this;
        var labelsCallback = function(label){
            return that.props.labels[label] ? that.props.labels[label] : label;
        }
        var calendar = this.props.newMapMode ?
            new Calendar(this.state.fields.dateMode, this.state.fields.dateBegin, this.props.lang, this.props.labels) :
            this.props.time.getCalendar();

        var dateEnd = this.state.fields.dateEnd;



        return <div className="b-chronomap-info-form">
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
                <tr>
                    <td>{this.props.labels['Description']}</td>
                    <td><textarea className="b-text-input js-description-field b-descr-textarea"
                              value={this.state.fields.description }
                              onChange={(e) => {this.setField('description', e.target.value)}}
                    /></td>
                </tr>
                <tr>
                    <td>{this.props.labels['Picture']}</td>
                    <td>
                        <ImageSelector
                           image={this.state.fields.image}
                           imageType='chronomapImage'
                           handleChange={(image) => {this.setField('image', image)}}
                        />
                    </td>
                </tr>
                <tr>
                    <td>{this.props.labels['Language']}</td>
                    <td>
                        <Select
                            options={{'ru':this.props.labels['Russian'],'en':this.props.labels['English']}}
                            selectedOption={this.state.fields.lang}
                            callback={(lang) => {this.setField('lang', lang)}}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            <h3>{this.props.labels['Map settings']}</h3>
            <table className="show_object_table">
                <tbody>
                <tr>
                    <td>{this.props.labels['Time step']}</td>
                    <td>
                        <Select
                            options={this.getDateTypeOptions()}
                            selectedOption={this.state.fields.dateMode}
                            callback={(dateMode) => {this.setField('dateMode', dateMode)}}
                        />
                    </td>
                </tr>
                <tr>
                    <td>{this.props.labels['Begin date']}</td>
                    <td>
                        <DateSelectContainer
                            currentDate={this.state.fields.dateBegin}
                            calendar={calendar}
                            noYearLimits={true}
                            labels = {this.props.labels}
                            lang = {this.props.lang}     
                            mode={this.state.fields.dateMode}
                            callbackFunction={(dateBegin) => {this.setField('dateBegin', dateBegin)}}
                        />
                    </td>
                </tr>
                <tr>
                    <td>{this.props.labels['End date']}</td>
                    <td>
                        <DateSelectContainer
                            currentDate={dateEnd}
                            calendar={calendar}
                            labels = {this.props.labels}
                            lang = {this.props.lang}
                            noYearLimits={true}
                            mode={this.state.fields.dateMode}
                            callbackFunction={(dateEnd) => {this.setField('dateEnd', dateEnd)}}
                        />
                    </td>
                </tr>
                <tr>
                    <td>{this.props.labels['Map type']}</td>
                    <td>
                        <Select
                            options={!this.props.newMapMode ?
                                (this.state.fields.mapType === 'FILE' ?
                                    {'FILE':this.props.labels['File']} :
                                    {'SATELLITE':this.props.labels['Satellite'],'ROADMAP':this.props.labels['Map']}) :
                                {
                                    'SATELLITE':this.props.labels['Satellite'],
                                    'ROADMAP':this.props.labels['Map'],
                                    'FILE':this.props.labels['File']
                                }}
                            selectedOption={this.state.fields.mapType}
                            callback={(mapType) => {this.setField('mapType', mapType)}}
                        />
                    </td>
                </tr>
                {this.props.newMapMode && this.state.fields.mapType === 'FILE' &&
                    <tr>
                        <td>{this.props.labels['Map area file']}</td>
                        <td>
                            <ImageSelector
                                imageType='chronomapAreaImage'
                                handleChange={(file, width, height) => {
                                    console.log(file, width, height);
                                    this.setField('file', file);
                                    this.setField('mapItemWidth', width);
                                    this.setField('mapItemHeight', height);
                                }}
                            />
                        </td>
                    </tr>
                }
                {this.props.newMapMode && this.state.fields.mapType === 'FILE' &&
                    <tr>
                        <td>{this.props.labels['Max scale']}</td>
                        <td>
                            <Select
                                intMode={true} min={1} max={6}
                                selectedOption={this.state.fields.maxScale}
                                callback={(maxScale) => {this.setField('maxScale', maxScale)}}
                            />
                        </td>
                    </tr>
                }
                <tr>
                    <td>{this.props.labels['Unknown area']}</td>
                    <td><input type="checkbox" className='js-has-fog-field'
                               checked={this.state.fields.hasFog ? "checked" : ""}
                               onChange={(e) => {this.setField('hasFog', e.target.checked)}}
                    />
                    </td>
                </tr>
                <tr>
                    <td>{this.props.labels['Animation']}</td>
                    <td><input type="checkbox" className='js-animation-field'
                               checked={this.state.fields.animation ? "checked" : ""}
                               onChange={(e) => {this.setField('animation', e.target.checked)}}
                    />
                    </td>
                </tr>
                {!this.props.newMapMode &&
                <tr>
                    <td>{this.props.labels['Initial scale']}</td>
                    <td className='js-unit-size'>
                        <Select
                            intMode={true} min={this.state.minSize} max={this.state.sizeMax}
                            selectedOption={this.state.fields.initialZoom}
                            callback={(size) => {this.setField('initialZoom', size)}}
                        />
                    </td>
                </tr>
                }
                </tbody>
            </table>
            {!this.props.newMapMode &&
            <div>
                <h3>{this.props.labels['Introduction']}</h3>
                <table className="show_object_table">
                    <tbody>
                    <tr>
                        <td>{this.props.labels['Article']}</td>
                        <td>
                           <textarea className='b-artile-textarea'
                             value={ this.state.fields.article }
                             onChange={(e) => {this.setField('article', e.target.value)}}
                           />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            }
            {(this.props.newMapMode || this.props.isOwnerMode) &&
            <div>
                <h3>{this.props.labels['Rights']}</h3>
                <table className="show_object_table">
                    <tbody>
                    <tr>
                        <td>{this.props.labels['Editors (comma separated)']}</td>
                        <td><textarea className="b-descr-textarea js-editors-field"
                          value={ this.state.fields.editors }
                          onChange={(e) => {this.setField('editors', e.target.value)}}
                        /></td>
                    </tr>
                    <tr>
                        <td>{this.props.labels['Published']}</td>
                        <td><input className='js-published-field' type="checkbox"
                                   checked={this.state.fields.published ? "checked" : ""}
                                   onChange={(e) => {this.setField('published', e.target.checked)}}
                        /></td>
                    </tr>
                    <tr>
                        <td>{this.props.labels['Open editing']}</td>
                        <td><input className='js-open-editing-field' type="checkbox"
                                   checked={this.state.fields.openEditing ? "checked" : ""}
                                   onChange={(e) => {this.setField('openEditing', e.target.checked)}}
                        /></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            }
            <a className="b-button b-save-button js-submit" onClick={()=>{this.save()}}>{this.props.labels['Save']}</a>
            <span className="b-error-span js-error">{this.state.errors.join(", ")}</span>
        </div>
    }

    getDateTypeOptions(){
        var types = {
            'century':this.props.labels['Century'],
            'decade':this.props.labels['Decade'],
            'year':this.props.labels['Year'],
            'month':this.props.labels['Month'],
            'day':this.props.labels['Day'],
            'hour':this.props.labels['Hour'],
            'series':this.props.labels['Series']
        }

        if(!this.props.newMapMode) {
            var options = {};
            var currentMode = this.state.fields.dateMode;
            options[currentMode] = types[currentMode];
            return options;
        }
        else {
            return types;
        }
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
            'dateBegin': {'type':'VALID_DATE_YEAR','errorLabel':this.props.labels['Invalid begin date year']},
            'dateEnd': {'type':'VALID_DATE_YEAR','errorLabel':this.props.labels['Invalid end date year']},
            'datePair': {'type':'DATE_PAIR', 'errorLabel':this.props.labels['Begin date greater than end date']},
        }

        if(this.props.newMapMode && fields['mapType'] === 'FILE'){
            validators['mapArea'] ={'type':'NOT_EMPTY', 'errorLabel':this.props.labels['No map area file']}
        }
        var validator = new FormValidator();
        var errors =  validator.validate({fields:fields, validators:validators}, true);
        if(errors.length){
            console.log(errors);
            this.setState({errors:errors});
        }
        else {
            if (fields['dateMode'] === 'decade' || fields['dateMode'] === 'century') {
                fields['dateEnd'].year = fields['dateEnd'].year - 1;
            }
            if (this.props.newMapMode) {
                this.props.createChronomap(fields);
            }
            else {
                this.saveMapInfo(fields);
            }
        }
    }

    saveMapInfo(fields) {
        var server = new Server;
        var that = this;
        server.saveArticle(fields['article'], function(response){
            fields['article'] = response.articleId;
            that.props.saveMapInfo(fields);
        });
    }


}

export default connect((state, ownProps) => ({
        labels: state.labels,
        lang: state.lang,
        time: state.time,
        isOwnerMode: state.mapRights === 'owner',
        newMapMode: ownProps.newMapMode,
        chronomap: ownProps.newMapMode ? null :  state.time.getTimeObjectById('MAIN'),
        userLogin: state.user ? state.user.login : ''
    }),
    (dispatch, ownProps) => {
        return {
            createChronomap: (fields) => {
                dispatch(createChronomap(fields))
            },
            saveMapInfo: (fields) => {
                dispatch(saveMapInfo(fields, ownProps.newMapMode));
            },

        }
    }

)(ChronomapForm);


