
import UnitTable from '../custom_tags/unit_table.jsx';
var React = require('react');
import { connect } from 'react-redux'
import Server from '../../server/server.js';
import * as popup_types from '../../actions/popup_types';
import { showPopup, deleteUnitDescription, deleteUnitTable, openBigImage } from '../../actions/actions';
import { DateFormatter } from '../../libs/date_formatter';

/**
  Component for unit information window 
*/
class UnitInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {staticDescriptionContent: '',dynamicDescriptionContent: ''};
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){

        var dynamicTable = props.dynamicTable ? props.dynamicTable :
            props.unit.getTimeObjectFieldContainsDate('dynamicTable', props.currentDate);
        var dynamicDescription = props.dynamicDescription ? props.dynamicDescription :
            props.unit.getTimeObjectFieldContainsDate('dynamicDescription', props.currentDate);

        this.setState({
            unit:this.props.unit,
            staticTable: this.props.unit.getField('staticTable'),
            dynamicTable : dynamicTable,
            formatter: new DateFormatter(props.labels, props.lang, props.time.getCalendar().getMode())
 
        });
        this.setStaticArticle(this.props.unit);
        this.setDynamicArticle(dynamicDescription);
    }


    setStaticArticle(unit){
        var server = new Server;
        var articleId = unit.getField('article');
        var that = this;
        if(articleId){
            server.getArticleText(articleId, function(article){
                article = article.replace(/<br>/g, "\n");
                that.setState({staticDescription:articleId, staticDescriptionContent:article});
            });
        }
    }

    setDynamicArticle(dynamicDescription){
        var server = new Server;
        var articleId = dynamicDescription ? dynamicDescription.getValue() : null;
        var that = this;
        if(articleId){
            server.getArticleText(articleId, function(article){
                console.log("articleId",articleId,article)
                article = article ? article.replace(/<br>/g, "\n") : '';
                that.setState({dynamicDescription:dynamicDescription, dynamicDescriptionContent:article});
            });
        }
    }

    render() {
        var unit = this.state.unit;
        var isImageClickable = unit.getField('image') && unit.getField('image').indexOf('_min') !=-1;

        return <div>
           
            <div style={{'marginBottom':'1em'}}>
            
                {/*staticTable*/}
                {(this.state.staticTable || this.props.editMode) &&
                <div>
                    {this.props.editMode &&
                    <h3 className="popup_header">{ this.props.labels['Table'] }
                        <img src='/img/edit.png' alt={ this.props.labels['Edit table'] } onClick={()=>{this.props.editStaticTable()}}/>
                    </h3>
                    }
                    <UnitTable
                        parameters={this.state.staticTable ? this.state.staticTable : []}
                        labels={this.props.labels}
                    />
                </div>
                }
            
                {/*dynamicTable*/}
                { (this.state.dynamicTable && this.state.dynamicTable.getValue().length || this.props.editMode) &&
                    <div className="b-unit-popup-dt">
                        <DynamicLinks
                            unit = {this.state.unit}
                            timeObjectField ={this.state.dynamicTable}
                            editLabel = {this.props.labels['Edit current table']}
                            newLabel = {this.props.labels['New table']}
                            delLabel = {this.props.labels['Remove current table']}
                            backCallback={()=>{this.previousDynamicTable()}}
                            forwardCallback={()=>{this.nextDynamicTable()}}
                            editCallback={this.props.editDynamicTable}
                            newCallback={this.props.newDynamicTable}
                            deleteCallback={this.props.deleteDynamicTable}
                            editMode={this.props.editMode}
                            time={this.props.time}
                            labels={this.props.labels}
                            currentDate={this.props.currentDate}
                            header={this.props.editMode ? this.props.labels['Current table'] : ''}
                            formatter={this.state.formatter}
                        />
                        { (this.state.dynamicTable) &&
                            <UnitTable
                                parameters={this.state.dynamicTable.getValue()}
                                labels={this.props.labels}
                            />
                        }
                    </div>
                }

           
            </div>
            
            {/*image*/}
            { unit.getField('image') && !isImageClickable &&
                <img className="b-unit-popup__image" src={"/uploads/"+unit.getField('image')}/>
            }
            { unit.getField('image') && isImageClickable &&
               <img className="b-unit-popup__image_clickable" src={"/uploads/"+unit.getField('image')}
                onClick={() => this.openBigImage(unit.getField('image'))} />
            }
            
            {/*staticDescription*/}
            {(this.state.staticDescriptionContent || this.props.editMode) &&
            <div>
                {this.props.editMode &&
                <h3 className="popup_header">{ this.props.labels['Description'] }       
                    <img src='/img/edit.png' alt={ this.props.labels['Edit description']}  onClick={()=>{this.props.editStaticDescription()}}/>
                </h3>
                }
                <p>
                    {this.state.staticDescriptionContent.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br/></span>
                    })}
                </p>
            </div>
            }

            {/*dynamicDescription*/}
            { (this.state.dynamicDescriptionContent || this.props.editMode) &&
                <div className="b-unit-popup-dd">
                    <DynamicLinks
                        unit = {this.state.unit}
                        timeObjectField ={this.state.dynamicDescription}
                        editLabel = {this.props.labels['Edit current events']}
                        newLabel = {this.props.labels['New events']}
                        delLabel = {this.props.labels['Remove current events']}
                        labels={this.props.labels}
                        backCallback={()=>{this.previousDynamicDescription()}}
                        forwardCallback={()=>{this.nextDynamicDescription()}}
                        editCallback={this.props.editDynamicDescription}
                        newCallback={this.props.newDynamicDescription}
                        deleteCallback={this.props.deleteDynamicDescription}
                        editMode={this.props.editMode}
                        time={this.props.time}
                        currentDate={this.props.currentDate}
                        header={this.props.editMode ? this.props.labels['Current events'] : ''}
                        formatter={this.state.formatter}
                    />
                    {this.state.dynamicDescriptionContent &&
                        <p>
                        {this.state.dynamicDescriptionContent.split('\n').map((item, key) => {
                            return <span key={key}>{item}<br/></span>
                        })}
                        </p>
                    }
                </div>
            }

        </div>
    }

    nextDynamicTable(){
        var newDate = this.props.time.getCalendar().getNextDate(this.state.dynamicTable.getDateEnd());
        var newTimeObjectField =  this.state.unit.getTimeObjectFieldContainsDate(this.state.dynamicTable.getType(),newDate);
        this.setState({dynamicTable:newTimeObjectField});
    }

    previousDynamicTable(){
        var newDate = this.props.time.getCalendar().getPreviousDate(this.state.dynamicTable.getDateBegin());
        var newTimeObjectField =  this.state.unit.getTimeObjectFieldContainsDate(this.state.dynamicTable.getType(),newDate);
        this.setState({dynamicTable:newTimeObjectField});
    }

    nextDynamicDescription(){
        var newDate = this.props.time.getCalendar().getNextDate(this.state.dynamicDescription.getDateEnd());
        var newTimeObjectField =  this.state.unit.getTimeObjectFieldContainsDate(this.state.dynamicDescription.getType(),newDate);
        this.setState({dynamicDescription:newTimeObjectField});
        this.setDynamicArticle(newTimeObjectField);
    }

    previousDynamicDescription(){
        var newDate = this.props.time.getCalendar().getPreviousDate(this.state.dynamicDescription.getDateBegin());
        var newTimeObjectField =  this.state.unit.getTimeObjectFieldContainsDate(this.state.dynamicDescription.getType(),newDate);
        this.setState({dynamicDescription:newTimeObjectField});
        this.setDynamicArticle(newTimeObjectField);
    }
    
    openBigImage(bigImage){  
        this.props.openBigImage("/uploads/"+bigImage.replace('_min',''))
    }
}

