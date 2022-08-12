var React = require('react');
import Server from '../../server/server.js';
import { connect } from 'react-redux'
import { initMap, hidePopup } from '../../actions/actions'

/**
  Component for map change history window
*/
class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showReloadButton:false, openedDescriptions:[], openedUsers:[], versions:[]};
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){
        var server = new Server;
        var that = this;
        server.loadChronomapVersions(props.mapId, function(versions) {
            that.setState({versions:versions})
        });
    }


    render() {

        var rows = [];
        for(let i=0;i<this.state.versions.length; i++){
            let version = this.state.versions[i];
            rows.push(  <tr key={i}>
                <td className="b-versions__version-cell">{this.props.labels['Version'] } #{version.version }</td>
                <td className="b-versions__version-cell">{version.created_at.substring(0,16) }</td>
                <td className="b-versions__version-cell">
                    <a className="b-link js-commit-user" onClick={()=>{this.toggleUser(version.version, version.login)}}>{ version.login }</a>
                    <span dangerouslySetInnerHTML={{__html:this.state.openedUsers[version.version]}} />
                </td>
                <td className="b-versions__version-cell"><a className="b-link js-comment"
                                                            onClick={()=>{this.toggleDescr(version.version)}}>
                    {this.props.labels['Comment'] }</a>
                </td>
                <td className="b-versions__version-cell">
                    <a className="b-button"
                            onClick={()=>{this.loadMap(version.version)}}>
                        {this.props.labels['Load'] }
                        </a>
                </td>
                <td className="b-versions__version-cell">
                    { i==0 && version.version != 1 && this.props.isOwner &&
                        <button className="b-button_del b-button b-del-last-version"
                                title={this.props.labels['Delete last version']}
                                onClick={()=>{this.deleteLastVersion()}}
                        ></button>
                    }
                </td>
            </tr>);

            if(this.state.openedDescriptions[version.version]){
                rows.push(<tr key={'descr_'+i}>
                        <td className="b-versions__version-cell" colSpan="6"
                          dangerouslySetInnerHTML={{ __html:(version.user_description ? version.user_description+"<br>" : "")+version.description.replace(/^\n/g, "").replace(/\n/g, "<br>")}} />
                </tr>);
            }
        }

        return <div>
            {this.state.showReloadButton &&
                <div><button className="b-button b-reload-button" onClick={()=>{this.reloadMap()}}>
                    {this.props.labels['Reload page']}</button>
                </div>
            }
            <table className="b-versions">
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    }

    toggleDescr(version){
        var openedDescriptions = this.state.openedDescriptions;
        if(openedDescriptions[version]){
            delete openedDescriptions[version];
        }
        else{
            openedDescriptions[version] = true;
        }
        this.setState({openedDescriptions: openedDescriptions});
    }

    toggleUser(version, login){
        var openedUsers = this.state.openedUsers;
        var that = this;
        if(openedUsers[version]){
            delete openedUsers[version];
            this.setState({openedUsers: openedUsers});
        }
        else{
            var server = new Server;
            server.loadUserData(login, function(userData){
                openedUsers[version] = "<br>"+(userData.name ? userData.name+"<br>" : '')+
                    (userData.email ? userData.email+"<br>" : '')+userData.about;
                that.setState({openedUsers: openedUsers});
            });
        }
    }

    reloadMap(){
        this.props.initMap(this.props.mapId, this.props.mapVersion-1);
    }


    loadMap(version){
        this.props.initMap(this.props.mapId, version);
    }

    deleteLastVersion(){
        var that = this;
        if (confirm(this.props.labels['Delete last version']+"?")) {
            var server = new Server;
            server.deleteLastVersions(that.props.mapId, function(){
                that.setState({showReloadButton: true});
            });
        }
    }
}

export default connect((state, ownProps) => ({
        labels: state.labels,
        mapId: state.mapId,
        mapVersion: state.mapVersion,
        isOwner: state.mapRights === 'owner',
    }),
    (dispatch, ownProps) => {
        return {
            initMap: (mapId, mapVersion) => {
                dispatch(initMap(mapId, mapVersion));
                dispatch(hidePopup());
            },
        }
    }
)(History);