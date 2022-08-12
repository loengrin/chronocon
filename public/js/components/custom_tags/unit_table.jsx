var React = require('react');

/**
  Component for unit parameters table.
*/
class UnitTable extends React.Component {

    render() {
        if(!this.props.name && (!this.props.parameters || !this.props.parameters.length)) {
            return false;
        }
        var hasThreeColumns = this.props.parameters.length && this.props.parameters[0].value2 !== undefined;

        var paramRows = [];
        for(var i=0;i<this.props.parameters.length; i++){
            paramRows.push(<tr key={i}>
                <th><div>{this.props.parameters[i].name}</div></th>
                <td colSpan={hasThreeColumns && !this.props.parameters[i].value2 ? 2 : 1}>
                    <div>{this.props.parameters[i].value}</div>
                </td>
                {hasThreeColumns && this.props.parameters[i].value2 &&
                    <td><div>{this.props.parameters[i].value2}</div></td>
                }
            </tr>);
        }
        return <table className="info_table">
            <tbody>
                {this.props.name &&
                    <tr>
                        <td colSpan={hasThreeColumns ? 3 : 2} className="title">{this.props.name}</td>
                    </tr>
                }
                {this.props.dateLabel &&
                <tr>
                    <td colSpan={hasThreeColumns ? 3 : 2} className="title">{this.props.dateLabel}</td>
                </tr>
                }
                {paramRows}
            </tbody>
        </table>

    }
}
export default UnitTable;
