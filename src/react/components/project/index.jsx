/**
 * External dependencies
 */
var React = require( 'react/addons' );

/**
 * Internal dependencies
 */
var List = require( './list' ),
    Server = require( 'store/server' );

/**
 * Make it so…
 */

var Project = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.setState({ data: [] });
	},

	newList: function(){
		return(
			<div className="list empty-list" key="new-list">
				<button className="add-list"><i className="fa fa-plus fa-2x"></i></button>
			</div>
		);
	},

	render: function() {
		var self = this;
		var lists = this.state.data.map( function( cat ){
			var url = SentrySettings.URL.root + '/posts/?category_name=' + cat.slug;
			return (
				<List key={cat.id} url={url} name={cat.name} slug={cat.slug} project={self.props.current} />
			)
		});

		lists.push( this.newList() );

		var color = SentrySettings.colors[this.props.current] || 'ff0000';
		document.getElementById( 'sentry-color-css' ).href = SentrySettings.URL.base + '/sentry-css/' + color + '/';

		return (
			<div className="project">
				{ lists }
			</div>
		);
	}
});

module.exports = Project;