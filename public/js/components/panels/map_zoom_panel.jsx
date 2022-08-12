var React = require('react');
import { connect } from 'react-redux'
import { setMapZoom } from '../../actions/actions';


/**
  Component for search panel, it became visible when user clicks on seach button iin edit mode panel.
*/
class MapZoomBlock extends React.Component {
    constructor(props) {
        super(props);
    }

   
    render() {
        return <div className="b-zoom-block">
            <div className="b-zoom-plus" onClick={()=>{this.props.setMapZoom(this.props.mapState.mapZoom+1)}}></div>
            <div className="b-zoom-minus" onClick={()=>{this.props.setMapZoom(this.props.mapState.mapZoom-1)}}></div>
        </div>
    }
}

export default connect((state, ownProps) => ({
        labels: state.labels,
        mapState: state.mapState,
    }),
    (dispatch, ownProps) => {
        return {
            setMapZoom: (mapZoom) => {
                dispatch(setMapZoom(mapZoom));
            },
        }
    }
)(MapZoomBlock);