var $ = require("jquery");
var React = require('react');
import { deleteMap } from '../../actions/actions';
import { connect } from 'react-redux'

/**
  Component for list of maps created by current user
*/
class MyMaps extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({'chronomaps': this.props.chronomaps});
    }

    componentWillReceiveProps(newProps){
        this.setState({'chronomaps': newProps.chronomaps});
    }

    deleteMap(i, chronomapId){
        if (confirm(this.props.labels['Delete chronomap']+"?")) {
            var chronomaps = this.state.chronomaps;
            chronomaps.splice(i,1);
            this.setState({'chronomaps': chronomaps});
            this.props.deleteMap(chronomapId);
        }
    }

    render() {
        var chronomapBlocks = [];
        for(let i=0;i<this.props.chronomaps.length; i++){
            let chronomap = this.props.chronomaps[i];
            chronomapBlocks.push(<div key={i}>
                 <div className="b-chronomap-block">
                    <a href={'/'+chronomap.lang+'/map/id/'+chronomap.id}><span>{chronomap.name }</span></a><br />
              
                     <a href={'/'+chronomap.lang+'/map/id/'+chronomap.id}><img src={"/uploads/"+chronomap.image}/></a>
                     <p>{ chronomap.description }</p>
                     <a className="link-del" onClick={()=>{this.deleteMap(i, chronomap.id)}} >{this.props.labels['Delete chronomap']}</a>
                 </div>
            </div>);
        }

        return <div>
                {chronomapBlocks}
        </div>;
    }
}

export default connect((state, ownProps) => ({}),
    (dispatch, ownProps) => {
        return {
            deleteMap: (mapId) => {
                dispatch(deleteMap(mapId))
            }
        }
    }

)(MyMaps);