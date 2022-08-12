import ParamTable from '../custom_tags/param_table.jsx';

var React = require('react');
import { connect } from 'react-redux'
import { saveTableTemplates, hidePopup } from '../../actions/actions';
import CommonLib from '../../libs/common/common_lib.js';

/**
  Component for unit table templates form
*/
class UnitTableTemplates extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({'templates':this.props.templates ? this.props.templates : []});
        console.log('componentWillMount',this.props.templates);
    }

    componentWillReceiveProps(newProps){
        this.setState({'templates':newProps.templates});
        console.log('componentWillReceiveProps',newProps.templates);
    }

    render() {
        console.log(this.state);

        var templateBlocks = [];
        for (let i=0;i< this.state.templates.length; i++) {
            var template = this.state.templates[i];
            templateBlocks.push(<div key={i}>
                <input className="info_table_name_input" value={template.name}  onChange={(e)=>this.handleChangeName(e,i)}/>
                <button className="b-button_del b-button del_button_middle" onClick={()=>this.deleteTemplate(i)}/>
                <br /><br />
                <ParamTable parameters={template.values}
                            handleChange = {(parameters)=>{this.handleChangeTable(parameters,i)}}
                            oneColumnMode = {true}
                            labels={this.props.labels}
                            templates = {[]}/>
            </div>);
        }

        return <div>
            <div>
                {templateBlocks}
                <a className="b-button b-save-button"
                        onClick={()=>this.props.saveTableTemplates(this.state.templates)}>
                    {this.props.labels['Save']}
                </a>
                <span className="b-button" onClick={()=>this.addTemplate()}>
                    {this.props.labels['Add template']}
                </span>
            </div>
        </div>
    }

    deleteTemplate(i) {
        var templates = this.state.templates;
        templates.splice(i,1);
        this.setState({templates: templates});
    }

    addTemplate(){
        var templates = this.state.templates;
        templates.push({
            'name':this.props.labels['Template']+" #"+(templates.length+1),
            'values':[]
        });
        this.setState({templates: templates});

    }

    handleChangeTable(parameters, i){
        var templates = this.state.templates;
        templates[i].values = parameters;
        this.setState({templates: templates});
    }

    handleChangeName(e, i){
        console.log(arguments);
        const name = e.target.value;
        var templates = this.state.templates;
        templates[i].name = name;
        this.setState({templates: templates});
    }
}

export default connect((state, ownProps) => ({
        labels: state.labels,
        templates: CommonLib.clone(state.time.getTimeObjectById('MAIN').getField('unitTableTemplates')),
    }),
    (dispatch, ownProps) => {
        return {
            saveTableTemplates: (templates) => {
                dispatch(saveTableTemplates(templates));
                dispatch(hidePopup());
            },
        }
    }
)(UnitTableTemplates);
