var React = require('react');
import Server from '../../server/server.js';
import { connect } from 'react-redux'
import DateSelectContainer from '../custom_tags/date_select.jsx';
import Select from '../custom_tags/select.jsx';
import ImageSelector from '../custom_tags/image_selector.jsx';
import CommonLib from '../../libs/common/common_lib.js';
import { showPopup, hidePopup, saveEvent } from '../../actions/actions'
import * as popup_types from '../../actions/popup_types';
import { FormValidator } from '../../libs/form_validator';



/**
  Component for event form
*/
class EventEditPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errors:[], fields:{}};
    }


    componentWillMount() {
        this.setStateByProps(this.props);
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    setStateByProps(props) {
        var that = this;
        var mainObject = props.time.getTimeObjectById('MAIN');
        var fields = props.isNew ? {
            name : "",
            eventChains: [],
            showMarker: true,
            disableAnimation: false,
            dateBegin: props.currentDate,
        } : {
            name:props.event.getField('name'),
            description: props.event.getField('description'),
            dateBegin:props.event.getDateBegin(),
            eventChains: props.event.getField('eventChains') ? Object.keys(props.event.getField('eventChains')) : [],
            image:props.event.getField('image'),
            showMarker: props.event.getField('showMarker'),
            disableAnimation: props.event.getField('disableAnimation'),

            comments: props.event.getField('comments'),
            sources: props.event.getField('sources'),
            progress: props.event.getField('progress'),
            needHelp: props.event.getField('needHelp'),
        };

        this.setState({fields:fields});

        var articleId = !props.isNew ? props.event.getField('article') : null;
        var server = new Server;

        if(articleId){
            server.getArticleText(articleId, function(article){
                article = article.replace(/<br>/g, "\n");
                fields['article'] = article;
                that.setState({fields:fields});
            });
        }
    }

    render(){
        console.log('render', this.state);
        var mainObject = this.props.time.getTimeObjectById('MAIN');
        var calendar = this.props.time.getCalendar();

        return <div className="b-event-form">
                    <table className="show_object_table">
                        <tbody>
                        <tr>
                            <td>{ this.props.labels['Title']}</td>
                            <td><input className="b-text-input" value={ this.state.fields.name }
                                       onChange={this.handleChange.bind(this, "name")}/></td>
                        </tr>
                        <tr>
                            <td>{ this.props.labels['Date']}</td>
                            <td>
                                <DateSelectContainer
                                dateBegin={mainObject.getDateBegin()}
                                dateEnd={mainObject.getDateEnd()}
                                currentDate={CommonLib.clone(this.state.fields.dateBegin)}
                                mode={calendar.getMode()}
                                labels = {this.props.labels}
                                lang = {this.props.lang}
                                calendar={calendar}
                                noYearLimits={false}
                                callbackFunction={(dateBegin) => {this.setField('dateBegin', dateBegin)}}
                            />
                            </td>
                        </tr>
                        <tr>
                            <td>{ this.props.labels['Description']}</td>
                            <td><textarea className='b-event-box-textarea' onChange={this.handleChange.bind(this, "description")}
                                value={ this.state.fields.description } />
                            </td>
                        </tr>
                        <tr>
                            <td>{ this.props.labels['Show marker']}</td>
                            <td><input type="checkbox" checked={ this.state.fields.showMarker}
                                       onChange={this.handleChange.bind(this, "showMarker")}/></td>
                        </tr>
                        { mainObject.getField('animation') && 
                        <tr>
                            <td>this.props.labels['Disable animation']}</td>
                            <td><input type="checkbox" checked={ this.state.fields.disableAnimation}
                                       onChange={this.handleChange.bind(this, "disableAnimation")}/></td>
                         </tr>
                        }
                        <tr>
                            <td>{ this.props.labels['Event chains']}</td>
                            <td>
                                <CheckboxBlock
                                    chains={mainObject.getField('eventChains')}
                                    selectedChains={this.state.fields.eventChains ? this.state.fields.eventChains : []}
                                    changeCallback={(eventChains) => {this.setField('eventChains', eventChains)}}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{ this.props.labels['Article']}</td>
                            <td><textarea className='b-artile-textarea' onChange={this.handleChange.bind(this, "article")}
                                value={ this.state.fields.article } /></td>
                        </tr>
                        <tr>
                            <td>{ this.props.labels['Picture']}</td>
                            <td>
                                <ImageSelector
                                    image={this.state.fields.image}
                                    imageType='unitImage'
                                    handleChange={(image) => {this.setField('image', image)}}
                                />
                            </td>
                        </tr>
                    </tbody>
                    </table>
                    <div className='b-editor-table'>
                        <h3>{this.props.labels['Editor information'] }</h3>
                        <table className='show_object_table'>
                        <tbody>
                        <tr>
                            <td>{ this.props.labels['Comments']}</td>
                            <td><textarea className='b-event-box-textarea' onChange={this.handleChange.bind(this, "comments")}
                                          value={ this.state.fields.comments } />
                            </td>
                        </tr>
                        <tr>
                            <td>{ this.props.labels['Sources']}</td>
                            <td><textarea className='b-event-box-textarea' onChange={this.handleChange.bind(this, "sources")}
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
                            <td><input type="checkbox" onChange={this.handleChange.bind(this, "needHelp")}
                                       checked={ this.state.fields.needHelp } />
                            </td>
                        </tr>
                        </tbody>
                        </table>
                    </div>


                    <a className="b-button b-save-button js-submit" onClick={() => {this.save()}}>{ this.props.labels['Save']}</a>
                    &nbsp;&nbsp;
                    <a href='#' className="b-cancel" onClick={()=>{this.props.goBack()}}>{ this.props.labels['Cancel']}</a>
                    <span className="b-error-span js-error">{this.state.errors.join(", ")}</span>
                </div>
    }

    getProgressOptions() {
        var progressOptions = {};
        for(var i = 0;i<=100;i+=10){
            progressOptions[i] = i;
        }
        return progressOptions;
    }

    handleChange(fieldName, e){
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setField(fieldName, value);
    }

    setField(fieldName, fieldValue){
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields:fields});
    }

    save(){
        var that = this;
        var fields = this.state.fields;
        var validators = {
            'name': {'type':'NOT_EMPTY','errorLabel':this.props.labels['Empty name']}
        }

        var validator = new FormValidator();
        var errors = validator.validate({fields:fields, validators:validators});

        if(errors.length){
            this.setState({errors:errors});
        }
        else {
            var server = new Server;
            server.saveArticle(fields['article'], function(response){
                fields['article'] = response.articleId;
                that.props.saveEvent(fields);
                that.props.goBack();
            });

            }
    }


}

