var $ = require("jquery");
var React = require('react');

/**
  Component for uploading image 
*/

class ImageSelector extends React.Component {

    componentWillReceiveProps(newProps){
        this.setState({image:newProps.image});
    }

    componentWillMount(){
        this.setState({image:this.props.image});
    }

    uploadFile(){
        var fd = new FormData();
        fd.append('fileToUpload', this.refs.file.files[0]);
        var that = this;
        $.ajax({
            url:'/ajax/images/save/'+this.props.imageType,
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(rawData){
                var data  = JSON.parse(rawData);
                that.setState({image:data.msg});
                that.props.handleChange(data.msg, data.width, data.height);
            }
        });
    }

    delImage(){
        this.setState({image:null});
        this.props.handleChange(null);
    }

    render(){
        return (
            <div>
                {this.state.image &&
                    <img className="info_block_edit_image" src={'/uploads/' + this.state.image}/>
                }
                {this.state.image &&
                    <button className="b-button_del b-button" onClick={()=>this.delImage()} />
                }

                <form ref="uploadForm" className="info_block_edit_image" encType="multipart/form-data" >
                    <input ref="file" type="file" name="file" className="upload-file" onChange={()=>{this.uploadFile()}}/>
                </form>
            </div>
        );
    }
};


export default ImageSelector;