var React = require('react');
import { connect } from 'react-redux'
import { goToUnit } from '../../actions/actions';

/**
  Component for object list window
*/
class ObjectList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.prepareObjectList();
        this.countTotalProgress();
    }

    componentWillReceiveProps(newProps) {
        this.prepareObjectList();
        this.countTotalProgress();
    }

    countTotalProgress(){
        var objectTypes = {'city':1,'army':1,'region':1,'line':1};

        var totalObjects = 0;
        var totalProgress = 0;
        for(var type in objectTypes){
            var objects = this.props.time.getObjectsOfType(type);

            for(var i=0;i<objects.length;i++){
                totalObjects +=1;
                totalProgress += objects[i].getField('progress') ? parseInt(objects[i].getField('progress')) : 0;
            }
        }
        totalProgress = totalProgress/totalObjects;
        this.setState({totalObjects:totalObjects, totalProgress:totalProgress });
    }

    prepareObjectList(search){
        var objectTypes = {'city':1,'army':1,'region':1,'line':1};
        var objectsByTypes = {};

        for(var type in objectTypes){
            var objects = this.props.time.getObjectsOfType(type);
            if(!objectsByTypes[type]) objectsByTypes[type] = [];

            for(var i=0;i<objects.length;i++){
                if(!search || objects[i].getField('name').toLowerCase().indexOf(search.toLowerCase()) != -1){
                    objectsByTypes[type].push(objects[i]);
                }
            }
            objectsByTypes[type].sort(
                function(a, b) {
                    return a.getField('name').trim() > b.getField('name').trim() ? 1 : (a.getField('name').trim() == b.getField('name').trim() ? 0 : -1);
                }
            );

            if(!objectsByTypes[type].length) {
                delete objectsByTypes[type];
            }
        }
        this.setState({objectsByTypes:objectsByTypes});
    }


    render() {
        var typeNames = {
            'city':this.props.labels['Fixed units'],
            'region':this.props.labels['Regions'],
            'line':this.props.labels['Lines'],
            'army':this.props.labels['Movable units']
        };

        var typeBlocks = [];
        for(var objectsType in this.state.objectsByTypes){
            var objectsArray = this.state.objectsByTypes[objectsType];
            var objectRows = [];

            console.log(objectsType, objectsArray);
            for(var i=0; i < objectsArray.length; i++){
                let chronomapObject = objectsArray[i];
                objectRows.push( <tr key={i}>
                    <td className='t-objects-list-table-object-name'>
                        <span className='b-objects_popup__title' onClick={()=>{this.props.goToUnit(chronomapObject)}}>
                            { chronomapObject.getField('name') }
                        </span>
	                </td>
	                <td>
                        <div style={{
                            display: 'inline-block', height: '1em',
                            width: chronomapObject.getField('progress')/100*5+'em',
                            backgroundColor: chronomapObject.getField('progress') > 60 ? 'green' : (chronomapObject.getField('progress') > 20 ? 'yellow' : 'red')
                        }}>
                        </div>
                        <span>{ chronomapObject.getField('progress') ? chronomapObject.getField('progress') : 0 }%</span>
	                </td>
	                <td style={{color:'red',paddingLeft:'1em','border':'none' }}>{ chronomapObject.getField('needHelp') ? this.props.labels['Need help'] : '' }</td>
                 </tr>);

                if(chronomapObject.getField('comments')){
                    objectRows.push( <tr key={'comment_'+chronomapObject.getId()}>
                        <td colSpan="3"><span className='comments_text'>
                            {this.props.labels['Comments'] }: { chronomapObject.getField('comments') }
                        </span></td>
                    </tr>)
                }
            }

            typeBlocks.push(<div key={'block_'+objectsType}>
                <h3>{ typeNames[objectsType] } ({ objectsArray.length }):</h3>
                <table><tbody>
                {objectRows}
                </tbody></table>

            </div>);
        }

        return <div className='b-objects-popup'>
            <input className='b-object-search'
                   placeholder={this.props.labels['Enter object name']}
                   onChange={(e)=>{this.prepareObjectList(e.target.value)}}
            /><br />
                <div className='b-objects-list'>
                    <br /><span>{this.props.labels['Total object count'] }: { this.state.totalObjects }</span>,
                    <span>{this.props.labels['Object progress']}: {  this.state.totalProgress.toFixed(2) } %</span><br />
                    {typeBlocks}
                </div>
        </div>

    }

}

export default connect((state, ownProps) => ({
        labels: state.labels,
        time: state.time,
     }),
    (dispatch, ownProps) => {
        return {
            goToUnit: (unit) => {
                dispatch(goToUnit(unit));
            }
        }
    }

)(ObjectList);