class CheckboxBlock extends React.Component {
    render(){
        
        var checkboxes = [];
        for(let chainId in this.props.chains){
            let chain = this.props.chains[chainId];

            checkboxes.push(<label key={chainId}>
                <input type="checkbox"
                       checked={this.props.selectedChains.indexOf(chainId) !== -1}
                       onChange={(e)=>{this.handleChange(chainId, e.target.checked)}}
                />
                {chain.name}
            <br/></label>);
        }

        return <div>
            {checkboxes}
        </div>
    }

    handleChange(chainId, isChecked){
        var chains = this.props.selectedChains;
        if(isChecked){
            chains.push(chainId);
        }
        else {
            var index = chains.indexOf(chainId);
            chains.splice(index,1);
        }
        this.props.changeCallback(chains);
    }
}


export default connect((state, ownProps) => ({
        labels: ownProps.labels,
        time: ownProps.time,
        event: ownProps.event,
        isNew: ownProps.isNew,
        currentDate: ownProps.currentDate,
    }),
    (dispatch, ownProps) => {
        return {
            saveEvent: (fields) => {
                dispatch(saveEvent(ownProps.isNew ? null : ownProps.event.getId(), fields, ownProps.isNew));
            },
            goBack: () => {
                if(ownProps.indexMode) {
                    dispatch(showPopup(popup_types.EVENT_LIST, {indexMode:ownProps.indexMode}));
                }
                else {
                    dispatch(hidePopup());
                }
            }
        }
    }

)(EventEditPopup);


