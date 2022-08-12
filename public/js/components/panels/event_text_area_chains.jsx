var React = require('react');
import { connect } from 'react-redux'
import { rewindToEvent, showChain} from '../../actions/actions'

class ChainsBlock extends React.Component {
    render() {
        var index = this.props.time.getIndexStore().getIndexByStories();
        var chainBlocks = [];
        for(let i=0;i<index.length; i++){
            let chain = index[i];
           
            //this.props.showChain(chain.chainId)}
            //this.props.rewindToEvent(chain.events[0], chain.chainId)
             chainBlocks.push(
                     <span className="b-textpanel-article__chains" key = {i} onClick={()=>{this.props.showChain(chain.chainId)}}>
                        {(i+1)+". "}{this.props.hasChainsMode ? index[i].title : this.props.time.getTimeObjectById('MAIN').getField('name')}
                     </span>);
        }
        return <div className="b-textpanel-article-content">
            {chainBlocks}
        </div>
    }
}

export default connect((state, ownProps) => {
        return {
            labels: state.labels,
            chain: ownProps.chain,
            time: state.time,
            hasChainsMode:  state.time.getIndexStore().hasChainsMode()
            
        }},
    (dispatch, ownProps) => {
        return {
            rewindToEvent: (event, chainId) => {
                dispatch(rewindToEvent(event, chainId))
            },
            showChain: (chainId) => {
                 dispatch(showChain(chainId))
            },
           }
    }
)(ChainsBlock);


