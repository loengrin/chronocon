import ImageSelector from '../custom_tags/image_selector.jsx';

var React = require('react');
import * as popup_types from '../../actions/popup_types';
import { showPopup, saveUnitDescription } from '../../actions/actions';
import Server from '../../server/server.js';
import { connect } from 'react-redux'

/**
  Component for unit description form
*/
class UnitInfoEditPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errors: [], fields: {}};
    }

    componentWillReceiveProps(newProps){
        this.setStateByProps(newProps);
    }

    componentWillMount(){
        this.setStateByProps(this.props);
    }

    setStateByProps(props){
        var that = this;

        var fields = {
            image: props.unit.getField('image'),
            article: '',
        }

        var articleId = props.isStatic ?
            props.unit.getField('article') :
            props.dynamicDescription ? props.dynamicDescription.getValue() : '';

        if(articleId){
            var server = new Server;
            server.getArticleText(articleId, function(article){
                fields['article'] = article.replace(/<br>/g, "\n");

                that.setState({
                    fields: fields,
                });
            });
        }
        this.setState({
            fields: fields,
        });

    }

    render() {

      return <div className='b-unit-popup-form'>
        <table className="show_object_table">
            <tbody>
              <tr><td>{this.props.labels['Article']}</td><td>
                  <textarea className='b-artile-textarea'
                            onChange={(e)=>{this.setField('article',e.target.value)}}
                            value={ this.state.fields.article } />
              </td></tr>
              {this.props.isStatic &&
              <tr>
                  <td>{this.props.labels['Picture']}</td>
                  <td>
                      <div className="edit_image_block_div js-unit-image-block">
                          <ImageSelector image={this.state.fields.image}
                                         imageType='unitImage'
                                         handleChange={(image) => {this.setField('image', image)}}
                          />
                      </div>
                  </td>
              </tr>
              }
            </tbody>
        </table>
        <a className="b-button b-save-button js-submit" onClick={()=>{this.save()}}>
            {this.props.labels['Save']}
            </a>
        &nbsp;&nbsp;<a href='#' className="b-cancel" onClick={()=>{this.props.goBack()}}>{this.props.labels['Cancel']}</a>
      </div>;
    }

    setField(fieldName, fieldValue) {
        let fields = this.state.fields;
        fields[fieldName] = fieldValue;
        this.setState({fields: fields});
    }

    save() {
        var that = this;
        var fields = this.state.fields;

        var server = new Server;
        server.saveArticle(fields['article'], function(response){
            fields['article'] = response.articleId;
            that.props.saveUnitDescription(fields);
            that.props.goBack();
        });

    }

}

export default connect((state, ownProps) => {
        console.log(state, ownProps);
        return {
            unit: ownProps.unit,
            dynamicDescription: ownProps.dynamicDescription,
            isNew: ownProps.isNew,
            isStatic: ownProps.isStatic,
        }},
    (dispatch, ownProps) => {
        return {
            saveUnitDescription: (fields) => {
                dispatch(saveUnitDescription(
                    ownProps.unit.getId(),
                    fields,
                    ownProps.isStatic,
                    ownProps.dynamicDescription ? ownProps.dynamicDescription.getId() : null,
                    ownProps.isNew
                ));
            },
            goBack: () => {
                dispatch(showPopup(popup_types.UNIT_INFO, {
                    unit: ownProps.unit,
                    dynamicDescription: ownProps.dynamicDescription,
                }));

            }
        }
    }
)(UnitInfoEditPopup);