class DynamicLinks extends React.Component {
    
    
    render() {
        console.log(this.props);

        var timeObjectField = this.props.timeObjectField;
        var unit = this.props.unit;
        var editMode = this.props.editMode;
        var time = this.props.time;
        var calendar = time.getCalendar();

        if(!timeObjectField){
            var datesLabel = this.props.formatter.getDateLabel(unit.getDateBegin())+"-"
                + this.props.formatter.getDateLabel(unit.getDateEnd());


            return editMode ?
             <h3 className="popup_header">{ this.props.header}
                 <span className="b-button popup-link">({datesLabel})</span>
                 <span className="b-button popup-link popup-link-span"></span>
                 <img src="/img/edit.png" className="b-button popup-link" onClick={()=>this.props.editCallback(timeObjectField)} alt={this.props.editLabel+'(' + datesLabel + ")"} />
            </h3> : <span />
        }

        var datesLabel = this.props.formatter.getDateLabel(timeObjectField.getDateBegin()) +
            (calendar.nE(timeObjectField.getDateBegin(), timeObjectField.getDateEnd()) ?
                ("-" + this.props.formatter.getDateLabel(timeObjectField.getDateEnd())) : "");

        var datesLabelForNewField = this.props.formatter.getDateLabel(this.props.currentDate)+"-"+
            this.props.formatter.getDateLabel(timeObjectField.getDateEnd());

        return <h3 className="popup_header">{ this.props.header}&nbsp;
            {calendar.nE(unit.getDateBegin(), timeObjectField.getDateBegin()) &&
            <img src="/img/new/navig_left.png" className="b-button popup-link popup-nav-button " onClick={() => this.props.backCallback()}
                 alt={this.props.labels['Back']}/>
            }
            <span className="b-button popup-link">{datesLabel}</span>
        
            {calendar.nE(unit.getDateEnd(), timeObjectField.getDateEnd()) &&
            <img src="/img/new/navig_right.png" className="b-button popup-link popup-nav-button " onClick={() => this.props.forwardCallback()}
                 alt={this.props.labels['Forward']}/>
            }
            {editMode &&
                <span className="b-button popup-link popup-link-span"></span>
            }
            {editMode &&
                <img src="/img/edit.png" className="b-button popup-link" onClick={()=>this.props.editCallback(timeObjectField)} alt={this.props.editLabel+'(' + datesLabel + ")"} />
            }
            {editMode && calendar.gT(this.props.currentDate,timeObjectField.getDateBegin()) &&
              calendar.lE(this.props.currentDate,timeObjectField.getDateEnd()) &&
                <img src="/img/plus_small_arrow.png" className="b-button popup-link" onClick={()=>this.props.newCallback()} alt={this.props.newLabel+'(' + datesLabelForNewField + ")"} />
            }
            {editMode && calendar.nE(unit.getDateBegin(),timeObjectField.getDateBegin()) &&
                <img src="/img/del.png" className="b-button popup-link" onClick={()=>this.props.deleteCallback(timeObjectField)} alt={this.props.delLabel} />
            }
        </h3>
    }
}

