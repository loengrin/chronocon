var React = require('react');
import { connect } from 'react-redux'
import { setIndexMode} from '../../actions/actions'

class IndexModeListBlock extends React.Component {
    render() {
        return <div className="b-textpanel-article-content">
            <span className="b-textpanel-article__index_mode"
                   onClick={()=>this.props.setIndexMode('chains')}> 
                   {this.props.labels['Events by storys']}   
           </span>
            <span className="b-textpanel-article__index_mode"
                   onClick={()=>this.props.setIndexMode('dates')}>
                   {this.props.labels['Events by dates']}    
           </span>
        </div>
    }
}

export default connect((state, ownProps) => {
        return {
            time: state.time,
            labels: state.labels,
        }},
    (dispatch, ownProps) => {
        return {
            setIndexMode: (indexMode) => {
                dispatch(setIndexMode(indexMode))
            },
        }
    }
)(IndexModeListBlock);


