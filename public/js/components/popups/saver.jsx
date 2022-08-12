var React = require('react');
import { connect } from 'react-redux'
import { saveMap, createCopy } from '../../actions/save_actions'

/**
  Component for window which bacame visible when user click save button
*/
class Saver extends React.Component {
    constructor(props) {
        super(props);
    }

    ccomponentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){
        var message = "";
        if(this.props.saveAsMode){
            message += props.labels['Copy of chronomap']+" '"+props.time.getTimeObjectById('MAIN').getField('name')+
                "' "+props.labels['Version']+" #"+props.mapVersion+"\n";
        }

        var changedObjects = props.time.getChangedObjects();
        if(changedObjects.length){
            message += "\n"+this.props.labels['Changed']+":\n";
        }
        for(var i = 0; i < changedObjects.length;i++){
            message += "  "+(changedObjects[i].getId() === 'MAIN' ?  props.labels['Map settings'] : changedObjects[i].getField('name'))+"\n";
        }
        var newObjects = props.time.getNewObjects();
        if(newObjects.length){
            message += "\n"+this.props.labels['Added']+":\n";
        }
        for(var i = 0; i < newObjects.length;i++){
            message += "  "+newObjects[i].getField('name')+"\n";
        }
        var deletedObjects = props.time.getDeletedObjects();
        if(deletedObjects.length){
            message += "\n"+props.labels['Removed']+":\n";
        }
        for(var i = 0; i < deletedObjects.length;i++){
            message += "  "+deletedObjects[i].getField('name')+"\n";
        }

        var fields = {}
        fields.comment = message;
        fields.userComment = '';
        if(props.saveAsMode){
            var newName = props.time.getTimeObjectById('MAIN').getField('name')+"("+props.labels['copy']+")";
            fields.name = newName;
        }
        this.setState({fields: fields});
    }

    render() {

        return <div>
            {this.props.saveAsMode &&
                <div>
                    <input className='without-table' style={{width:'35em'}} value={ this.state.fields.name }
                    onChange={(e)=>{this.setField('name',e.target.value)}}/><br />
                </div>
            }
            {this.props.labels['Comment'] }:<br />
            <textarea className='without-table' rows="5" cols="60"  value={ this.state.fields.userComment }
                      onChange={(e)=>{this.setField('userComment',e.target.value)}}/><br /><br />
            <a className="b-button b-save-button" onClick={()=>{this.props.saveMap(this.state.fields)}}>
                {this.props.labels['Save'] }
            </a><br />
            <h3>{this.props.labels['Changes'] }:</h3>
            <textarea disabled="disabled" readOnly rows="15" cols="60" className='without-table' value={ this.state.fields.comment } />
        </div>
    }

    setField(fieldName, fieldValue) {
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields:fields});
    }

}

export default connect((state, ownProps) => ({
        labels: state.labels,
        time: state.time,
        mapVersion: state.mapVersion,
        saveAsMode: ownProps.saveAsMode,
    }),
    (dispatch, ownProps) => {
        return {
            saveMap: (fields) => {
                console.log(fields);
                if(ownProps.saveAsMode){
                    dispatch(createCopy(fields.comment, fields.userComment, fields.name));
                }
                else {
                    dispatch(saveMap(fields.comment, fields.userComment));
                }
            },
        }
    }
)(Saver);