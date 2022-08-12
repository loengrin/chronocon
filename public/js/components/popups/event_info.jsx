var React = require('react');
import Server from '../../server/server.js';
import { connect } from 'react-redux'
import { openBigImage } from '../../actions/actions';

/**
  Component for event info window
*/
class EventInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {description:''};
    }

    componentWillReceiveProps(newProps){
        this.setArticle(newProps.event);
    }

    componentWillMount(){
        this.setArticle(this.props.event);
    }

    setArticle(event){

        var articleId = event.getField('article');
        var that = this;
        if(articleId){
            var server = new Server;
            server.getArticleText(articleId, function(article){
                article = article.replace(/<br>/g, "\n");
                that.setState({description:article});
            });
        }
    }

    render() {
        var isImageClickable = this.props.event.getField('image') && this.props.event.getField('image').indexOf('_min') !=-1;
;
        return <div>
            {/*image*/}
            { this.props.event.getField('image') && !isImageClickable &&
                <img className="b-unit-popup__image" src={"/uploads/"+this.props.event.getField('image')}/>
            }
            { this.props.event.getField('image') && isImageClickable &&
               <img className="b-unit-popup__image_clickable" src={"/uploads/"+this.props.event.getField('image')}
                onClick={() => this.openBigImage(this.props.event.getField('image'))} />
            }
           
            {/*description*/}
            <div>
                <p>
                    {this.state.description.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br/></span>
                    })}
                </p>
            </div>
        </div>
    }
    
    openBigImage(bigImage){  
        this.props.openBigImage("/uploads/"+bigImage.replace('_min',''))
    }
}

export default connect((state, ownProps) => ({
        labels: state.labels,
        event: ownProps.event,
    }),
    (dispatch, ownProps) => {
        return {
           openBigImage: (bigImage) => {
                dispatch(openBigImage(bigImage));
            }
        }
    }
)(EventInfo);
