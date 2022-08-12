var React = require('react');
import { connect } from 'react-redux'
import { rewindToEvent, showPopup, deleteEvent} from '../../actions/actions'
import { DateFormatter } from '../../libs/date_formatter';
import Server from '../../server/server.js';
import * as popup_types from '../../actions/popup_types';

class EventBlock extends React.Component {
    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){
        
        var that = this;
          
        if(!props.event){
            that.setState({title: '', text:'', showMore: '', chain: ''});
            return;
        };

        that.setState({title: props.event.getField('name')});
        if(props.event.getField('description')){
            var showMore = props.event.getField('article') ? true : false;
            that.setState({text: props.event.getField('description'), showMore:showMore});
        }
        else {
            var server = new Server;
            server.getArticleText(props.event.getField('article'), function (article) {
                article = article ? article.replace(/<br>/g, "\n") : "";
                that.setState({text: article, showMore:false});
            });
        }
        
        var allChains = this.props.time.getIndexStore().getAllChains();
        var chainNames = [];
        if(props.currentChain) {
            if(this.props.hasChainsMode) {
                chainNames.push(allChains[props.currentChain].name);
            }
            var indexStore = props.time.getIndexStore();
            that.setState({
                countInChain:  indexStore.getEventsOfChain(props.currentChain).length,
                currentNumber: indexStore.getEventPosition(props.event.getId(), props.currentChain)
            });
        }
        else {
            var eventChains = props.event.getField('eventChains') ?  props.event.getField('eventChains') : [];
            for(var eventChain in eventChains) {
                chainNames.push(allChains[eventChain].name);
            }
        }
        that.setState({chains: chainNames});
    }
    
    render() {
        var text = this.state.text;
        var moreLink = '';
        
        if(this.state.showMore) {
            moreLink = <a className="b-more-button" href="#"
                          onClick={() => this.props.showPopup(this.props.event)}>
                {this.props.labels['More'] + "..."}
                </a>;
        }

        return <div className="b-textpanel-article-content">

            <span className="b-textpanel-article__title">
                {this.state.title}
            </span>
            {this.props.editMode && this.props.event &&
                <span className="b-artiсle__edit-buttons">
                    <button className="b-button_edit b-button" onClick={() => this.props.editEvent(this.props.event)}></button>
                    <button className="b-button_del b-button" onClick={() => this.deleteEvent(this.props.event)}></button>
                </span>
            }

            <div className="b-textpanel-article__text-container">
                   { text ? text.split('\n').map((item, key) => {
                        return <p className="b-textpanel-article__text" key={key}>{item}</p>
                   }) : ''}
                   {moreLink}
            </div>

        </div>
    }
    
     deleteEvent(event){
        if(confirm(this.props.labels['Delete event']+"?")) {
            this.props.deleteEvent(event);
        }
    }
}

export default connect((state, ownProps) => {
        return {
            event: state.currentEvent,
            currentStep: state.currentStep,
            currentDate: state.currentDate,
            currentChain: state.currentChain,
            listShowed: state.listShowed,
            mapLoaded: state.mapLoaded,
            editMode: state.editMode,
            indexMode: state.indexMode,
            labels: state.labels,
            lang: state.lang,
            time: state.time,
            hasChainsMode:  state.time.getIndexStore().hasChainsMode()

        }},
    (dispatch, ownProps) => {
        return {
            showPopup: (event) => {
                dispatch(showPopup(popup_types.EVENT_INFO,{event:event}));
            },
            editEvent: (event) => {
                dispatch(showPopup(popup_types.EDIT_EVENT, {event: event, isNew: false}));
            },
            deleteEvent: (event) => {
                dispatch(deleteEvent(event));
            },
            rewindToEvent: (event, chainId) => {
                dispatch(rewindToEvent(event, chainId))
            },
        }
    }
)(EventBlock);


