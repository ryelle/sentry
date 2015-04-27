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

		var self = this;

		page( '/category/:slug', function ( ctx ) {
			var slug = ctx.params.slug;
			var url = "/wp-json/wp/terms/category/?child_of=" + slug;
			self.setState({ component: <Project url={url} current={slug} /> });
			self.refs.header.setState({ current: slug });
		});

		page.start();

	},

	getInitialState: function() {
		return { component: <div /> };
	},

	render: function() {
		return (
			<div>
				<Navigation ref="header" url="/wp-json/wp/terms/category/" current="" />
				{ this.state.component }
			</div>
		);
	}

});

module.exports = Router;