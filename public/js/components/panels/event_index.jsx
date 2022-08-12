var React = require('react');
import { connect } from 'react-redux'
import {rewindToEvent } from '../../actions/actions'
import { Scrollbars } from 'react-custom-scrollbars';
var $ = require("jquery");

/**
Component for list of events in the left bottom corner of map page.
*/
class EventIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate() {
       if($('.selected-article').length) {
           var top = $('.selected-article')[0].offsetTop-30;
           this.refs.scrollbars.scrollTop(top);
       }
    }

    render(){

        var that = this;
        var rewindToEvent = this.props.rewindToEvent;
        return <Scrollbars style={{height: '100%' }} values={{'top':100}} ref="scrollbars"
                                renderTrackHorizontal = { ()=><div className="track_g"></div> }
                                renderThumbHorizontal = { ()=><div className="thumb_g"></div> }
                                renderTrackVertical = { ()=><div className="track"></div> }
                                renderThumbVertical = { ()=><div className="thumb"></div> }
                                hideTracksWhenNotNeeded = {true}>
            <div className="b-textpanel-article">
                <div className="b-textpanel-article-content">
                    {this.props.index.map(function(block, i){
                        return <EventIndexBlock
                            eventBlock={block}
                            currentEvent={that.props.currentEvent}
                            currentChain={that.props.currentChain}
                            key={i}
                            rewindToEvent = {rewindToEvent}
                        />;
                    })}
                </div>
            </div>
        </Scrollbars>
    }
}

class EventIndexBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { /* initial state */ };
    }

    render(){
        var that = this;
        var block = this.props.eventBlock;
        if(!block.events) return null;
        var rewindToEvent = this.props.rewindToEvent;

        return <div>
            <span className="b-textpanel__index-date">{block.title}</span>
            {block.events.map(function(event, i){
                var isSelected = that.props.currentEvent && (event.getId() == that.props.currentEvent.getId()) &&
                    (!block.chainId || that.props.currentChain == block.chainId);
                return <EventIndexRow
                    event={event}
                    isSelected={isSelected}
                    key={i}
                    chainId={block.chainId}
                    num={i+1}
                    rewindToEvent = {rewindToEvent}
                />;
            })}
        </div>
    }
}


class EventIndexRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    render(){
        var selectedClass = this.props.isSelected ? 'selected-article' : '';
        var eventIdClass = 'index_event_'+this.props.event.getId();
        return <span className={'b-textpanel-article__title '+eventIdClass+' '+selectedClass} onClick={this.moveToEvent.bind(this)}>
                &#8226;{' '+this.props.event.getField('name')}
            </span>
    }

    moveToEvent(){
        this.props.rewindToEvent(this.props.event, this.props.chainId);
    }
}

export default connect((state, ownProps) => {
        var indexMode = state.indexMode;
        var index = indexMode == 'dates'?
            state.time.getIndexStore().getIndexByDates() :
            state.time.getIndexStore().getIndexByStories();
        return {
            currentEvent: state.currentEvent,
            currentChain: state.currentChain,
            index: index,
        }},
    (dispatch, ownProps) => {
        return {
            rewindToEvent: (event, chainId) => {
                dispatch(rewindToEvent(event, chainId))
            }
        }
    }
)(EventIndex);

