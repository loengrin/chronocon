var React = require('react');
import Server from '../../server/server.js';
import ImageSelector from './image_selector.jsx';

/**
 * Component for upload image for movable unit. Unit can move to right or left,
 * that is why we need a possibility to create two images - for left and right direction.
 */
class ArmyImageSelector extends React.Component {

    componentWillMount(){
        var hasRight =  typeof this.props.image === 'object';
        this.setState({hasRight:hasRight, image:this.props.image, allowRotate:this.props.allowRotate});
    }

    componentWillReceiveProps(newProps){
        var hasRight =  typeof newProps.image === 'object';
        this.setState({hasRight:hasRight, image:newProps.image, allowRotate:newProps.allowRotate});
    }

    render() {
        var image = this.state.hasRight ? this.state.image.left : this.state.image;

        return <div>
            {this.state.allowRotate &&
                <label><input type="checkbox" checked={this.state.hasRight} onChange={(e) => {this.changeHasRight(e)}}/>
                    {this.props.labels['Rotate']}
                </label>
            }
            <ImageSelector image={image} imageType={this.props.imageType} handleChange={(image)=>{this.handleChange(image);}}/>
            {this.state.hasRight &&
                <button onClick={()=>{this.swap()}} style={{float:'left'}}>{"<->"}</button>
            }
            {this.state.hasRight &&
                <img className="info_block_edit_image" src={'/uploads/' + this.state.image.right} />
            }
        </div>
    }

    handleChange(image){
        if(!image) {
            image='_def_army_boat_red.png';
        }
        this.setState({image: image});
        this.props.changeCallback(image);
    }

    swap(){
        var image = this.state.image;
        var tmp = image.left;
        image.left = image.right;
        image.right = tmp;
        this.handleChange(image);
    }

    changeHasRight(e){
        var hasRight = e.target.checked;
        var that = this;
        var server = new Server;
        if(hasRight){
             server.rotateIcon(that.state.image, function(response){
                var image =  {left:that.state.image,'right': response.filename}
                that.setState({hasRight: hasRight, image: image});
                that.handleChange(image);
            });
        }
        else{
            var image = this.state.image.left;
            that.setState({hasRight: hasRight, image: image});
            this.handleChange(image);
        }
    }
}

export default ArmyImageSelector;