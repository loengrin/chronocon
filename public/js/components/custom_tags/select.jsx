var React = require('react');

/**
  Component select element 
*/
class Select extends React.Component {

    render(){
        var options;
        if(this.props.intMode) {
            options={};
            for (var i = this.props.min; i <= this.props.max; i++) {
                options[i] = i;
            }
        }
        else{
            options = this.props.options;
        }

        var optionElems=[];
        for(var optionKey in options) {
            var optionValue = options[optionKey];
            optionElems.push(<option value={optionKey} key={optionKey}>{optionValue}</option>);
        }
        return <select value={this.props.selectedOption ? this.props.selectedOption : ''}
                       onChange={(e)=>{this.props.callback(e.target.value)}}>
            {optionElems}
        </select>
    }
}
export default Select;

