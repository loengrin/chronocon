import Select from '../custom_tags/select.jsx';

var React = require('react');
import Server from '../../server/server.js';
import { connect } from 'react-redux'
import { importUnits } from '../../actions/actions'

/**
  Component for objects import window
*/
class Import extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({selectedObjects:[], maps:[], objectsByTypes: {}, isLoading:false});
        this.setMapList(this.props);
    }

    componentWillReceiveProps(newProps){
        this.setState({selectedObjects:[], maps:[], objectsByTypes: {}});
        this.setMapList(newProps);
    }

    setMapList(props) {
        var that = this;
        var server = new Server;
        server.loadPublishedMaps(props.lang, function(chronomaps){
            var chronomapOptions = {'0':''};
            for(var i=0; i < chronomaps.length; i++){
                chronomapOptions[chronomaps[i].id]= chronomaps[i].name;
            }
            that.setState({maps:chronomapOptions, selectedMap:0});
        });
    }

    showObjects(){
        if(!this.state.selectedMap) return;
        var that = this;
        var server = new Server;
        that.setState({isLoading:true});
        server.loadChronomapObjects(this.state.selectedMap, function(objects){
            console.log(objects)
            var objectsByTypes = {};
            for(var type in objects){
                if(type !== 'city' && type !== 'region' && type !== 'line') continue;
                if(!objectsByTypes[type]) objectsByTypes[type] = [];

                for(var i=0; i<objects[type].length; i++){
                    var object = objects[type][i];
                    objectsByTypes[type].push({id:object.timeObjectId,'name':object.value.name});
                }
                objectsByTypes[type].sort(function(obj1, obj2){
                    return obj1.name > obj2.name ? 1: -1;
                });
            }
            that.setState({objectsByTypes:objectsByTypes});
            that.setState({isLoading:false});
        });
    }

    selectObject(objectId, checked){
        var selectedObjects = this.state.selectedObjects;
        if(checked){
            selectedObjects.push(objectId);
        }
        else{
            selectedObjects.splice(selectedObjects.indexOf(objectId),1);
        }
        this.setState({selectedObjects: selectedObjects});
    }

    addObjects(){
        this.props.importUnits(this.state.selectedMap, this.state.selectedObjects);
    }

    render() {

        var typeNames = {
            'city':this.props.labels['Fixed object'],
            'region':this.props.labels['Regions'],
            'line':this.props.labels['Lines']
        };

        var typeBlocks = [];
        for(let objectsType in this.state.objectsByTypes){
            let objectsArray = this.state.objectsByTypes[objectsType];
            var objectBlocks = [];
            for(let i=0; i<objectsArray.length; i++){
                let chronomapObject = objectsArray[i];
                objectBlocks.push(<div key={chronomapObject.id}>
                        <label><input type="checkbox" onChange={(e)=>{this.selectObject(chronomapObject.id, e.target.checked)}}/>{ chronomapObject.name }</label>
                </div>);
            }

            typeBlocks.push(<div key={objectsType}>
                <h3>{typeNames[objectsType]}</h3>
                {objectBlocks}
            </div>);
        }

        return <div className="b-import-block">
            <div>
                <span className='b-chronomaps-select'>
                    <Select options={this.state.maps}
                            selectedOption={this.state.selectedMap}
                            callback={(mapId)=>{console.log(mapId);this.setState({selectedMap:mapId})}}
                    />
                </span>
                <span className="b-button" onClick={()=>{this.showObjects()}}>{this.props.labels['Show']}</span>
                 {this.state.isLoading && 
                    <span>{this.props.labels['Loading...']}</span>
                 }
            </div><br />
            <div className='b-chronomaps-objects'>
                {typeBlocks}
                {Object.keys(this.state.objectsByTypes).length > 0 &&
                    <span className="b-button b-save-button"
                          onClick={()=>{this.addObjects()}}>{this.props.labels['Add']}</span>
                }
            </div>
        </div>
    }
}

export default connect((state, ownProps) => ({
        labels: state.labels,
        lang: state.lang,
    }),
    (dispatch, ownProps) => {
        return {
            importUnits: (mapId, units) => {
                console.log(mapId, units);
                dispatch(importUnits(mapId, units));
            },

        }
    }
)(Import);
