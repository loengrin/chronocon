var React = require('react');
import Server from '../../server/server.js';
import ArmyImageSelector from './army_image_selector.jsx';

/**
 * Component for selection army or city icon. It is possible to upload custom icon 
 * or thoose one of the default
 */
class ImageBlock extends React.Component {

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){
        var that = this;
        this.setState({icon: props.icon});

        var realCurrentIcon = props.icon !== null && typeof props.icon === 'object' ?
            props.icon.left : props.icon;

        var server = new Server;
        server.loadDefaultIcons(this.props.unitType, function(icons) {
            that.setState({icons:icons});
            var isDefault = false;
            for(let i=0;i<icons.length; i++) {
                let icon = icons[i];
                let realIcon = icon !== null && typeof icon === 'object' ? icon.left : icon;
                if(realCurrentIcon == realIcon){
                    isDefault = true;
                    break;
                }
            }
            that.setState({showMyIconBlock:!isDefault});
        });
    }

    render(){
        return <div>
            <DefaultImageBlock
                icon={this.props.icon}
                icons={this.state.icons}
                callback={(icon)=>{
                    this.setState({icon: icon, showMyIconBlock: false});
                    this.props.callback(icon);
                }}/>
            <span>{this.props.labels['Own icon']}:</span>
            <input type='checkbox' value={this.state.showMyIconBlock}
                   onChange={(e)=>{this.setState({showMyIconBlock: e.target.checked})}}
            /><br />
            {this.state.showMyIconBlock &&
                <ArmyImageSelector image={this.state.icon}
                   imageType='armyImage'
                   allowRotate={this.props.allowRotate}
                   labels={this.props.labels}
                   changeCallback={(image) => {
                       this.setState({icon: image});
                       this.props.callback(image);
                   }}/>
            }
        </div>
    }
}

class DefaultImageBlock extends React.Component {

    componentWillReceiveProps(newProps){
        this.setState({icon:newProps.icon});
    }

    componentWillMount(){
        this.setState({icon:this.props.icon});
    }

    render() {
        if(!this.props.icons){
            return null;
        }
        var realCurrentIcon = this.state.icon !== null && typeof this.state.icon === 'object' ?
            this.state.icon.left : this.state.icon;

        var rows = [];
        var cells = [];

        let i;
        for(i=0;i<this.props.icons.length; i++){
            let icon = this.props.icons[i];
            let realIcon = icon !== null && typeof icon === 'object' ? icon.left : icon;

            cells.push(<td className={realCurrentIcon == realIcon ? 'selected' : ''}  key={'cell_'+i}
                           onClick={()=>{this.selectIcon(icon)}}>
                <img src={'/uploads/'+realIcon}/>
            </td>);

            if(i % 8 === 7){
                rows.push(<tr key={'row_'+i}>{cells}</tr>);
                cells = [];
            }
        }
        if(i % 8 !== 7){
            rows.push(<tr key={'row_'+i}>{cells}</tr>);
        }

        return <table className="b-default-images-table">
            <tbody>
                {rows}
            </tbody>
        </table>
    }

    selectIcon(icon){
        this.setState({icon:icon});
        this.props.callback(icon);
    }
}
export default ImageBlock;

