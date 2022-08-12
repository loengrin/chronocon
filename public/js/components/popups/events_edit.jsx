/**
 * Events navigation panel
 * @constructor
 * @this {EventsNavigation}
 */
var React = require('react');
import { connect } from 'react-redux'
import { moveEventUp, moveEventDown, deleteEvent, moveChainUp, moveChainDown, deleteChain, showPopup } from '../../actions/actions'
import * as popup_types from '../../actions/popup_types';
import { DateFormatter } from '../../libs/date_formatter';


/**
  Component for events list window
*/
class EventsEditPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {indexMode:'chains'};
    }

    componentWillMount() {
        this.setStateByProps(this.props);
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    setStateByProps(props) {
        var indexStore = props.time.getIndexStore();
        var dateIndex = indexStore.getIndexByDates();
        var chainIndex = indexStore.getIndexByStories();
        var chainList = indexStore.getChainList();

        this.setState({
            dateIndex: dateIndex,
            chainIndex: chainIndex,
            chainList: chainList,
        });
    }

    render(){
        var datesClass  = this.state.indexMode == 'dates' ? 'active-index-mode' : '';
        var chainsClass = this.state.indexMode == 'chains' ? 'active-index-mode' : '';
        var index = this.state.indexMode == 'chains' ? this.state.chainIndex : this.state.dateIndex;

        return <div>
            <div>
                <a href="#" className={`index-mode-button ${ chainsClass }`}
                   onClick={this.indexByStories.bind(this)}>{this.props.labels['By stories']}</a>
                <span> | </span>
                <a href="#" className={`index-mode-button ${ datesClass }`}
                   onClick={this.indexByDates.bind(this)}>{this.props.labels['By dates']}</a>
            </div>

            {this.state.indexMode == 'chains' &&
                <ChainList
                    chainList={this.state.chainList}
                    labels={this.props.labels}
                    moveChainUp = {this.props.moveChainUp}
                    moveChainDown = {this.props.moveChainDown}
                    deleteChain = {this.props.deleteChain}
                    editChain = {this.props.editChain}
                />
            }

            <EventEditTables
                index={index}
                labels={this.props.labels}
                time={this.props.time}
                indexMode={this.state.indexMode}
                moveEventUp = {this.props.moveEventUp}
                moveEventDown = {this.props.moveEventDown}
                deleteEvent = {this.props.deleteEvent}
                editEvent = {this.props.editEvent}
            />
            <a href="#" className="b-add-link"  onClick={() => this.props.editEvent(null, true, this.state.indexMode)}>{ this.props.labels['Add event'] }</a>

        </div>
    }
    indexByStories(){
        this.setState({indexMode:'chains'});
    }

    indexByDates(){
        this.setState({indexMode:'dates'});
    }
   }



class EventEditTables extends React.Component {
    constructor(props) {
        super(props);
        this.state =  { /* initial state */ };
    }

    render() {
        var that = this;
        return <div>
            {this.props.index.map(function (block, i) {
                return <EventIndexBlock
                    time={that.props.time}
                    labels={that.props.labels}
                    eventBlock={block}
                    key={i}
                    indexMode={that.props.indexMode}
                    moveEventUp = {that.props.moveEventUp}
                    moveEventDown = {that.props.moveEventDown}
                    deleteEvent = {that.props.deleteEvent}
                    editEvent = {that.props.editEvent}
                />;
            })}
        </div>
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

        return <div>
            <h3 className="index-header">{block.title}</h3>
            <table className="index-block">
                <tbody>
                    {block.events.map(function(event, i){
                        return <EventIndexRow
                            time={that.props.time}
                            labels={that.props.labels}
                            event={event}
                            key={i}
                            chainId={block.chainId}
                            indexMode={that.props.indexMode}
                            num={i+1}
                            moveEventUp = {that.props.moveEventUp}
                            moveEventDown = {that.props.moveEventDown}
                            deleteEvent = {that.props.deleteEvent}
                            editEvent = {that.props.editEvent}
                        />;
                    })}
                </tbody>
            </table>
        </div>
    }
}


class EventIndexRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var rows = [];
        var indexStore = this.props.time.getIndexStore();
        var canBeMovedUp = indexStore.canBeMovedUp(this.props.event, this.props.chainId, this.props.indexMode);
        var canBeMovedDown = indexStore.canBeMovedDown(this.props.event, this.props.chainId, this.props.indexMode);

        var groupLabel;

        if(this.props.indexMode == 'dates'){
            var chains = this.props.time.getTimeObjectById('MAIN').getField('eventChains');
            var eventChains = this.props.event.getField('eventChains');
            var eventChainsIds = eventChains ? Object.keys(eventChains) : [];
            var chainLabels = [];
            for(var i=0;i<eventChainsIds.length; i++){
                var chainId = eventChainsIds[i];
                chainLabels.push(chains[chainId].name);
            }
            groupLabel = chainLabels.join(", ");
        }
        else{
            var formatter = new DateFormatter(this.props.labels, this.props.lang, this.props.time.getCalendar().getMode());
            groupLabel = formatter.getDateLabel(this.props.event.getDateBegin());
        }
        rows.push(<td key='name' className="td-event-name"> {this.props.num+". "+this.props.event.getField('name')}</td>);
        rows.push(<td key='date' className="td-event-date">{groupLabel}</td>);
        rows.push(canBeMovedUp ?
            <td key='up'>
                <button className="b-textpanel__button-up b-button"
                        onClick={()=>{this.props.moveEventUp(this.props.event, this.props.chainId, this.props.indexMode)}} />
            </td> :
            <td key='up'></td>);
        rows.push(canBeMovedDown ?
            <td key='down'>
                <button className="b-textpanel__button-down b-button"
                        onClick={()=>{this.props.moveEventDown(this.props.event, this.props.chainId, this.props.indexMode)}}/>
            </td> :
            <td key='down'></td>);
        rows.push(<td key='edit'>
            <button className="b-button_edit b-button" onClick={() => this.editEvent()} /></td>);
        rows.push(<td key='del'>
            <button className="b-button_del b-button"  onClick={()=>{this.deleteEvent()}}/></td>);

        return <tr>
            {rows}
        </tr>
    }


    editEvent() {
        this.props.editEvent(this.props.event, false, this.props.indexMode)
    }

    deleteEvent() {
        if(confirm(this.props.labels['Delete event']+"?")) {
            this.props.deleteEvent(this.props.event)
        }
    }
}


class ChainList extends React.Component {
    render(){
        var that = this;
        return <div>
            <h3 className="index-header">{ this.props.labels['Event chains'] }</h3>
            <table className="index-block">
                <tbody>
                {this.props.chainList.map(function(chain, i){
                    var canBeMovedUp = i != 0;
                    var canBeMovedDown = i != that.props.chainList.length-1;
                    return <ChainRow chain={chain}
                                     key={i}
                                     canBeMovedUp={canBeMovedUp}
                                     canBeMovedDown={canBeMovedDown}
                                     moveChainUp = {that.props.moveChainUp}
                                     moveChainDown = {that.props.moveChainDown}
                                     deleteChain = {that.props.deleteChain}
                                     editChain = {that.props.editChain}
                    />;
                })}
                </tbody>
            </table>
            <a href="#" className="b-add-link"
               onClick={() => this.props.editChain(null, true)}>{this.props.labels['Add event chain']}</a>
        </div>
    }
}

class ChainRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var rows = [];
        rows.push(<td key='name' className="td-event-name">{this.props.chain.name}</td>);
        rows.push(this.props.canBeMovedUp ?
            <td key='up'>
                <button className="b-textpanel__button-up b-button"
                        onClick={()=>{this.props.moveChainUp(this.props.chain.id)}}/>
            </td> :
            <td key='up'></td>);
        rows.push(this.props.canBeMovedDown ?
            <td key='down'>
                <button className="b-textpanel__button-down b-button"
                                   onClick={()=>{this.props.moveChainDown(this.props.chain.id)}}/>
            </td> :
            <td key='down'></td>);
        rows.push(<td key='edit'>
            <button className="b-button_edit b-button"
                    onClick={()=>{this.props.editChain(this.props.chain)}}/>
        </td>);
        rows.push(<td key='del'>
            <button className="b-button_del b-button"
                    onClick={()=>{this.props.deleteChain(this.props.chain.id)}}/>
        </td>);

        return <tr>
            {rows}
        </tr>
    }
}

export default connect((state, ownProps) => ({
        labels: ownProps.labels,
        time: ownProps.time,
        indexMode: ownProps.indexMode,
    }),
    (dispatch, ownProps) => {
        return {
            moveEventUp: (event, chainId, indexMode) => {
                dispatch(moveEventUp(event, chainId, indexMode));
            },
            moveEventDown: (event, chainId, indexMode) => {
                dispatch(moveEventDown(event, chainId, indexMode));
            },
            deleteEvent: (event) => {
                dispatch(deleteEvent(event));
            },
            editEvent: (event, isNew, indexMode) => {
                dispatch(showPopup(popup_types.EDIT_EVENT, {event: event, isNew: isNew, indexMode: indexMode}));
            },
            moveChainUp: (chainId) => {
                dispatch(moveChainUp(chainId));
            },
            moveChainDown: (chainId) => {
                dispatch(moveChainDown(chainId));
            },
            deleteChain: (chainId) => {
                dispatch(deleteChain(chainId));
            },
            editChain: (chain, isNew) => {
                dispatch(showPopup(popup_types.EDIT_CHAIN, {chain: chain, isNew: isNew}));
            },

        }
    }
)(EventsEditPopup);
