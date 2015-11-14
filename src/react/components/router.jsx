/**
 * External dependencies
 */
var React = require( 'react/addons' ),
	page = require( 'page' );

/**
 * Internal dependencies
 */
var Project = require( './project' ),
	Navigation = require( './navigation' );

var Router = React.createClass({

	componentDidMount: function() {
		page( '/category/:slug', function ( ctx ) {
			var slug = ctx.params.slug;
			var url = SentrySettings.URL.root +  '/terms/category/?child_of=' + slug;
			this.setState( { component: <Project url={url} current={slug} /> } );
			this.refs.header.setState( { current: slug } );
		}.bind( this ) );

		page.start();

	},

	getInitialState: function() {
		return { component: <div /> };
	},

	render: function() {
		var url = SentrySettings.URL.root + '/terms/category/?per_page=20';
		return (
			<div>
				<Navigation ref='header' url={ url } current='' />
				{ this.state.component }
			</div>
		);
	}

});

module.exports = Router;