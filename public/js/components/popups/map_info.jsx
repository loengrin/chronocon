var React = require('react');
import Server from '../../server/server.js';
import { connect } from 'react-redux'


/**
  Component for map information window
*/
class MapInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {description:''};
    }

    componentWillReceiveProps(newProps){
        this.setArticle(newProps.mapInfo);
    }

    componentWillMount(){
        this.setArticle(this.props.mapInfo);
    }

    setArticle(mapInfo){
        var articleId = mapInfo.getField('article');
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
        return <div>
            {/*image*/}
            { this.props.mapInfo.getField('image') &&
                <img className="b-unit-popup__image" src={'/uploads/'+this.props.mapInfo.getField('image')}/>
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

}

export default connect((state, ownProps) => ({
        mapInfo: state.time.getTimeObjectById('MAIN'),
    })
)(MapInfo);
