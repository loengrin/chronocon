/**
 * Events navigation panel
 * @constructor
 * @this {EventsNavigation}
 */
var React = require('react');
import { connect } from 'react-redux'
import { rewindToEvent } from '../../actions/actions'



class ChainList extends React.Component {
     
    render(){
        var that = this;
        var chainButtons = [];
        for(let i=0;i<this.props.chainList.length; i++){
            let chain = this.props.chainList[i];
            chainButtons.push(
                     <div><button className='chain-button'
                     onClick={()=>this.props.moveToChain(chain.events[0], chain.chainId)}
                                     key={i}   
                    >{chain.title}</button></div>);
        }
        return <div>
                 {chainButtons}
            </div>
        }
    
}



export default connect((state, ownProps) => ({
        labels: ownProps.labels,
        chainList: state.time.getIndexStore().getIndexByStories(),
    }),
    (dispatch, ownProps) => {
        return {
            moveToChain: (event, chainId) => {
                dispatch(rewindToEvent(event, chainId));
            },
        }
    }
)(ChainList);
