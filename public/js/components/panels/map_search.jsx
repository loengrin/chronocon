var React = require('react');
import { connect } from 'react-redux'
import { hideSearchBlock, searchOnMap } from '../../actions/actions';


/**
  Component for search panel, it became visible when user clicks on seach button iin edit mode panel.
*/
class MapSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {searchField: ''};
    }

    componentDidUpdate(){
        var input = document.getElementsByClassName('b-search-field');
        console.log(input);
        if(input.length) {
            var autocomplete = new google.maps.places.SearchBox(input[0]);
            var that = this;
            google.maps.event.addListener(autocomplete, 'places_changed', function () {
                that.searchOnMap();
            });
        }
    }

    render() {
        if(!this.props.isSearchBlockDisplayed){
            return false;
        }
        return <div className="b-search-block">
            <input className="b-search-field"
                   value={this.setState.searchField}
                   onChange={(e)=>{this.setState({searchField: e.target.value})}}
            />
            <button className="b-search-button b-button" onClick={()=>{this.searchOnMap()}}>
                {this.props.labels['Search']}
            </button>
            <button className="b-search-close-button b-button" onClick={()=>{this.props.hideSearchBlock()}}>
                {this.props.labels['Close']}
            </button>
        </div>
    }

    searchOnMap(){
        this.props.searchOnMap(this.state.searchField)
    }
}

export default connect((state, ownProps) => ({
        labels: state.labels,
        isSearchBlockDisplayed: state.isSearchBlockDisplayed,
    }),
    (dispatch, ownProps) => {
        return {
            hideSearchBlock: () => {
                dispatch(hideSearchBlock());
            },
            searchOnMap: (searchString) => {
                dispatch(searchOnMap(searchString));
            },

        }
    }
)(MapSearch);