export default connect((state, ownProps) => {
    console.log(state, ownProps);
        var unit = ownProps.time.getTimeObjectById(ownProps.unit.getId());
        return {
            unit: unit,
            currentDate: state.currentDate,
            time: state.time,
            labels: state.labels,
            lang: state.lang,
            editMode: state.editMode,
        }},
    (dispatch, ownProps) => {
        var unit = ownProps.time.getTimeObjectById(ownProps.unit.getId());
        
        return {
            editStaticDescription: () => {
                dispatch(showPopup(popup_types.UNIT_DESCRIPTION, {
                    unit: unit,
                    isStatic: true,
                }));
            },
            editDynamicDescription: (dynamicDescription) => {
                dispatch(showPopup(popup_types.UNIT_DESCRIPTION, {
                    unit: unit,
                    isStatic: false,
                    isNew: false,
                    dynamicDescription: dynamicDescription,
                }));
            },
            newDynamicDescription: () => {
                dispatch(showPopup(popup_types.UNIT_DESCRIPTION, {
                    unit: unit,
                    isStatic: false,
                    isNew: true,
                }));
            },
            deleteDynamicDescription: (dynamicDescription) => {
                dispatch(deleteUnitDescription(unit.getId(), dynamicDescription.getId()));
            },
            editStaticTable: () => {
                dispatch(showPopup(popup_types.UNIT_TABLE, {
                    unit: unit,
                    isStatic: true,
                }));
            },
            editDynamicTable: (dynamicTable) => {
                dispatch(showPopup(popup_types.UNIT_TABLE, {
                    unit: unit,
                    isStatic: false,
                    isNew: false,
                    dynamicTable: dynamicTable,
                }));
            },
            newDynamicTable: () => {
                dispatch(showPopup(popup_types.UNIT_TABLE, {
                    unit: unit,
                    isStatic: false,
                    isNew: true,
                }));
            },
            deleteDynamicTable: (dynamicTable) => {
                dispatch(deleteUnitTable(unit.getId(), dynamicTable.getId()));
            },
            openBigImage: (bigImage) => {
                dispatch(openBigImage(bigImage));
            }
          }
    }
)(UnitInfo);
