/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
var List = require( './list' ),
	AppStore = require( 'store/app-store' ),
	API = require( 'utils/server' );

/**
 * Method to retrieve state from Stores
 */
function getState() {
	return {
		data: AppStore.getLists()
	};
}

/**
 * Project component
 */
var Project = React.createClass( {
	getInitialState: function() {
		return getState();
	},
	componentDidMount: function() {
		API.getLists( this.props.url );
		AppStore.addChangeListener( this._onChange );
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener( this._onChange );
	},
	_onChange: function() {
		this.setState( getState() );
	},

	newList: function() {
		return(
			<div className="list empty-list" key="new-list">
				<button className="add-list"><i className="fa fa-plus fa-2x"></i></button>
			</div>
		);
	},

	render: function() {
		var lists = this.state.data.map( function( cat, i ) {
			var url = SentrySettings.URL.root + '/posts/?filter[category_name]=' + cat.slug;
			return (
				<List key={ i } url={ url } name={ cat.name } slug={ cat.slug } project={ this.props.current } />
			)
		}.bind( this ) );

		lists.push( this.newList() );

		var color = SentrySettings.colors[ this.props.current ] || 'ff0000';
		document.getElementById( 'sentry-color-css' ).href = SentrySettings.URL.base + '/sentry-css/' + color + '/';

		return (
			<div className="project">
				{ lists }
			</div>
		);
	}
} );

module.exports = Project;